import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './CategoryModal.module.css';
import { getCategoryTree, addCategory, updateCategory } from '../api/api';
import axios from 'axios';

const CategoryModal = ({ isOpen, onClose, onSave, category = {}, categories = [], mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentCategoryId: '',
    description: '',
    image: '',
    imageFile: null,
    icon: '',
    iconFile: null,
  });

  const [errors, setErrors] = useState({});
  const [categoryTree, setCategoryTree] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      getCategoryTree()
        .then(res => {
          if (res.data.succeeded) {
            setCategoryTree(res.data.data);
          }
        })
        .catch(err => console.error("Failed to fetch category tree:", err));
    }
  }, [isOpen]);

  const flattenTree = (nodes, depth = 0) => {
    return nodes.flatMap(node => [
      { id: node.id, name: `${"— ".repeat(depth)}${node.name}` },
      ...flattenTree(node.subCategories || [], depth + 1)
    ]);
  };

  const categoryOptions = flattenTree(categoryTree);

  useEffect(() => {
    if (isOpen && category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        parentCategoryId: category.parentCategoryId ?? null,
        description: category.description || '',
        image: category.image || '',
        icon: category.icon || '',
        status: category.status === 'active'
      });
      setErrors({});
    } else if (isOpen && mode === 'add') {
      setFormData({
        name: '',
        parentCategoryId: null,
        description: '',
        image: '',
        imageFile: null,
        icon: '',
        iconFile: null,
        status: true
      });
      setErrors({});
    }
  }, [isOpen, category, mode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      [`${type}File`]: file,
      [type]: URL.createObjectURL(file)
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (formData.parentCategoryId && mode === 'edit' && category && category.id !== undefined) {
      const isCircular = checkCircularDependency(
        formData.parentCategoryId,
        category.id
      );
      if (isCircular) {
        newErrors.parentCategoryId =
          'Cannot select this category as it would create a circular dependency';
      }
    }

    const wordCount = getWordCount(formData.description);
    if (wordCount > 500) {
      newErrors.description = 'Description cannot exceed 500 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCircularDependency = (parentCategoryId, categoryId) => {
    if (!parentCategoryId || categoryId === undefined) return false;
    if (parseInt(parentCategoryId) === parseInt(categoryId)) return true;
    if (!Array.isArray(categories) || categories.length === 0) return false;
    const parent = categories.find(c => c && c.id === parseInt(parentCategoryId));
    if (!parent) return false;

    return checkCircularDependency(parent.parentCategoryId, categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataObj = new FormData();
    formDataObj.append("Name", formData.name);
    formDataObj.append("Description", formData.description || "");

    if (formData.parentCategoryId) {
      formDataObj.append("ParentCategoryId", formData.parentCategoryId);
    }
    if (formData.imageFile) {
      formDataObj.append("Image", formData.imageFile);
    }
    if (formData.iconFile) {
      formDataObj.append("Icon", formData.iconFile);
    }

    try {
      if (mode === 'edit' && category?.id) {
        await updateCategory(category.id, formDataObj);
        alert("Category updated successfully!");
      } else {
        await addCategory(formDataObj);
        alert("Category added successfully!");
      }
      onClose();
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert(mode === 'edit' ? "Failed to update category." : "Failed to save category.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'edit' ? 'Update Category' : 'Add New Category'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form id="categoryForm" className={styles.form} onSubmit={handleSubmit}>

            {/* Category Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.name })}
                placeholder="Enter category name"
                required
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            {/* Parent Category */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Parent Category</label>
              <select
                id="parentCategoryId"
                value={formData.parentCategoryId ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentCategoryId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className={classNames(styles.select, { [styles.error]: errors.parentCategoryId })}
              >
                <option value="">None</option>
                {categoryOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {errors.parentCategoryId && <span className={styles.errorMessage}>{errors.parentCategoryId}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={classNames(styles.textarea, { [styles.error]: errors.description })}
                placeholder="Enter category description..."
                rows={4}
              />
              <div className={styles.characterCount}>
                {getWordCount(formData.description)} / 500 words
              </div>
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>

            {/* Category Image */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
              />
              {formData.image && (
                <img src={formData.image} alt="Category" style={{ maxWidth: '100px' }} />
              )}
            </div>

            {/* Category Icon */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "icon")}
              />
              {formData.icon && (
                <img src={formData.icon} alt="Icon" style={{ maxWidth: '50px' }} />
              )}
            </div>
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={classNames(styles.button, styles.cancelButton)}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="categoryForm"
            className={classNames(styles.button, styles.saveButton)}
          >
            <FiSave />
            {mode === 'edit' ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
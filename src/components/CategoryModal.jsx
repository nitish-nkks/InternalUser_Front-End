import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './CategoryModal.module.css';
import { buildCategoryOptions } from '../constants/categoryData';

const CategoryModal = ({ isOpen, onClose, onSave, category = null, categories = [], mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: '',
    status: true
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        parentId: category.parentId || '',
        description: category.description || '',
        status: category.status === 'active'
      });
      setErrors({});
    } else if (isOpen && mode === 'add') {
      setFormData({
        name: '',
        parentId: '',
        description: '',
        status: true
      });
      setErrors({});
    }
  }, [isOpen, category, mode]);

  // Handle outside click
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

  // Handle ESC key
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
    
    // Handle description word limit (500 words)
    if (name === 'description') {
      const wordCount = getWordCount(value);
      if (wordCount > 500) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: !prev.status
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    // Check for circular dependency
    if (formData.parentId && mode === 'edit') {
      const isCircular = checkCircularDependency(formData.parentId, category.id);
      if (isCircular) {
        newErrors.parentId = 'Cannot select this category as it would create a circular dependency';
      }
    }
    
    const wordCount = getWordCount(formData.description);
    if (wordCount > 500) {
      newErrors.description = 'Description cannot exceed 500 words';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCircularDependency = (parentId, categoryId) => {
    if (!parentId) return false;
    if (parentId === categoryId) return true;
    
    const parent = categories.find(c => c.id === parseInt(parentId));
    if (!parent) return false;
    
    return checkCircularDependency(parent.parentId, categoryId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const categoryData = {
      ...formData,
      parentId: formData.parentId ? parseInt(formData.parentId) : null,
      status: formData.status ? 'active' : 'inactive'
    };

    if (mode === 'edit' && category) {
      categoryData.id = category.id;
    }

    onSave(categoryData);
    onClose();
  };

  if (!isOpen) return null;

  // Get available parent options (excluding self and children to prevent circular dependencies)
  const getAvailableParents = () => {
    const options = buildCategoryOptions();
    
    if (mode === 'edit' && category) {
      // Filter out the current category and its children
      const filterCategory = (categoryId) => {
        const children = categories.filter(c => c.parentId === categoryId);
        return [categoryId, ...children.flatMap(child => filterCategory(child.id))];
      };
      
      const excludeIds = filterCategory(category.id);
      return options.filter(option => !excludeIds.includes(option.value));
    }
    
    return options;
  };

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
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
          <form className={styles.form} onSubmit={handleSubmit}>
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Parent Category</label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                className={classNames(styles.select, { [styles.error]: errors.parentId })}
              >
                {getAvailableParents().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.parentId && <span className={styles.errorMessage}>{errors.parentId}</span>}
              <div className={styles.helpText}>
                Select a parent category to create a hierarchical structure
              </div>
            </div>

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

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <div className={styles.statusToggleContainer}>
                <div 
                  className={classNames(styles.statusToggle, { 
                    [styles.active]: formData.status,
                    [styles.inactive]: !formData.status
                  })}
                  onClick={handleStatusToggle}
                >
                  <div className={styles.toggleSlider}></div>
                </div>
                <span className={styles.statusLabel}>
                  {formData.status ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={styles.helpText}>
                {formData.status ? 'Category is visible and available for use' : 'Category is hidden and not available for use'}
              </div>
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
            className={classNames(styles.button, styles.saveButton)}
            onClick={handleSubmit}
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
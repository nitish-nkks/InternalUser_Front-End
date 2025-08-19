import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiSave } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProductModal.module.css';
import { addProduct, getCategoryTree } from '../api/api';

const renderCategoryOptions = (categories, prefix = "") => {
  return categories.map(cat => (
    <React.Fragment key={cat.id}>
      <option value={cat.id}>
        {prefix}{cat.name}
      </option>
      {cat.subCategories && cat.subCategories.length > 0 &&
        renderCategoryOptions(cat.subCategories, prefix + "-- ")}
    </React.Fragment>
  ));
};

const ProductModal = ({ isOpen, onClose, onSave, product = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    stockQuantity: '',
    minOrderQuantity: '',
    categoryId: null,
    productImages: [],
    isFeatured: false,
    isNewProduct: false,
    isBestSeller: false,
  });
  const [categoryTree, setCategoryTree] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await getCategoryTree();
          setCategoryTree(res.data.data);
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (product && (mode === 'edit' || mode === 'view')) {
        const existingImages = product.images ? product.images.split(',') : [];
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          discountPercentage: product.discountPercentage || '',
          stockQuantity: product.stockQuantity || '',
          minOrderQuantity: product.minOrderQuantity || '',
          categoryId: product.categoryId || '',
          productImages: existingImages,
          isFeatured: product.isFeatured ?? false,
          isNewProduct: product.isNewProduct ?? false,
          isBestSeller: product.isBestSeller ?? false,
        });
        setImagePreviews(existingImages);
      } else if (mode === 'add') {
        setFormData({
          name: '',
          description: '',
          price: '',
          discountPercentage: '',
          stockQuantity: '',
          minOrderQuantity: '',
          categoryId: null,
          productImages: [],
          isFeatured: false,
          isNewProduct: false,
          isBestSeller: false,
        });
        setImagePreviews([]);
        setImageFiles([]);
      }
      setErrors({});
    }
  }, [isOpen, product, mode]);

  // Handle outside click and ESC key (no changes)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (name === 'description') {
      const wordCount = getWordCount(inputValue);
      if (wordCount > 500) {
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleImageUpload = (files) => {
    const newImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const combinedFiles = [...imageFiles, ...newImageFiles];
    if (combinedFiles.length > 5) {
      // handle error
      return;
    }
    setImageFiles(combinedFiles);

    const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newImagePreviews]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.discountPercentage && formData.discountPercentage >= 100) newErrors.discountPercentage = 'Discount percentage must be less than 100';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock must be 0 or greater';
    if (!formData.minOrderQuantity || formData.minOrderQuantity <= 0) newErrors.minOrderQuantity = 'Minimum order quantity must be greater than 0';
    if (getWordCount(formData.description) > 500) newErrors.description = 'Description cannot exceed 500 words';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "view") {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      stockQuantity: parseInt(formData.stockQuantity),
      minOrderQuantity: parseInt(formData.minOrderQuantity),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      productImages: formData.productImages,
      isFeatured: formData.isFeatured,
      isNewProduct: formData.isNewProduct,
      isBestSeller: formData.isBestSeller,
    };

    setIsLoading(true);
    try {
      let response;
      if (mode === "add") {
        response = await addProduct(productData);
      }

      console.log("Product saved successfully:", response);
      onSave(response.data);

      window.alert("✅ Product added successfully!");

      window.location.href = "/products";
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ api: error.message || "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'view' ? 'Product Details' : mode === 'edit' ? 'Update Feed Product' : 'Create New Feed Product'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.name })}
                placeholder="Enter product name"
                disabled={mode === 'view'}
                required
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={classNames(styles.textarea, { [styles.error]: errors.description })}
                placeholder="Enter product description..."
                rows={4}
                disabled={mode === 'view'}
              />
              <div className={styles.characterCount}>
                {getWordCount(formData.description)} / 500 words
              </div>
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.price })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={mode === 'view'}
                  required
                />
                {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount Percentage (%)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.discountPercentage })}
                  placeholder="0"
                  min="0"
                  max="100"
                  disabled={mode === 'view'}
                />
                {errors.discountPercentage && <span className={styles.errorMessage}>{errors.discountPercentage}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock/Inventory *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.stockQuantity })}
                  placeholder="0"
                  min="0"
                  disabled={mode === 'view'}
                  required
                />
                {errors.stockQuantity && <span className={styles.errorMessage}>{errors.stockQuantity}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Min Order Quantity *</label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.minOrderQuantity })}
                  placeholder="1"
                  min="1"
                  disabled={mode === 'view'}
                  required
                />
                {errors.minOrderQuantity && <span className={styles.errorMessage}>{errors.minOrderQuantity}</span>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId ?? ""}
                onChange={handleInputChange}
                className={classNames(styles.select, { [styles.error]: errors.categoryId })}
                disabled={mode === "view"}
                required
              >
                <option value="" disabled>Select a category</option>
                {renderCategoryOptions(categoryTree)}
              </select>
              {errors.categoryId && <span className={styles.errorMessage}>{errors.categoryId}</span>}
            </div>
            {/* Added new boolean fields */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                  />
                  Is Featured
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isNewProduct"
                    checked={formData.isNewProduct}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                  />
                  Is New Product
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                  />
                  Is Best Seller
                </label>
              </div>
            </div>

            <div className={styles.imageUpload}>
              <label className={styles.label}>Product Images (Multiple)</label>

              {mode !== 'view' && (
                <div
                  className={classNames(styles.imageUploadArea, {
                    [styles.dragOver]: isDragOver
                  })}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload className={styles.uploadIcon} />
                  <div className={styles.uploadText}>
                    Click to upload or drag and drop
                  </div>
                  <div className={styles.uploadSubtext}>
                    PNG, JPG, GIF up to 10MB each (Max 5 images)
                  </div>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                      />
                      {mode !== 'view' && (
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mode !== 'view' && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className={styles.hiddenInput}
                />
              )}
            </div>
            {isLoading && <div className={styles.loading}>Saving product...</div>}
            {errors.api && <div className={styles.errorMessage}>{errors.api}</div>}
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={classNames(styles.button, styles.cancelButton)}
            onClick={onClose}
            disabled={isLoading}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              type="submit"
              className={classNames(styles.button, styles.saveButton)}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <FiSave />
              {mode === 'edit' ? 'Update Product' : 'Save Product'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
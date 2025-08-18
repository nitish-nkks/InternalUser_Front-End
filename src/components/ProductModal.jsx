import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiSave } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProductModal.module.css';
import { categoryOptions, statusOptions } from '../constants/productData';

const ProductModal = ({ isOpen, onClose, onSave, product = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'poultry',
    price: '',
    discountPrice: '',
    stock: '',
    status: 'active',
    description: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        sku: product.sku || `SKU-${product.id?.toString().padStart(4, '0')}` || '',
        category: product.category || 'poultry',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        status: product.status || 'active',
        description: product.description || '',
        images: []
      });
      setImagePreviews(product.image ? [product.image] : []);
      setErrors({});
    } else if (isOpen && mode === 'add') {
      setFormData({
        name: '',
        sku: '',
        category: 'poultry',
        price: '',
        discountPrice: '',
        stock: '',
        status: 'active',
        description: '',
        images: []
      });
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen, product, mode]);

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

  const handleImageUpload = (files) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      if (imagePreviews.length < 5) { // Limit to 5 images
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target.result]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, file]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
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
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU/Code is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.discountPrice && formData.discountPrice >= formData.price) {
      newErrors.discountPrice = 'Discount price must be less than regular price';
    }
    
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }
    
    const wordCount = getWordCount(formData.description);
    if (wordCount > 500) {
      newErrors.description = 'Description cannot exceed 500 words';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      stock: parseInt(formData.stock),
      image: imagePreviews[0] || null, // Use first image as main image
      images: imagePreviews
    };

    if (mode === 'edit' && product) {
      productData.id = product.id;
    }

    onSave(productData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={classNames(styles.modalOverlay, { [styles.open]: isOpen })}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'view' ? 'Product Details' : mode === 'edit' ? 'Update Feed Product' : 'Create New Feed Product'}
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
              <label className={styles.label}>SKU/Code *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.sku })}
                placeholder="Enter SKU or product code"
                disabled={mode === 'view'}
                required
              />
              {errors.sku && <span className={styles.errorMessage}>{errors.sku}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={mode === 'view'}
                  required
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={mode === 'view'}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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
                <label className={styles.label}>Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: errors.discountPrice })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={mode === 'view'}
                />
                {errors.discountPrice && <span className={styles.errorMessage}>{errors.discountPrice}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock/Inventory *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={classNames(styles.input, { [styles.error]: errors.stock })}
                placeholder="0"
                min="0"
                disabled={mode === 'view'}
                required
              />
              {errors.stock && <span className={styles.errorMessage}>{errors.stock}</span>}
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
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={classNames(styles.button, styles.cancelButton)}
            onClick={onClose}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              type="submit"
              className={classNames(styles.button, styles.saveButton)}
              onClick={handleSubmit}
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
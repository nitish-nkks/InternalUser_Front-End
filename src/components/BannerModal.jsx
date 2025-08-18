import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiImage, FiLink, FiUpload, FiEye } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './BannerModal.module.css';
import { statusOptions, positionOptions, validateImageFile, validateURL } from '../constants/bannerData';

const BannerModal = ({ isOpen, onClose, onSave, banner, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    url: '',
    status: 'active',
    position: 'hero',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (banner && mode === 'edit') {
      setFormData(banner);
      setImagePreview(banner.image);
    } else {
      setFormData({
        title: '',
        image: '',
        url: '',
        status: 'active',
        position: 'hero',
        description: ''
      });
      setImagePreview('');
    }
    setErrors({});
  }, [banner, mode, isOpen]);

  const handleInputChange = (field, value) => {
    // Handle description word limit (500 words)
    if (field === 'description') {
      const wordCount = getWordCount(value);
      if (wordCount > 500) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleStatusToggle = () => {
    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
    handleInputChange('status', newStatus);
  };

  const handleImageUpload = (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, image: validation.error }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setImagePreview(imageUrl);
      handleInputChange('image', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
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

  const handleImageUrlChange = (url) => {
    handleInputChange('image', url);
    setImagePreview(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Banner title is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Banner image is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'Banner URL is required';
    } else {
      const urlValidation = validateURL(formData.url);
      if (!urlValidation.valid) {
        newErrors.url = urlValidation.error;
      }
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
    }

    const wordCount = getWordCount(formData.description);
    if (wordCount > 500) {
      newErrors.description = 'Description cannot exceed 500 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiImage className={styles.modalIcon} />
            {mode === 'add' ? 'Add New Banner' : 'Edit Banner'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Banner Title */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Banner Title *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.title
                  })}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter banner title"
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title}</span>
                )}
              </div>

              {/* Banner Description */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  className={classNames(styles.formInput, styles.textarea, { [styles.error]: errors.description })}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter banner description"
                  rows={3}
                />
                <div className={styles.characterCount}>
                  {getWordCount(formData.description)} / 500 words
                </div>
                {errors.description && (
                  <span className={styles.errorText}>{errors.description}</span>
                )}
              </div>

              {/* Image Upload Section */}
              <div className={classNames(styles.formGroup, styles.imageUploadGroup)}>
                <label className={styles.formLabel}>
                  Banner Image *
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className={styles.imagePreview}
                    />
                    <div className={styles.imageOverlay}>
                      <FiEye className={styles.previewIcon} />
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  className={classNames(styles.uploadArea, {
                    [styles.dragOver]: isDragOver,
                    [styles.error]: errors.image
                  })}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={styles.uploadContent}>
                    <FiUpload className={styles.uploadIcon} />
                    <div className={styles.uploadText}>
                      <span className={styles.uploadTitle}>
                        {imagePreview ? 'Change Image' : 'Upload Banner Image'}
                      </span>
                      <span className={styles.uploadSubtitle}>
                        Drag & drop or click to select
                      </span>
                      <span className={styles.uploadFormats}>
                        Supports: JPEG, PNG, GIF, WebP (Max 5MB)
                      </span>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.hiddenFileInput}
                />

                {/* Image URL Input */}
                <div className={styles.urlInputContainer}>
                  <label className={styles.urlInputLabel}>Or enter image URL:</label>
                  <input
                    type="url"
                    className={styles.urlInput}
                    value={formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {errors.image && (
                  <span className={styles.errorText}>{errors.image}</span>
                )}
              </div>

              {/* Banner URL */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiLink className={styles.labelIcon} />
                  Link/URL *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.url
                  })}
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="Enter destination URL (e.g., /products or https://example.com)"
                />
                {errors.url && (
                  <span className={styles.errorText}>{errors.url}</span>
                )}
              </div>

              {/* Position */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Position *
                </label>
                <select
                  className={classNames(styles.formSelect, {
                    [styles.error]: errors.position
                  })}
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                >
                  {positionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <span className={styles.errorText}>{errors.position}</span>
                )}
              </div>

              {/* Status Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Status
                </label>
                <div className={styles.statusToggle}>
                  <button
                    type="button"
                    className={classNames(styles.toggleButton, {
                      [styles.active]: formData.status === 'active'
                    })}
                    onClick={handleStatusToggle}
                  >
                    <div className={styles.toggleSlider}>
                      <div className={styles.toggleHandle}></div>
                    </div>
                    <span className={styles.toggleLabel}>
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={classNames(styles.modalButton, styles.cancelButton)}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={classNames(styles.modalButton, styles.saveButton)}
              >
                {mode === 'add' ? 'Create Banner' : 'Update Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerModal;
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './EditProfileModal.module.css';
import { validateProfilePicture, getProfilePicturePreview, getProfilePicturePreviewSync } from '../constants/profileData';

const EditProfileModal = ({ isOpen, onClose, onSave, profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        profilePicture: profile.profilePicture || ''
      });
      setPreviewUrl(profile.profilePicture || '');
      setSelectedFile(null);
    }
    setErrors({});
  }, [profile, isOpen]);

  const handleInputChange = (field, value) => {
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

  const handleFileSelect = async (file) => {
    const validation = validateProfilePicture(file);
    
    if (!validation.valid) {
      setErrors(prev => ({
        ...prev,
        profilePicture: validation.error
      }));
      return;
    }

    setSelectedFile(file);
    
    try {
      // Convert to base64 data URL for persistence
      const preview = await getProfilePicturePreview(file);
      setPreviewUrl(preview);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      // Fallback to blob URL for preview
      const fallbackPreview = getProfilePicturePreviewSync(file);
      setPreviewUrl(fallbackPreview);
    }
    
    if (errors.profilePicture) {
      setErrors(prev => ({
        ...prev,
        profilePicture: ''
      }));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
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
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      profilePicture: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let profilePictureUrl = previewUrl || formData.profilePicture;
      
      // If there's a selected file, convert it to base64
      if (selectedFile) {
        try {
          profilePictureUrl = await getProfilePicturePreview(selectedFile);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          profilePictureUrl = getProfilePicturePreviewSync(selectedFile);
        }
      }
      
      const updatedProfile = {
        ...formData,
        profilePicture: profilePictureUrl
      };
      onSave(updatedProfile);
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
            <FiUser className={styles.modalIcon} />
            Edit Profile
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className={styles.profilePictureSection}>
              <label className={styles.sectionLabel}>Profile Picture</label>
              <div className={styles.profilePictureContainer}>
                {previewUrl ? (
                  <div className={styles.imagePreviewContainer}>
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className={styles.imagePreview}
                    />
                    <div className={styles.imageOverlay}>
                      <button
                        type="button"
                        className={styles.changeImageButton}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FiCamera />
                      </button>
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={handleRemoveImage}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={classNames(styles.uploadArea, {
                      [styles.dragOver]: isDragOver,
                      [styles.error]: errors.profilePicture
                    })}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={styles.uploadContent}>
                      <FiUpload className={styles.uploadIcon} />
                      <span className={styles.uploadText}>
                        Drag & drop your image or click to browse
                      </span>
                      <span className={styles.uploadSubtext}>
                        JPEG, PNG, WebP up to 5MB
                      </span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className={styles.hiddenFileInput}
                />
              </div>
              {errors.profilePicture && (
                <span className={styles.errorText}>{errors.profilePicture}</span>
              )}
            </div>

            {/* Form Fields */}
            <div className={styles.formGrid}>
              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiUser className={styles.labelIcon} />
                  Full Name *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.name
                  })}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiMail className={styles.labelIcon} />
                  Email Address *
                </label>
                <input
                  type="email"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.email
                  })}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiPhone className={styles.labelIcon} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.phone
                  })}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div className={classNames(styles.formGroup, styles.fullWidth)}>
                <label className={styles.formLabel}>
                  <FiMapPin className={styles.labelIcon} />
                  Address *
                </label>
                <textarea
                  className={classNames(styles.formInput, styles.textArea, {
                    [styles.error]: errors.address
                  })}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                />
                {errors.address && (
                  <span className={styles.errorText}>{errors.address}</span>
                )}
              </div>
            </div>
          </form>
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
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
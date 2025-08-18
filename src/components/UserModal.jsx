import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiKey, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './UserModal.module.css';
import { roleOptions, statusOptions, checkPasswordStrength } from '../constants/userData';

const UserModal = ({ isOpen, onClose, onSave, user, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: 'none', feedback: [] });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        ...user,
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active',
        password: '',
        confirmPassword: ''
      });
    }
    setErrors({});
    setPasswordStrength({ score: 0, strength: 'none', feedback: [] });
  }, [user, mode, isOpen]);

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

    // Check password strength on password change
    if (field === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleStatusToggle = () => {
    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
    handleInputChange('status', newStatus);
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

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (mode === 'add' || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength.strength === 'weak' || passwordStrength.strength === 'none') {
        newErrors.password = 'Password is too weak';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = { ...formData };
      if (mode === 'edit' && !userData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      }
      onSave(userData);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = {
      none: '#d9d9d9',
      weak: '#ff4d4f',
      medium: '#faad14',
      strong: '#52c41a',
      'very-strong': '#1890ff'
    };
    return colors[strength] || '#d9d9d9';
  };

  const getPasswordStrengthText = (strength) => {
    const texts = {
      none: 'No password',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      'very-strong': 'Very Strong'
    };
    return texts[strength] || 'None';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiUser className={styles.modalIcon} />
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Name Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiUser className={styles.labelIcon} />
                  Name *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.name
                  })}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiMail className={styles.labelIcon} />
                  Email *
                </label>
                <input
                  type="email"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.email
                  })}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>

              {/* Role Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiShield className={styles.labelIcon} />
                  Role *
                </label>
                <select
                  className={classNames(styles.formSelect, {
                    [styles.error]: errors.role
                  })}
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className={styles.errorText}>{errors.role}</span>
                )}
              </div>

              {/* Status Field */}
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

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiKey className={styles.labelIcon} />
                  Password {mode === 'add' && '*'}
                  {mode === 'edit' && <span className={styles.optionalText}>(leave blank to keep current)</span>}
                </label>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={classNames(styles.formInput, styles.passwordInput, {
                      [styles.error]: errors.password
                    })}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div 
                        className={styles.strengthProgress}
                        style={{ 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength.strength)
                        }}
                      ></div>
                    </div>
                    <div className={styles.strengthInfo}>
                      <span 
                        className={styles.strengthText}
                        style={{ color: getPasswordStrengthColor(passwordStrength.strength) }}
                      >
                        {getPasswordStrengthText(passwordStrength.strength)}
                      </span>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className={styles.strengthFeedback}>
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </div>

              {/* Confirm Password Field */}
              {(mode === 'add' || formData.password) && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FiKey className={styles.labelIcon} />
                    Confirm Password *
                  </label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={classNames(styles.formInput, styles.passwordInput, {
                        [styles.error]: errors.confirmPassword
                      })}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className={styles.errorText}>{errors.confirmPassword}</span>
                  )}
                </div>
              )}
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
                {mode === 'add' ? 'Create User' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
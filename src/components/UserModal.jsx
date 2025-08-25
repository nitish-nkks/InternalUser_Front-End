import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiKey, FiShield, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './UserModal.module.css';
import { roleOptions, statusOptions, checkPasswordStrength } from '../constants/userData';

const UserModal = ({ isOpen, onClose, onSave, user, mode }) => {
  const [formData, setFormData] = useState({
    id: '',
    employeeId: '',
    userName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    designation: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: 'none', feedback: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role options for dropdown
  const availableRoles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Support', label: 'Support' },
    { value: 'Sales', label: 'Sales' }
  ];

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        id: user.id,
        employeeId: user.employeeId || '',
        userName: user.userName || user.name || '',
        email: user.email || '',
        role: user.role || '',
        password: '',
        confirmPassword: '',
        designation: user.designation || '',
        department: user.department || ''
      });
    } else {
      setFormData({
        id: '',
        employeeId: '',
        userName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        designation: '',
        department: ''
      });
    }
    setErrors({});
    setPasswordStrength({ score: 0, strength: 'none', feedback: [] });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSubmitting(false);
  }, [user, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Check password strength on password change
    if (field === 'password') {
      if (value && checkPasswordStrength) {
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
      } else {
        setPasswordStrength({ score: 0, strength: 'none', feedback: [] });
      }

      // Clear confirm password error if passwords now match
      if (formData.confirmPassword && value === formData.confirmPassword && errors.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }

    // Check password match on confirm password change
    if (field === 'confirmPassword') {
      if (formData.password && value === formData.password && errors.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmployeeId = (employeeId) => {
    // Basic validation - can be customized based on your requirements
    return employeeId && employeeId.trim().length >= 3;
  };

  const validatePassword = (password) => {
    // Basic password validation
    if (!password) return false;
    if (password.length < 6) return false;

    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasLetter && hasNumber;
  };

  const validateForm = () => {
    const newErrors = {};

    // Employee ID validation
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (!validateEmployeeId(formData.employeeId)) {
      newErrors.employeeId = 'Employee ID must be at least 3 characters';
    }

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'Username must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    // Password validation for new users or when password is being changed
    if (mode === 'add' || formData.password.trim()) {
      if (!formData.password.trim()) {
        if (mode === 'add') {
          newErrors.password = 'Password is required';
        }
      } else {
        if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must be at least 6 characters and contain letters and numbers';
        }
      }

      // Confirm password validation
      if (formData.password.trim() && !formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare user data exactly matching the API payload structure
      const userData = {
        employeeId: formData.employeeId.trim(),
        userName: formData.userName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim()
      };

      // Add password only if provided (for both add and edit modes)
      if (formData.password.trim()) {
        userData.passwordHash = formData.password.trim();
      }

      // For edit mode, include the ID
      if (mode === 'edit' && formData.id) {
        userData.id = formData.id;
      }

      console.log('Submitting user data:', userData); // Debug log
      await onSave(userData);
    } catch (error) {
      console.error('Error saving user:', error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Employee ID Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiUser className={styles.labelIcon} />
                  Employee ID *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.employeeId
                  })}
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="Enter employee ID (e.g., 121212)"
                  disabled={isSubmitting || (mode === 'edit')} // Disable editing employee ID
                  maxLength={20}
                />
                {errors.employeeId && (
                  <span className={styles.errorText}>{errors.employeeId}</span>
                )}
              </div>

              {/* Username Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiUser className={styles.labelIcon} />
                  Username *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.userName
                  })}
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="Enter full name (e.g., John Doe)"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                {errors.userName && (
                  <span className={styles.errorText}>{errors.userName}</span>
                )}
              </div>

              {/* Email Field */}
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
                  placeholder="Enter email (e.g., user@example.com)"
                  disabled={isSubmitting}
                  maxLength={255}
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
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.role
                  })}
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select a role</option>
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className={styles.errorText}>{errors.role}</span>
                )}
              </div>

              {/* Designation Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiBriefcase className={styles.labelIcon} />
                  Designation *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.designation
                  })}
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Enter designation (e.g., Software Developer)"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                {errors.designation && (
                  <span className={styles.errorText}>{errors.designation}</span>
                )}
              </div>

              {/* Department Field */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  
                  Department *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.department
                  })}
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Enter department (e.g., IT)"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                {errors.department && (
                  <span className={styles.errorText}>{errors.department}</span>
                )}
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
                    placeholder={mode === 'add' ? 'Enter password (min 6 characters)' : 'Enter new password (optional)'}
                    disabled={isSubmitting}
                    minLength={6}
                    maxLength={100}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && passwordStrength && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthProgress}
                        style={{
                          width: `${Math.min((passwordStrength.score / 4) * 100, 100)}%`,
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
                      {passwordStrength.feedback && passwordStrength.feedback.length > 0 && (
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
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={classNames(styles.modalButton, styles.saveButton)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    {mode === 'add' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  mode === 'add' ? 'Create User' : 'Update User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
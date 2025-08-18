import React, { useState, useEffect } from 'react';
import { FiX, FiKey, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ChangePasswordModal.module.css';
import { validatePasswordStrength } from '../constants/profileData';

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
      setPasswordStrength(null);
    }
  }, [isOpen]);

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

    // Update password strength for new password
    if (field === 'newPassword') {
      if (value) {
        setPasswordStrength(validatePasswordStrength(value));
      } else {
        setPasswordStrength(null);
      }
    }

    // Clear confirm password error when passwords match
    if (field === 'confirmPassword' || field === 'newPassword') {
      if (errors.confirmPassword && 
          ((field === 'confirmPassword' && value === formData.newPassword) ||
           (field === 'newPassword' && value === formData.confirmPassword))) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderPasswordStrength = () => {
    if (!passwordStrength) return null;

    const { checks, strengthLevel, strengthColor, score } = passwordStrength;

    return (
      <div className={styles.passwordStrength}>
        <div className={styles.strengthHeader}>
          <span className={styles.strengthLabel}>Password Strength</span>
          <span 
            className={styles.strengthLevel}
            style={{ color: strengthColor }}
          >
            {strengthLevel.toUpperCase()}
          </span>
        </div>
        
        <div className={styles.strengthBar}>
          <div 
            className={styles.strengthFill}
            style={{ 
              width: `${score}%`,
              backgroundColor: strengthColor
            }}
          />
        </div>

        <div className={styles.strengthChecks}>
          <div className={classNames(styles.strengthCheck, {
            [styles.valid]: checks.length
          })}>
            {checks.length ? <FiCheck /> : <FiAlertCircle />}
            <span>At least 8 characters</span>
          </div>
          <div className={classNames(styles.strengthCheck, {
            [styles.valid]: checks.uppercase
          })}>
            {checks.uppercase ? <FiCheck /> : <FiAlertCircle />}
            <span>One uppercase letter</span>
          </div>
          <div className={classNames(styles.strengthCheck, {
            [styles.valid]: checks.lowercase
          })}>
            {checks.lowercase ? <FiCheck /> : <FiAlertCircle />}
            <span>One lowercase letter</span>
          </div>
          <div className={classNames(styles.strengthCheck, {
            [styles.valid]: checks.number
          })}>
            {checks.number ? <FiCheck /> : <FiAlertCircle />}
            <span>One number</span>
          </div>
          <div className={classNames(styles.strengthCheck, {
            [styles.valid]: checks.special
          })}>
            {checks.special ? <FiCheck /> : <FiAlertCircle />}
            <span>One special character</span>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiKey className={styles.modalIcon} />
            Change Password
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              {/* Current Password */}
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  <FiKey className={styles.labelIcon} />
                  Current Password *
                </label>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    className={classNames(styles.formInput, {
                      [styles.error]: errors.currentPassword
                    })}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <span className={styles.errorText}>{errors.currentPassword}</span>
                )}
              </div>

              {/* New Password */}
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  <FiKey className={styles.labelIcon} />
                  New Password *
                </label>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    className={classNames(styles.formInput, {
                      [styles.error]: errors.newPassword
                    })}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className={styles.errorText}>{errors.newPassword}</span>
                )}
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && renderPasswordStrength()}

              {/* Confirm Password */}
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  <FiKey className={styles.labelIcon} />
                  Confirm New Password *
                </label>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className={classNames(styles.formInput, {
                      [styles.error]: errors.confirmPassword
                    })}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div className={styles.securityTips}>
              <h4 className={styles.tipsTitle}>Password Security Tips:</h4>
              <ul className={styles.tipsList}>
                <li>Use a combination of uppercase and lowercase letters</li>
                <li>Include numbers and special characters</li>
                <li>Avoid using personal information</li>
                <li>Don't reuse passwords from other accounts</li>
                <li>Consider using a password manager</li>
              </ul>
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
            disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
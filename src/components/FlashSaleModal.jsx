import React, { useState, useEffect } from 'react';
import { FiX, FiZap, FiPercent, FiCalendar, FiClock, FiPackage } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FlashSaleModal.module.css';
import { getAllProducts, updateFlashSale } from '../api/api';

const FlashSaleModal = ({ isOpen, onClose, onSave, sale, mode }) => {
  const [formData, setFormData] = useState({
    saleName: '',
    productId: null,
    discountPercent: 10,
    startDate: '',
    endDate: '',
    saleDay: null,
    startTime: '',
    endTime: ''
  });

  const [errors, setErrors] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Day options for the dropdown (matching backend enum: 0=Sunday, 1=Monday, etc.)
  const dayOptions = [
    { value: null, label: 'No specific day (Date range only)' },
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isOpen) {
      setLoadingProducts(true);
      getAllProducts()
        .then(res => {
          if (res.succeeded && res.data) {
            const products = res.data.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category }));
            setAvailableProducts(products);
          }
        })
        .catch(err => {
          console.error("Failed to fetch products:", err);
        })
        .finally(() => setLoadingProducts(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (sale && mode === 'edit') {
        setFormData({
          saleName: sale.saleName || '',
          productId: sale.productId || null,
          discountPercent: sale.discountPercent || 10,
          startDate: formatDateForInput(sale.startDate),
          endDate: formatDateForInput(sale.endDate),
          saleDay: sale.saleDay !== undefined ? sale.saleDay : null,
          startTime: sale.startTime || '',
          endTime: sale.endTime || ''
        });
      } else {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        setFormData({
          saleName: '',
          productId: null,
          discountPercent: 10,
          startDate: formatDateForInput(tomorrow.toISOString()),
          endDate: formatDateForInput(nextWeek.toISOString()),
          saleDay: null,
          startTime: '08:00',
          endTime: '15:00'
        });
      }
      setErrors({});
    }
  }, [sale, mode, isOpen]);

  const handleInputChange = (field, value) => {
    if (field === 'saleDay') {
      if (value === null) {
        // Switching to date range mode
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        setFormData(prev => ({
          ...prev,
          saleDay: null,
          startTime: '',
          endTime: '',
          startDate: formatDateForInput(tomorrow.toISOString()),
          endDate: formatDateForInput(nextWeek.toISOString())
        }));
      } else {
        // Switching to recurring day mode
        setFormData(prev => ({
          ...prev,
          saleDay: Number(value),
          startDate: '',  // Clear date fields
          endDate: '',    // Clear date fields
          startTime: prev.startTime || '08:00',
          endTime: prev.endTime || '15:00'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear specific field error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.saleName.trim()) {
      newErrors.saleName = 'Sale name is required';
    }

    if (!formData.productId) {
      newErrors.productId = 'A product must be selected';
    }

    if (!formData.discountPercent || formData.discountPercent < 1 || formData.discountPercent > 90) {
      newErrors.discountPercent = 'Discount percentage must be between 1% and 90%';
    }

    if (formData.saleDay !== null) {
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required when sale day is selected';
      }
      if (!formData.endTime) {
        newErrors.endTime = 'End time is required when sale day is selected';
      }
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    } else {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date();

        if (start >= end) {
          newErrors.endDate = 'End date must be after start date';
        }
        if (end <= now) {
          newErrors.endDate = 'End date must be in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fixed handleSubmit function for FlashSaleModal.jsx

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSaving(true);

      try {
        const toTimeSpanFormat = (time) => time ? `${time}:00` : null;

        let saleData;

        if (formData.saleDay !== null) {
          // For recurring sales (specific day selected)
          saleData = {
            saleName: formData.saleName,
            productId: Number(formData.productId),
            discountPercent: Number(formData.discountPercent),
            startDate: null, // Clear date fields for recurring sales
            endDate: null,   // Clear date fields for recurring sales
            saleDay: Number(formData.saleDay),
            startTime: toTimeSpanFormat(formData.startTime),
            endTime: toTimeSpanFormat(formData.endTime)
          };
        } else {
          saleData = {
            saleName: formData.saleName,
            productId: Number(formData.productId),
            discountPercent: Number(formData.discountPercent),
            startDate: formData.startDate,
            endDate: formData.endDate,
            saleDay: null,
            startTime: null,
            endTime: null
          };
        }

        if (mode === 'edit' && sale?.id) {
          saleData.id = sale.id;
        }

        console.log('Submitting sale data:', saleData);

        await onSave(saleData);
        onClose();
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  <button
    type="submit"
    className={classNames(styles.modalButton, styles.saveButton)}
    disabled={saving}
  >
    {saving
      ? (mode === 'add' ? 'Creating...' : 'Updating...')
      : (mode === 'add' ? 'Create Flash Sale' : 'Update Flash Sale')
    }
  </button>

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDiscountColor = (percentage) => {
    if (percentage >= 50) return '#ff4d4f';
    if (percentage >= 30) return '#fa8c16';
    if (percentage >= 20) return '#faad14';
    return '#52c41a';
  };

  if (!isOpen) return null;

  const selectedProduct = availableProducts.find(p => p.id === formData.productId);
  const isSpecificDay = formData.saleDay !== null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiZap className={styles.modalIcon} />
            {mode === 'add' ? 'Add Flash Sale' : 'Edit Flash Sale'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Sale Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Sale Name *
                </label>
                <input
                  type="text"
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.saleName
                  })}
                  value={formData.saleName}
                  onChange={(e) => handleInputChange('saleName', e.target.value)}
                  placeholder="Enter flash sale name"
                />
                {errors.saleName && (
                  <span className={styles.errorText}>{errors.saleName}</span>
                )}
              </div>

              {/* Product Dropdown */}
              <div className={classNames(styles.formGroup, styles.productSelectGroup)}>
                <label className={styles.formLabel}>
                  <FiPackage className={styles.labelIcon} />
                  Product Included *
                </label>
                <select
                  className={classNames(styles.formInput, {
                    [styles.error]: errors.productId,
                  })}
                  value={formData.productId || ''}
                  onChange={(e) => handleInputChange('productId', e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select a product</option>
                  {loadingProducts ? (
                    <option disabled>Loading products...</option>
                  ) : (
                    availableProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {`${product.name} (${product.category?.name || 'Uncategorized'}) - ₹${product.price}`}
                      </option>
                    ))
                  )}
                </select>
                {errors.productId && (
                  <span className={styles.errorText}>{errors.productId}</span>
                )}
              </div>

              {/* Discount Percentage */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiPercent className={styles.labelIcon} />
                  Discount Percentage *
                </label>
                <div className={styles.discountInputContainer}>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    className={classNames(styles.formInput, styles.discountInput, {
                      [styles.error]: errors.discountPercent
                    })}
                    value={formData.discountPercent}
                    onChange={(e) => handleInputChange('discountPercent', Number(e.target.value))}
                  />
                  <div
                    className={styles.discountPreview}
                    style={{ backgroundColor: getDiscountColor(formData.discountPercent) }}
                  >
                    {formData.discountPercent}% OFF
                  </div>
                </div>
                {errors.discountPercent && (
                  <span className={styles.errorText}>{errors.discountPercent}</span>
                )}
              </div>

              {/* Sale Day Selector */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiCalendar className={styles.labelIcon} />
                  Sale Schedule Type
                </label>
                <select
                  className={styles.formInput}
                  value={formData.saleDay !== null ? formData.saleDay : ''}
                  onChange={(e) => handleInputChange('saleDay', e.target.value === '' ? null : Number(e.target.value))}
                >
                  {dayOptions.map(option => (
                    // <option key={option.value || 'null'} value={option.value || ''}>
                    <option key={option.value === null ? 'no-day' : option.value} value={option.value ?? ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Date/Time Fields */}
              {isSpecificDay ? (
                // Show time fields for specific day
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FiClock className={styles.labelIcon} />
                      Start Time *
                    </label>
                    <input
                      type="time"
                      className={classNames(styles.formInput, {
                        [styles.error]: errors.startTime
                      })}
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                    {errors.startTime && (
                      <span className={styles.errorText}>{errors.startTime}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FiClock className={styles.labelIcon} />
                      End Time *
                    </label>
                    <input
                      type="time"
                      className={classNames(styles.formInput, {
                        [styles.error]: errors.endTime
                      })}
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                    />
                    {errors.endTime && (
                      <span className={styles.errorText}>{errors.endTime}</span>
                    )}
                  </div>
                </>
              ) : (
                // Show date range fields
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FiCalendar className={styles.labelIcon} />
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      className={classNames(styles.formInput, styles.dateTimeInput, {
                        [styles.error]: errors.startDate
                      })}
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                    {errors.startDate && (
                      <span className={styles.errorText}>{errors.startDate}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FiClock className={styles.labelIcon} />
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      className={classNames(styles.formInput, styles.dateTimeInput, {
                        [styles.error]: errors.endDate
                      })}
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                    {errors.endDate && (
                      <span className={styles.errorText}>{errors.endDate}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sale Summary */}
            {selectedProduct && (
              <div className={styles.saleSummary}>
                <h3 className={styles.summaryTitle}>Sale Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Product:</span>
                    <span className={styles.summaryValue}>{selectedProduct.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Discount:</span>
                    <span className={styles.summaryValue}>{formData.discountPercent}% OFF</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Schedule:</span>
                    <span className={styles.summaryValue}>
                      {isSpecificDay
                        ? `Every ${dayOptions.find(d => d.value === formData.saleDay)?.label} ${formData.startTime}-${formData.endTime}`
                        : (formData.startDate && formData.endDate
                          ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
                          : 'Select dates'
                        )
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                {mode === 'add' ? 'Create Flash Sale' : 'Update Flash Sale'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleModal;
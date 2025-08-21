import React, { useState, useEffect } from 'react';
import { FiX, FiZap, FiPercent, FiCalendar, FiClock, FiPackage } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FlashSaleModal.module.css';
import { getAllProducts } from '../api/api';
import { formatDateForInput } from '../constants/flashSaleData';

const FlashSaleModal = ({ isOpen, onClose, onSave, sale, mode }) => {
  const [formData, setFormData] = useState({
    saleName: '',
    productId: null,
    discountPercentage: 10,
    startDate: '',
    endDate: ''
  });

  const [saleDay, setSaleDay] = useState(null);
  const [errors, setErrors] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

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
                saleName: sale.saleName,
                productId: sale.products[0],
                discountPercentage: sale.discountPercentage,
                startDate: formatDateForInput(sale.startDate),
                endDate: formatDateForInput(sale.endDate)
            });
        } else {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            setFormData({
                saleName: '',
                productId: null,
                discountPercentage: 10,
                startDate: formatDateForInput(tomorrow.toISOString()),
                endDate: formatDateForInput(nextWeek.toISOString())
            });
        }
        setErrors({});
    }
  }, [sale, mode, isOpen]);

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

  const validateSaleDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start >= end) {
      return { valid: false, error: 'End date must be after start date' };
    }

    if (end <= now) {
      return { valid: false, error: 'End date must be in the future' };
    }

    return { valid: true, error: null };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.saleName.trim()) {
      newErrors.saleName = 'Sale name is required';
    }

    if (!formData.productId) {
      newErrors.productId = 'A product must be selected';
    }

    if (!formData.discountPercentage || formData.discountPercentage < 1 || formData.discountPercentage > 90) {
      newErrors.discountPercentage = 'Discount percentage must be between 1% and 90%';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const dateValidation = validateSaleDates(formData.startDate, formData.endDate);
      if (!dateValidation.valid) {
        newErrors.endDate = dateValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        const saleData = {
            ...formData,
            products: [formData.productId],
            id: sale ? sale.id : null,
        };
        onSave(saleData);
        onClose();
    }
  };

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
                      [styles.error]: errors.discountPercentage
                    })}
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', Number(e.target.value))}
                  />
                  <div
                    className={styles.discountPreview}
                    style={{ backgroundColor: getDiscountColor(formData.discountPercentage) }}
                  >
                    {formData.discountPercentage}% OFF
                  </div>
                </div>
                {errors.discountPercentage && (
                  <span className={styles.errorText}>{errors.discountPercentage}</span>
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

              {/* Start Date/Time */}
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

              {/* End Date/Time */}
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

              {/* Sale Day */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FiCalendar className={styles.labelIcon} />
                  Sale Day (Optional)
                </label>
                <select
                  className={classNames(styles.formInput, styles.dateTimeInput)}
                  value={saleDay || ''}
                  onChange={(e) => setSaleDay(e.target.value || null)}
                >
                  <option value="">Every Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
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
                    <span className={styles.summaryValue}>{formData.discountPercentage}% OFF</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Duration:</span>
                    <span className={styles.summaryValue}>
                      {formData.startDate && formData.endDate ?
                        `${Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days`
                        : 'Select dates'
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
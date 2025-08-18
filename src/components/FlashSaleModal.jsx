import React, { useState, useEffect } from 'react';
import { FiX, FiZap, FiPercent, FiCalendar, FiClock, FiPackage } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FlashSaleModal.module.css';
import { 
  statusOptions, 
  availableProducts, 
  validateSaleDates, 
  formatDateForInput,
  getProductsByIds 
} from '../constants/flashSaleData';

const FlashSaleModal = ({ isOpen, onClose, onSave, sale, mode }) => {
  const [formData, setFormData] = useState({
    saleName: '',
    products: [],
    discountPercentage: 10,
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  useEffect(() => {
    if (sale && mode === 'edit') {
      setFormData({
        ...sale,
        startDate: formatDateForInput(sale.startDate),
        endDate: formatDateForInput(sale.endDate)
      });
      setSelectedProducts(getProductsByIds(sale.products));
    } else {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData({
        saleName: '',
        products: [],
        discountPercentage: 10,
        startDate: formatDateForInput(tomorrow.toISOString()),
        endDate: formatDateForInput(nextWeek.toISOString()),
        status: 'active'
      }); 
      setSelectedProducts([]);
    }
    setErrors({});
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

  const handleProductToggle = (product) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    
    if (isSelected) {
      const newSelected = selectedProducts.filter(p => p.id !== product.id);
      setSelectedProducts(newSelected);
      handleInputChange('products', newSelected.map(p => p.id));
    } else {
      const newSelected = [...selectedProducts, product];
      setSelectedProducts(newSelected);
      handleInputChange('products', newSelected.map(p => p.id));
    }
  };

  const handleRemoveProduct = (productId) => {
    const newSelected = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(newSelected);
    handleInputChange('products', newSelected.map(p => p.id));
  };

  const handleStatusToggle = () => {
    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
    handleInputChange('status', newStatus);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.saleName.trim()) {
      newErrors.saleName = 'Sale name is required';
    }

    if (formData.products.length === 0) {
      newErrors.products = 'At least one product must be selected';
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
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
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

              {/* Product Multi-Select */}
              <div className={classNames(styles.formGroup, styles.productSelectGroup)}>
                <label className={styles.formLabel}>
                  <FiPackage className={styles.labelIcon} />
                  Products Included *
                </label>
                
                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className={styles.selectedProducts}>
                    {selectedProducts.map(product => (
                      <div key={product.id} className={styles.selectedProduct}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productCategory}>({product.category})</span>
                        <button
                          type="button"
                          className={styles.removeProduct}
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Dropdown */}
                <div className={styles.productDropdownContainer}>
                  <button
                    type="button"
                    className={classNames(styles.productDropdownButton, {
                      [styles.error]: errors.products,
                      [styles.open]: isProductDropdownOpen
                    })}
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  >
                    <FiPackage />
                    {selectedProducts.length > 0 
                      ? `${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''} selected`
                      : 'Select products'
                    }
                  </button>

                  {isProductDropdownOpen && (
                    <div className={styles.productDropdown}>
                      <div className={styles.productDropdownHeader}>
                        <span>Available Products</span>
                        <button
                          type="button"
                          onClick={() => setIsProductDropdownOpen(false)}
                          className={styles.dropdownClose}
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className={styles.productList}>
                        {availableProducts.map(product => {
                          const isSelected = selectedProducts.find(p => p.id === product.id);
                          return (
                            <div
                              key={product.id}
                              className={classNames(styles.productOption, {
                                [styles.selected]: isSelected
                              })}
                              onClick={() => handleProductToggle(product)}
                            >
                              <div className={styles.productCheckbox}>
                                <input
                                  type="checkbox"
                                  checked={!!isSelected}
                                  onChange={() => {}} // Handled by onClick
                                />
                              </div>
                              <div className={styles.productInfo}>
                                <div className={styles.productOptionName}>{product.name}</div>
                                <div className={styles.productDetails}>
                                  <span className={styles.productOptionCategory}>{product.category}</span>
                                  <span className={styles.productPrice}>₹{product.price}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {errors.products && (
                  <span className={styles.errorText}>{errors.products}</span>
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

            {/* Sale Summary */}
            {selectedProducts.length > 0 && (
              <div className={styles.saleSummary}>
                <h3 className={styles.summaryTitle}>Sale Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Products:</span>
                    <span className={styles.summaryValue}>{selectedProducts.length}</span>
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
import React, { useState, useEffect } from 'react';
import { FiX, FiPackage, FiUser, FiMapPin, FiCreditCard } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './OrderModal.module.css';
import { 
  orderStatusOptions, 
  paymentStatusOptions,
  getOrderStatusLabel, 
  getPaymentStatusLabel, 
  formatDate, 
  formatCurrency 
} from '../constants/orderData';

const OrderModal = ({ isOpen, onClose, onSave, order, mode }) => {
  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderDate: '',
    orderStatus: 'pending',
    paymentStatus: 'pending',
    totalAmount: 0,
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    items: [],
    shippingCost: 0,
    taxAmount: 0,
    discountAmount: 0,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      setFormData({
        id: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        orderDate: '',
        orderStatus: 'pending',
        paymentStatus: 'pending',
        totalAmount: 0,
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        items: [],
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        notes: ''
      });
    }
    setErrors({});
  }, [order, isOpen]);

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

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'edit') {
      if (!formData.orderStatus) {
        newErrors.orderStatus = 'Order status is required';
      }
      if (!formData.paymentStatus) {
        newErrors.paymentStatus = 'Payment status is required';
      }
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

  const getStatusBadgeClass = (status, type) => {
    if (type === 'order') {
      const statusClasses = {
        pending: styles.statusPending,
        confirmed: styles.statusConfirmed,
        processing: styles.statusProcessing,
        shipped: styles.statusShipped,
        delivered: styles.statusDelivered,
        cancelled: styles.statusCancelled,
        returned: styles.statusReturned
      };
      return statusClasses[status] || styles.statusDefault;
    } else {
      const statusClasses = {
        pending: styles.paymentPending,
        paid: styles.paymentPaid,
        failed: styles.paymentFailed,
        refunded: styles.paymentRefunded,
        partial: styles.paymentPartial
      };
      return statusClasses[status] || styles.paymentDefault;
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiPackage className={styles.modalIcon} />
            {mode === 'view' ? 'Order Details' : 'Update Order Status'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {/* Order Info Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FiPackage className={styles.sectionIcon} />
                Order Information
              </h3>
              <div className={styles.orderInfoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Order ID</label>
                  <span className={styles.orderId}>{formData.id}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Order Date</label>
                  <span className={styles.infoValue}>{formatDate(formData.orderDate)}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Order Status</label>
                  {mode === 'view' ? (
                    <span className={classNames(styles.statusBadge, getStatusBadgeClass(formData.orderStatus, 'order'))}>
                      {getOrderStatusLabel(formData.orderStatus)}
                    </span>
                  ) : (
                    <div className={styles.inputGroup}>
                      <select
                        className={classNames(styles.formSelect, {
                          [styles.error]: errors.orderStatus
                        })}
                        value={formData.orderStatus}
                        onChange={(e) => handleInputChange('orderStatus', e.target.value)}
                      >
                        {orderStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.orderStatus && (
                        <span className={styles.errorText}>{errors.orderStatus}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Payment Status</label>
                  {mode === 'view' ? (
                    <span className={classNames(styles.statusBadge, getStatusBadgeClass(formData.paymentStatus, 'payment'))}>
                      {getPaymentStatusLabel(formData.paymentStatus)}
                    </span>
                  ) : (
                    <div className={styles.inputGroup}>
                      <select
                        className={classNames(styles.formSelect, {
                          [styles.error]: errors.paymentStatus
                        })}
                        value={formData.paymentStatus}
                        onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                      >
                        {paymentStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.paymentStatus && (
                        <span className={styles.errorText}>{errors.paymentStatus}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FiUser className={styles.sectionIcon} />
                Customer Information
              </h3>
              <div className={styles.customerInfoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Name</label>
                  <span className={styles.infoValue}>{formData.customerName}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email</label>
                  <span className={styles.infoValue}>{formData.customerEmail}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Phone</label>
                  <span className={styles.infoValue}>{formData.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FiMapPin className={styles.sectionIcon} />
                Shipping Address
              </h3>
              <div className={styles.addressInfo}>
                <div className={styles.addressLine}>{formData.shippingAddress.street}</div>
                <div className={styles.addressLine}>
                  {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}
                </div>
                <div className={styles.addressLine}>{formData.shippingAddress.country}</div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FiPackage className={styles.sectionIcon} />
                Order Items
              </h3>
              <div className={styles.itemsTable}>
                <div className={styles.itemsHeader}>
                  <div className={styles.itemHeaderCol}>Product</div>
                  <div className={styles.itemHeaderCol}>Quantity</div>
                  <div className={styles.itemHeaderCol}>Unit Price</div>
                  <div className={styles.itemHeaderCol}>Total</div>
                </div>
                {formData.items.map((item, index) => (
                  <div key={item.id || index} className={styles.itemRow}>
                    <div className={styles.itemCol}>
                      <div className={styles.productName}>{item.productName}</div>
                      <div className={styles.productCategory}>{item.category}</div>
                    </div>
                    <div className={styles.itemCol}>{item.quantity}</div>
                    <div className={styles.itemCol}>{formatCurrency(item.unitPrice)}</div>
                    <div className={styles.itemCol}>{formatCurrency(item.totalPrice)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FiCreditCard className={styles.sectionIcon} />
                Order Summary
              </h3>
              <div className={styles.summaryTable}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal:</span>
                  <span className={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping:</span>
                  <span className={styles.summaryValue}>{formatCurrency(formData.shippingCost)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax:</span>
                  <span className={styles.summaryValue}>{formatCurrency(formData.taxAmount)}</span>
                </div>
                {formData.discountAmount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Discount:</span>
                    <span className={classNames(styles.summaryValue, styles.discount)}>
                      -{formatCurrency(formData.discountAmount)}
                    </span>
                  </div>
                )}
                <div className={classNames(styles.summaryRow, styles.totalRow)}>
                  <span className={styles.summaryLabel}>Total:</span>
                  <span className={styles.summaryValue}>{formatCurrency(formData.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {formData.notes && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Notes</h3>
                <div className={styles.notesContent}>
                  {formData.notes}
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
                {mode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {mode === 'edit' && (
                <button
                  type="submit"
                  className={classNames(styles.modalButton, styles.saveButton)}
                >
                  Update Order
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
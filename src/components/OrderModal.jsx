// import React, { useState, useEffect } from 'react';
// import { FiX, FiPackage, FiUser, FiMapPin, FiCreditCard } from 'react-icons/fi';
// import classNames from 'classnames';
// import styles from './OrderModal.module.css';
// import {
//   orderStatusOptions,
//   paymentStatusOptions,
//   getOrderStatusLabel,
//   getPaymentStatusLabel,
//   formatDate,
//   formatCurrency
// } from '../constants/orderData';

// const OrderModal = ({ isOpen, onClose, onSave, order, mode }) => {
//   const [formData, setFormData] = useState({
//     id: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     orderDate: '',
//     orderStatus: 'pending',
//     paymentStatus: 'pending',
//     totalAmount: 0,
//     shippingAddress: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: ''
//     },
//     items: [],
//     shippingCost: 0,
//     taxAmount: 0,
//     discountAmount: 0,
//     notes: ''
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (order) {
//       setFormData(order);
//     } else {
//       setFormData({
//         id: '',
//         customerName: '',
//         customerEmail: '',
//         customerPhone: '',
//         orderDate: '',
//         orderStatus: 'pending',
//         paymentStatus: 'pending',
//         totalAmount: 0,
//         shippingAddress: {
//           street: '',
//           city: '',
//           state: '',
//           zipCode: '',
//           country: ''
//         },
//         items: [],
//         shippingCost: 0,
//         taxAmount: 0,
//         discountAmount: 0,
//         notes: ''
//       });
//     }
//     setErrors({});
//   }, [order, isOpen]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (mode === 'edit') {
//       if (!formData.orderStatus) {
//         newErrors.orderStatus = 'Order status is required';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       // Only pass the necessary data for status update
//       onSave({
//         id: formData.id,
//         orderStatus: formData.orderStatus
//       });
//       onClose();
//     }
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   const getStatusBadgeClass = (status, type) => {
//     if (type === 'order') {
//       const statusClasses = {
//         pending: styles.statusPending,
//         confirmed: styles.statusConfirmed,
//         processing: styles.statusProcessing,
//         shipped: styles.statusShipped,
//         delivered: styles.statusDelivered,
//         cancelled: styles.statusCancelled,
//         returned: styles.statusReturned
//       };
//       return statusClasses[status] || styles.statusDefault;
//     } else {
//       const statusClasses = {
//         pending: styles.paymentPending,
//         paid: styles.paymentPaid,
//         failed: styles.paymentFailed,
//         refunded: styles.paymentRefunded,
//         partial: styles.paymentPartial
//       };
//       return statusClasses[status] || styles.paymentDefault;
//     }
//   };

//   const calculateSubtotal = () => {
//     return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
//   };

//   const formatShippingAddress = () => {
//     const addr = formData.shippingAddress;
//     if (!addr || (!addr.street && !addr.city)) {
//       return 'N/A';
//     }

//     const parts = [];
//     if (addr.street) parts.push(addr.street);
//     if (addr.city || addr.state || addr.zipCode) {
//       const cityLine = [addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ');
//       if (cityLine) parts.push(cityLine);
//     }
//     if (addr.country) parts.push(addr.country);

//     return parts.length > 0 ? parts.join('\n') : 'N/A';
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay} onClick={handleOverlayClick}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <h2 className={styles.modalTitle}>
//             <FiPackage className={styles.modalIcon} />
//             {mode === 'view' ? 'Order Details' : 'Update Order Status'}
//           </h2>
//           <button className={styles.closeButton} onClick={onClose}>
//             <FiX />
//           </button>
//         </div>

//         <div className={styles.modalBody}>
//           <form onSubmit={handleSubmit}>
//             {/* Order Info Section */}
//             <div className={styles.section}>
//               <h3 className={styles.sectionTitle}>
//                 <FiPackage className={styles.sectionIcon} />
//                 Order Information
//               </h3>
//               <div className={styles.orderInfoGrid}>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Order ID</label>
//                   <span className={styles.orderId}>{formData.id}</span>
//                 </div>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Order Date</label>
//                   <span className={styles.infoValue}>{formatDate(formData.orderDate)}</span>
//                 </div>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Order Status</label>
//                   {mode === 'view' ? (
//                     <span className={classNames(styles.statusBadge, getStatusBadgeClass(formData.orderStatus, 'order'))}>
//                       {getOrderStatusLabel(formData.orderStatus)}
//                     </span>
//                   ) : (
//                     <div className={styles.inputGroup}>
//                       <select
//                         className={classNames(styles.formSelect, {
//                           [styles.error]: errors.orderStatus
//                         })}
//                         value={formData.orderStatus}
//                         onChange={(e) => handleInputChange('orderStatus', e.target.value)}
//                       >
//                         {orderStatusOptions.map(option => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.orderStatus && (
//                         <span className={styles.errorText}>{errors.orderStatus}</span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Total Amount</label>
//                   <span className={styles.infoValue}>{formatCurrency(formData.totalAmount)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Customer Info Section */}
//             <div className={styles.section}>
//               <h3 className={styles.sectionTitle}>
//                 <FiUser className={styles.sectionIcon} />
//                 Customer Information
//               </h3>
//               <div className={styles.customerInfoGrid}>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Name</label>
//                   <span className={styles.infoValue}>{formData.customerName || 'N/A'}</span>
//                 </div>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Email</label>
//                   <span className={styles.infoValue}>{formData.customerEmail || 'N/A'}</span>
//                 </div>
//                 <div className={styles.infoItem}>
//                   <label className={styles.infoLabel}>Phone</label>
//                   <span className={styles.infoValue}>{formData.customerPhone || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address Section */}
//             <div className={styles.section}>
//               <h3 className={styles.sectionTitle}>
//                 <FiMapPin className={styles.sectionIcon} />
//                 Shipping Address
//               </h3>
//               <div className={styles.addressInfo}>
//                 <pre className={styles.addressText}>
//                   {formatShippingAddress()}
//                 </pre>
//               </div>
//             </div>

//             {/* Order Items Section */}
//             {formData.items && formData.items.length > 0 && (
//               <div className={styles.section}>
//                 <h3 className={styles.sectionTitle}>
//                   <FiPackage className={styles.sectionIcon} />
//                   Order Items ({formData.items.length})
//                 </h3>
//                 <div className={styles.itemsTable}>
//                   <div className={styles.itemsHeader}>
//                     <div className={styles.itemHeaderCol}>Product</div>
//                     <div className={styles.itemHeaderCol}>Quantity</div>
//                     <div className={styles.itemHeaderCol}>Unit Price</div>
//                     <div className={styles.itemHeaderCol}>Total</div>
//                   </div>
//                   {formData.items.map((item, index) => (
//                     <div key={item.id || index} className={styles.itemRow}>
//                       <div className={styles.itemCol}>
//                         <div className={styles.productName}>{item.productName || 'Unknown Product'}</div>
//                         <div className={styles.productCategory}>{item.category || 'N/A'}</div>
//                       </div>
//                       <div className={styles.itemCol}>{item.quantity || 0}</div>
//                       <div className={styles.itemCol}>{formatCurrency(item.unitPrice || 0)}</div>
//                       <div className={styles.itemCol}>{formatCurrency(item.totalPrice || 0)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Order Summary Section */}
//             <div className={styles.section}>
//               <h3 className={styles.sectionTitle}>
//                 <FiCreditCard className={styles.sectionIcon} />
//                 Order Summary
//               </h3>
//               <div className={styles.summaryTable}>
//                 <div className={styles.summaryRow}>
//                   <span className={styles.summaryLabel}>Subtotal:</span>
//                   <span className={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</span>
//                 </div>
//                 {formData.shippingCost > 0 && (
//                   <div className={styles.summaryRow}>
//                     <span className={styles.summaryLabel}>Shipping:</span>
//                     <span className={styles.summaryValue}>{formatCurrency(formData.shippingCost)}</span>
//                   </div>
//                 )}
//                 {formData.taxAmount > 0 && (
//                   <div className={styles.summaryRow}>
//                     <span className={styles.summaryLabel}>Tax:</span>
//                     <span className={styles.summaryValue}>{formatCurrency(formData.taxAmount)}</span>
//                   </div>
//                 )}
//                 {formData.discountAmount > 0 && (
//                   <div className={styles.summaryRow}>
//                     <span className={styles.summaryLabel}>Discount:</span>
//                     <span className={classNames(styles.summaryValue, styles.discount)}>
//                       -{formatCurrency(formData.discountAmount)}
//                     </span>
//                   </div>
//                 )}
//                 <div className={classNames(styles.summaryRow, styles.totalRow)}>
//                   <span className={styles.summaryLabel}>Total:</span>
//                   <span className={styles.summaryValue}>{formatCurrency(formData.totalAmount)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Notes Section */}
//             {formData.notes && (
//               <div className={styles.section}>
//                 <h3 className={styles.sectionTitle}>Notes</h3>
//                 <div className={styles.notesContent}>
//                   {formData.notes}
//                 </div>
//               </div>
//             )}

//             {/* Modal Footer */}
//             <div className={styles.modalFooter}>
//               <button
//                 type="button"
//                 className={classNames(styles.modalButton, styles.cancelButton)}
//                 onClick={onClose}
//               >
//                 {mode === 'view' ? 'Close' : 'Cancel'}
//               </button>
//               {mode === 'edit' && (
//                 <button
//                   type="submit"
//                   className={classNames(styles.modalButton, styles.saveButton)}
//                 >
//                   Update Status
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderModal;

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
    orderStatus: 'Order_Placed',
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
        orderStatus: 'Order_Placed',
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Only pass the necessary data for status update
      onSave({
        id: formData.id,
        orderStatus: formData.orderStatus
      });
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
        'Order_Placed': styles.statusPending,
        'Processing': styles.statusProcessing,
        'Shipped': styles.statusShipped,
        'Delivered': styles.statusDelivered,
        'Cancelled': styles.statusCancelled,
        'Return_Requested': styles.statusReturned,
        'Returned': styles.statusReturned
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
    return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const formatShippingAddress = () => {
    // Handle string shipping address from API
    if (typeof formData.shippingAddress === 'string') {
      return formData.shippingAddress || 'N/A';
    }
    
    // Handle object shipping address (fallback)
    const addr = formData.shippingAddress;
    if (!addr || (!addr.street && !addr.city)) {
      return 'N/A';
    }
    
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city || addr.state || addr.zipCode) {
      const cityLine = [addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ');
      if (cityLine) parts.push(cityLine);
    }
    if (addr.country) parts.push(addr.country);
    
    return parts.length > 0 ? parts.join('\n') : 'N/A';
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
                  <label className={styles.infoLabel}>Total Amount</label>
                                  <span className={styles.infoValue}> {(formData.totalAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
                             
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
                  <span className={styles.infoValue}>{formData.customerName || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email</label>
                  <span className={styles.infoValue}>{formData.customerEmail || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Phone</label>
                  <span className={styles.infoValue}>{formData.customerPhone || 'N/A'}</span>
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
                <pre className={styles.addressText}>
                  {formatShippingAddress()}
                </pre>
              </div>
            </div>

            {/* Order Items Section */}
            {formData.items && formData.items.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <FiPackage className={styles.sectionIcon} />
                  Order Items ({formData.items.length})
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
                        <div className={styles.productName}>{item.productName || 'Unknown Product'}</div>
                        <div className={styles.productCategory}>{item.category || 'N/A'}</div>
                      </div>
                      <div className={styles.itemCol}>{item.quantity || 0}</div>
                      <div className={styles.itemCol}>{formatCurrency(item.unitPrice || 0)}</div>
                      <div className={styles.itemCol}>{formatCurrency(item.totalPrice || 0)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                {formData.shippingCost > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping:</span>
                    <span className={styles.summaryValue}>{formatCurrency(formData.shippingCost)}</span>
                  </div>
                )}
                {formData.taxAmount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Tax:</span>
                    <span className={styles.summaryValue}>{formatCurrency(formData.taxAmount)}</span>
                  </div>
                )}
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
                  Update Status
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
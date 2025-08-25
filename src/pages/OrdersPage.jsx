import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiEye, FiEdit2, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './OrdersPage.module.css';
import OrderModal from '../components/OrderModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import {
  orderData,
  orderStatusOptions,
  getOrderStatusLabel,
  formatDate,
  formatCurrency,
  getOrderStatusColor,
} from '../constants/orderData';
import { getAllOrders } from '../api/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [sortField, setSortField] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { toasts, showSuccess, showError, removeToast } = useToast();

  const mapOrderStatus = (status) => {
    switch (status) {
      case 0: return 'Order_Placed';
      case 1: return 'Processing';
      case 2: return 'Shipped';
      case 3: return 'Delivered';
      case 4: return 'Cancelled';
      case 5: return 'Return_Requested';
      case 6: return 'Returned';
      default: return 'Pending';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();

        const mappedOrders = response.data.map(order => ({
          id: order.id.toString(),
          customerName: `${order.user.firstName} ${order.user.lastName}`,
          customerEmail: order.user.email,
          orderDate: order.createdAt,
          orderStatus: mapOrderStatus(order.status),
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress || "N/A",
        }));

        setOrders(mappedOrders);
      } catch (error) {
        showError("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);


  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOrderStatus = !filterOrderStatus || order.orderStatus === filterOrderStatus;
      return matchesSearch && matchesOrderStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'orderDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'totalAmount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, filterOrderStatus, sortField, sortOrder]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'orderStatus') {
      setFilterOrderStatus(value);
    }
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (window.confirm(`Are you sure you want to cancel order "${order?.id}"? This action cannot be undone.`)) {
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, orderStatus: 'cancelled', paymentStatus: 'refunded', totalAmount: 0 }
          : o
      ));
      showSuccess(`Order "${order?.id}" cancelled successfully!`);
    }
  };

  const handleSaveOrder = (orderData) => {
    setOrders(prev => prev.map(o =>
      o.id === orderData.id ? { ...orderData } : o
    ));
    showSuccess(`Order "${orderData.id}" updated successfully!`);
  };

  const getOrderStatusClass = (status) => {
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
  };

  const getPaymentStatusClass = (status) => {
    const statusClasses = {
      pending: styles.paymentPending,
      paid: styles.paymentPaid,
      failed: styles.paymentFailed,
      refunded: styles.paymentRefunded,
      partial: styles.paymentPartial
    };
    return statusClasses[status] || styles.paymentDefault;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={classNames(styles.paginationButton, {
            [styles.active]: i === currentPage
          })}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={styles.ordersPageContainer}>
      {/* Page Header */}
      <div className={styles.ordersPageHeader}>
        <div className={styles.ordersHeaderLeft}>
          <h1 className={styles.ordersPageTitle}>Orders Management</h1>
          <p className={styles.ordersPageSubtitle}>
            Track and manage customer orders, payments, and shipments
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.ordersTopBar}>
        <div className={styles.ordersSearchAndFilters}>
          <div className={styles.ordersSearchBar}>
            <input
              type="text"
              placeholder="Search by Order ID, Customer name, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select
            className={styles.ordersFilterSelect}
            value={filterOrderStatus}
            onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
          >
            <option value="">All Order Status</option>
            {orderStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className={styles.ordersSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="orderDate-desc">Newest First</option>
            <option value="orderDate-asc">Oldest First</option>
            <option value="id-asc">Order ID A-Z</option>
            <option value="id-desc">Order ID Z-A</option>
            <option value="customerName-asc">Customer A-Z</option>
            <option value="customerName-desc">Customer Z-A</option>
            <option value="totalAmount-desc">Amount High to Low</option>
            <option value="totalAmount-asc">Amount Low to High</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className={styles.ordersTableContainer}>
        <table className={styles.ordersTable}>
          <thead className={styles.ordersTableHeader}>
            <tr>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('id')}>
                Order ID
                {sortField === 'id' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('customerName')}>
                Customer Name/Email
                {sortField === 'customerName' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('orderDate')}>
                Order Date
                {sortField === 'orderDate' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Order Status</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('totalAmount')}>
                Total Amount
                {sortField === 'totalAmount' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Shipping Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className={styles.ordersTableRow}>
                <td className={styles.ordersTableCell}>
                  <span className={styles.orderId}>{order.id}</span>
                </td>
                <td className={styles.ordersTableCell}>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>{order.customerName}</div>
                    <div className={styles.customerEmail}>{order.customerEmail}</div>
                  </div>
                </td>
                <td className={styles.ordersTableCell}>
                  <span className={styles.orderDate}>
                    {formatDate(order.orderDate)}
                  </span>
                </td>
                <td className={styles.ordersTableCell}>
                  <span className={classNames(styles.orderStatusBadge, getOrderStatusClass(order.orderStatus))}>
                    {getOrderStatusLabel(order.orderStatus)}
                  </span>
                </td>
                <td className={styles.ordersTableCell}>
                  <span className={styles.totalAmount}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </td>
                <td className={styles.ordersTableCell}>
                  <div className={styles.shippingAddress}>
                    {order.shippingAddress || "N/A"}
                  </div>
                </td>
                <td className={styles.ordersTableCell}>
                  <div className={styles.ordersActions}>
                    <button
                      className={classNames(styles.ordersActionButton, styles.ordersViewButton)}
                      onClick={() => handleViewOrder(order)}
                      title="View order details"
                    >
                      <FiEye />
                    </button>
                    <button
                      className={classNames(styles.ordersActionButton, styles.ordersEditButton)}
                      onClick={() => handleUpdateStatus(order)}
                      title="Update order status"
                    >
                      <FiEdit2 />
                    </button>
                    {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                      <button
                        className={classNames(styles.ordersActionButton, styles.ordersCancelButton)}
                        onClick={() => handleCancelOrder(order.id)}
                        title="Cancel order"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>

          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {renderPaginationButtons()}

            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* No Results */}
        {filteredOrders.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📦</div>
            <div className={styles.noResultsTitle}>No orders found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Try adjusting your search terms or filters' : 'No orders have been placed yet'}
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        order={selectedOrder}
        mode={modalMode}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default OrdersPage;
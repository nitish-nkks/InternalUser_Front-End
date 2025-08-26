import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiClock, FiChevronUp, FiChevronDown, FiZap } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FlashSalePage.module.css';
import FlashSaleModal from '../components/FlashSaleModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import {
  createFlashSale,
  getFlashSales,
  updateFlashSale,
  deleteFlashSale
} from '../api/api';

const FlashSalePage = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSale, setSelectedSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Status options for filtering
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' }
  ];

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getSaleStatus = (startDate, endDate, saleDay, startTime, endTime, isActive) => {
    if (!isActive) return 'inactive';

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.

    if (saleDay !== null) {
      // Recurring daily sale
      if (currentDay === saleDay && startTime && endTime) {
        if (currentTime >= startTime && currentTime <= endTime) {
          return 'active';
        }
      }
      return 'scheduled';
    } else {
      // Date range sale
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) return 'scheduled';
      if (now > end) return 'expired';
      return 'active';
    }
  };

  const getRemainingTime = (endDate, saleDay, endTime) => {
    if (saleDay !== null && endTime) {
      return `Until ${endTime}`;
    }

    if (!endDate) return '';

    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || '';
  };

  // Fetch flash sales from API
  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      const response = await getFlashSales();
      if (response.succeeded && response.data) {
        // Transform API data to match frontend expectations
        const transformedSales = response.data.map(sale => ({
          id: sale.id,
          saleName: sale.saleName,
          productId: sale.productId,
          productName: sale.productName,
          discountPercent: sale.discountPercent,
          startDate: sale.startDate,
          endDate: sale.endDate,
          saleDay: sale.saleDay,
          startTime: sale.startTime,
          endTime: sale.endTime,
          isActive: sale.isActive,
          totalSales: 0,
          revenue: 0,
          createdDate: sale.startDate
        }));
        setFlashSales(transformedSales);
      }
    } catch (error) {
      console.error('Error fetching flash sales:', error);
      showError('Failed to fetch flash sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSales();
  }, []);

  // Filter and sort flash sales
  const filteredSales = useMemo(() => {
    let filtered = flashSales.filter(sale => {
      const matchesSearch = sale.saleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.productName?.toLowerCase().includes(searchTerm.toLowerCase());

      const currentStatus = getSaleStatus(
        sale.startDate,
        sale.endDate,
        sale.saleDay,
        sale.startTime,
        sale.endTime,
        sale.isActive
      );
      const matchesStatus = !filterStatus || currentStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort flash sales
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdDate' || sortField === 'startDate' || sortField === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'discountPercent' || sortField === 'totalSales' || sortField === 'revenue') {
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
  }, [flashSales, searchTerm, filterStatus, sortField, sortOrder]);

  // Paginate flash sales
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setFilterStatus(value);
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

  const handleAddSale = () => {
    setSelectedSale(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteSale = async (saleId) => {
    const sale = flashSales.find(s => s.id === saleId);
    if (window.confirm(`Are you sure you want to delete flash sale "${sale?.saleName}"? This action cannot be undone.`)) {
      try {
        await deleteFlashSale(saleId);
        await fetchFlashSales(); // Refresh the list
        showSuccess(`Flash sale "${sale?.saleName}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting flash sale:', error);
        showError('Failed to delete flash sale');
      }
    }
  };

  const handleSaveSale = async (saleData) => {
    try {
      if (modalMode === 'add') {
        await createFlashSale(saleData);
        showSuccess(`Flash sale "${saleData.saleName}" created successfully!`);
      } else {
        await updateFlashSale(saleData);
        showSuccess(`Flash sale "${saleData.saleName}" updated successfully!`);
      }

      await fetchFlashSales(); // Refresh the list
    } catch (error) {
      console.error('Error saving flash sale:', error);
      showError(`Failed to ${modalMode === 'add' ? 'create' : 'update'} flash sale`);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      active: styles.statusActive,
      inactive: styles.statusInactive,
      scheduled: styles.statusScheduled,
      expired: styles.statusExpired
    };
    return statusClasses[status] || styles.statusDefault;
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'Active',
      inactive: 'Inactive',
      scheduled: 'Scheduled',
      expired: 'Expired'
    };
    return statusLabels[status] || 'Unknown';
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

  if (loading) {
    return (
      <div className={styles.flashSalePageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading flash sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flashSalePageContainer}>
      {/* Page Header */}
      <div className={styles.flashSalePageHeader}>
        <div className={styles.flashSaleHeaderLeft}>
          <h1 className={styles.flashSalePageTitle}>Flash Sale Management</h1>
          <p className={styles.flashSalePageSubtitle}>
            Create and manage limited-time promotional sales
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.flashSaleTopBar}>
        <div className={styles.flashSaleSearchAndFilters}>
          <div className={styles.flashSaleSearchBar}>
            <input
              type="text"
              placeholder="Search by sale name or products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select
            className={styles.flashSaleFilterSelect}
            value={filterStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className={styles.flashSaleSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="createdDate-desc">Newest First</option>
            <option value="createdDate-asc">Oldest First</option>
            <option value="saleName-asc">Name A-Z</option>
            <option value="saleName-desc">Name Z-A</option>
            <option value="startDate-asc">Start Date</option>
            <option value="endDate-asc">End Date</option>
            <option value="discountPercent-desc">Highest Discount</option>
            <option value="totalSales-desc">Most Sales</option>
            <option value="revenue-desc">Highest Revenue</option>
          </select>
        </div>

        <div className={styles.flashSaleTopBarActions}>
          <button
            className={styles.flashSaleAddButton}
            onClick={handleAddSale}
          >
            <FiPlus />
            Add Flash Sale
          </button>
        </div>
      </div>

      {/* Flash Sales Table */}
      <div className={styles.flashSaleTableContainer}>
        <table className={styles.flashSaleTable}>
          <thead className={styles.flashSaleTableHeader}>
            <tr>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('saleName')}>
                Sale Name
                {sortField === 'saleName' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Product Included</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('discountPercent')}>
                Discount %
                {sortField === 'discountPercent' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale) => {
              const currentStatus = getSaleStatus(
                sale.startDate,
                sale.endDate,
                sale.saleDay,
                sale.startTime,
                sale.endTime,
                sale.isActive
              );

              return (
                <tr key={sale.id} className={styles.flashSaleTableRow}>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.saleNameCell}>
                      <div className={styles.saleName}>
                        <FiZap className={styles.saleIcon} />
                        {sale.saleName}
                      </div>
                      {currentStatus === 'active' && (
                        <div className={styles.remainingTime}>
                          <FiClock />
                          {getRemainingTime(sale.endDate, sale.saleDay, sale.endTime)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.productsIncluded}>
                      <div className={styles.productItem}>
                        {sale.productName || '-'}
                      </div>
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.discountBadge}>
                      {sale.discountPercent}% OFF
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.scheduleInfo}>
                      {sale.saleDay !== null ? (
                        <div>
                          <div className={styles.recurringSchedule}>
                            Every {getDayName(sale.saleDay)}
                          </div>
                          <div className={styles.timeRange}>
                            {sale.startTime} - {sale.endTime}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={styles.dateRange}>
                            {formatDate(sale.startDate)}
                          </div>
                          <div className={styles.dateRange}>
                            to {formatDate(sale.endDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <span className={classNames(styles.statusBadge, getStatusClass(currentStatus))}>
                      {getStatusLabel(currentStatus)}
                    </span>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.performanceStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Sales:</span>
                        <span className={styles.statValue}>{sale.totalSales}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Revenue:</span>
                        <span className={styles.revenueValue}>{formatCurrency(sale.revenue)}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.flashSaleActions}>
                      <button
                        className={classNames(styles.flashSaleActionButton, styles.flashSaleEditButton)}
                        onClick={() => handleEditSale(sale)}
                        title="Edit flash sale"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={classNames(styles.flashSaleActionButton, styles.flashSaleDeleteButton)}
                        onClick={() => handleDeleteSale(sale.id)}
                        title="Delete flash sale"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSales.length)} of {filteredSales.length} flash sales
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
        )}

        {/* No Results */}
        {filteredSales.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FiZap size={48} />
            </div>
            <div className={styles.noResultsTitle}>No flash sales found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Get started by creating your first flash sale'}
            </div>
            {!searchTerm && (
              <button
                className={styles.noResultsButton}
                onClick={handleAddSale}
              >
                <FiPlus />
                Add Flash Sale
              </button>
            )}
          </div>
        )}
      </div>

      {/* Flash Sale Modal */}
      <FlashSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
        sale={selectedSale}
        mode={modalMode}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default FlashSalePage;
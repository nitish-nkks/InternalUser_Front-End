import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiClock, FiChevronUp, FiChevronDown, FiZap } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FlashSalePage.module.css';
import FlashSaleModal from '../components/FlashSaleModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { 
  flashSaleData, 
  statusOptions,
  getStatusLabel, 
  formatDate,
  formatCurrency,
  getStatusColor,
  getProductsByIds,
  getSaleStatus,
  getRemainingTime
} from '../constants/flashSaleData';

const FlashSalePage = () => {
  const [flashSales, setFlashSales] = useState(flashSaleData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSale, setSelectedSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort flash sales
  const filteredSales = useMemo(() => {
    let filtered = flashSales.filter(sale => {
      const products = getProductsByIds(sale.products);
      const productNames = products.map(p => p.name).join(' ');
      
      const matchesSearch = sale.saleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productNames.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || sale.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    // Sort flash sales
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdDate' || sortField === 'startDate' || sortField === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'discountPercentage' || sortField === 'totalSales' || sortField === 'revenue') {
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

  const handleDeleteSale = (saleId) => {
    const sale = flashSales.find(s => s.id === saleId);
    if (window.confirm(`Are you sure you want to delete flash sale "${sale?.saleName}"? This action cannot be undone.`)) {
      setFlashSales(prev => prev.filter(s => s.id !== saleId));
      showSuccess(`Flash sale "${sale?.saleName}" deleted successfully!`);
    }
  };

  const handleSaveSale = (saleData) => {
    if (modalMode === 'add') {
      const newSale = {
        ...saleData,
        id: Math.max(...flashSales.map(s => s.id)) + 1,
        createdDate: new Date().toISOString(),
        totalSales: 0,
        revenue: 0
      };
      setFlashSales(prev => [newSale, ...prev]);
      showSuccess(`Flash sale "${newSale.saleName}" created successfully!`);
    } else if (modalMode === 'edit') {
      setFlashSales(prev => prev.map(s => 
        s.id === saleData.id ? { 
          ...saleData, 
          createdDate: s.createdDate,
          totalSales: s.totalSales,
          revenue: s.revenue
        } : s
      ));
      showSuccess(`Flash sale "${saleData.saleName}" updated successfully!`);
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
            <option value="discountPercentage-desc">Highest Discount</option>
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
              <th>Products Included</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('discountPercentage')}>
                Discount %
                {sortField === 'discountPercentage' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('startDate')}>
                Start Date/Time
                {sortField === 'startDate' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('endDate')}>
                End Date/Time
                {sortField === 'endDate' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale) => {
              const products = getProductsByIds(sale.products);
              const currentStatus = getSaleStatus(sale.startDate, sale.endDate, sale.status);
              
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
                          {getRemainingTime(sale.endDate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.productsIncluded}>
                      <div className={styles.productCount}>
                        {products.length} product{products.length !== 1 ? 's' : ''}
                      </div>
                      <div className={styles.productList}>
                        {products.slice(0, 2).map(product => (
                          <div key={product.id} className={styles.productItem}>
                            {product.name}
                          </div>
                        ))}
                        {products.length > 2 && (
                          <div className={styles.moreProducts}>
                            +{products.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <div className={styles.discountBadge}>
                      {sale.discountPercentage}% OFF
                    </div>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <span className={styles.dateTime}>
                      {formatDate(sale.startDate)}
                    </span>
                  </td>
                  <td className={styles.flashSaleTableCell}>
                    <span className={styles.dateTime}>
                      {formatDate(sale.endDate)}
                    </span>
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
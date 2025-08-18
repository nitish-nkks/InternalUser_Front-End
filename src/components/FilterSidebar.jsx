import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { FiX, FiSearch } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './FilterSidebar.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  darkMode = false 
}) => {
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    orderStatus: 'All',
    productCategory: 'All',
    searchQuery: ''
  });

  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && overlayRef.current && event.target === overlayRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      dateFrom: null,
      dateTo: null,
      orderStatus: 'All',
      productCategory: 'All',
      searchQuery: ''
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const orderStatusOptions = [
    'All',
    'Pending',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const productCategoryOptions = [
    'All',
    'Poultry Feed',
    'Shrimp Feed',
    'Fish Feed'
  ];

  return (
    <>
      <div 
        ref={overlayRef}
        className={classNames(styles.overlay, { [styles.open]: isOpen })}
      />
      
      <div 
        ref={sidebarRef}
        className={classNames(
          styles.sidebar, 
          { 
            [styles.open]: isOpen,
            [styles.dark]: darkMode
          }
        )}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Filter Dashboard</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close filter sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Date Range Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Date Range</label>
            <div className={styles.dateRangeGroup}>
              <div className={styles.dateInput}>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  selectsStart
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  placeholderText="From"
                  dateFormat="dd/MM/yyyy"
                  className={styles.input}
                />
              </div>
              <span className={styles.dateRangeSeparator}>to</span>
              <div className={styles.dateInput}>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  selectsEnd
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  minDate={filters.dateFrom}
                  placeholderText="To"
                  dateFormat="dd/MM/yyyy"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Order Status Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Order Status</label>
            <select
              className={styles.select}
              value={filters.orderStatus}
              onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
            >
              {orderStatusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Product Category Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Product Category</label>
            <select
              className={styles.select}
              value={filters.productCategory}
              onChange={(e) => handleFilterChange('productCategory', e.target.value)}
            >
              {productCategoryOptions.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Search</label>
            <div className={styles.searchInputWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                className={classNames(styles.input, styles.searchInput)}
                placeholder="Search orders, customers, products..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={classNames(styles.button, styles.primaryButton)}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          <button 
            className={classNames(styles.button, styles.secondaryButton)}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
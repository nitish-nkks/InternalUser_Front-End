import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiChevronUp, FiChevronDown, FiImage } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './BannersPage.module.css';
import BannerModal from '../components/BannerModal';
import ImageModal from '../components/ImageModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { 
  bannerData, 
  statusOptions, 
  positionOptions,
  getStatusLabel, 
  getPositionLabel, 
  formatDate,
  getStatusColor,
  getPositionColor,
  calculateCTR
} from '../constants/bannerData';

const BannersPage = () => {
  const [banners, setBanners] = useState(bannerData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '' });

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort banners
  const filteredBanners = useMemo(() => {
    let filtered = banners.filter(banner => {
      const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || banner.status === filterStatus;
      const matchesPosition = !filterPosition || banner.position === filterPosition;
      
      return matchesSearch && matchesStatus && matchesPosition;
    });

    // Sort banners
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'clicks' || sortField === 'impressions') {
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
  }, [banners, searchTerm, filterStatus, filterPosition, sortField, sortOrder]);

  // Paginate banners
  const paginatedBanners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBanners.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBanners, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setFilterStatus(value);
    } else if (type === 'position') {
      setFilterPosition(value);
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

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteBanner = (bannerId) => {
    const banner = banners.find(b => b.id === bannerId);
    if (window.confirm(`Are you sure you want to delete banner "${banner?.title}"? This action cannot be undone.`)) {
      setBanners(prev => prev.filter(b => b.id !== bannerId));
      showSuccess(`Banner "${banner?.title}" deleted successfully!`);
    }
  };

  const handleSaveBanner = (bannerData) => {
    if (modalMode === 'add') {
      const newBanner = {
        ...bannerData,
        id: Math.max(...banners.map(b => b.id)) + 1,
        createdDate: new Date().toISOString(),
        clicks: 0,
        impressions: 0
      };
      setBanners(prev => [newBanner, ...prev]);
      showSuccess(`Banner "${newBanner.title}" created successfully!`);
    } else if (modalMode === 'edit') {
      setBanners(prev => prev.map(b => 
        b.id === bannerData.id ? { 
          ...bannerData, 
          createdDate: b.createdDate,
          clicks: b.clicks,
          impressions: b.impressions
        } : b
      ));
      showSuccess(`Banner "${bannerData.title}" updated successfully!`);
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? styles.statusActive : styles.statusInactive;
  };

  const getPositionClass = (position) => {
    const positionClasses = {
      hero: styles.positionHero,
      sidebar: styles.positionSidebar,
      footer: styles.positionFooter,
      popup: styles.positionPopup
    };
    return positionClasses[position] || styles.positionDefault;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageClick = (imageSrc, imageAlt) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
    setIsImageModalOpen(true);
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
    <div className={styles.bannersPageContainer}>
      {/* Page Header */}
      <div className={styles.bannersPageHeader}>
        <div className={styles.bannersHeaderLeft}>
          <h1 className={styles.bannersPageTitle}>Banner Management</h1>
          <p className={styles.bannersPageSubtitle}>
            Manage promotional banners and advertisements
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.bannersTopBar}>
        <div className={styles.bannersSearchAndFilters}>
          <div className={styles.bannersSearchBar}>
            <input
              type="text"
              placeholder="Search by title, description, or URL..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select 
            className={styles.bannersFilterSelect}
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
            className={styles.bannersFilterSelect}
            value={filterPosition}
            onChange={(e) => handleFilterChange('position', e.target.value)}
          >
            <option value="">All Positions</option>
            {positionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className={styles.bannersSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="createdDate-desc">Newest First</option>
            <option value="createdDate-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="clicks-desc">Most Clicks</option>
            <option value="clicks-asc">Least Clicks</option>
            <option value="impressions-desc">Most Impressions</option>
            <option value="impressions-asc">Least Impressions</option>
          </select>
        </div>

        <div className={styles.bannersTopBarActions}>
          <button
            className={styles.bannersAddButton}
            onClick={handleAddBanner}
          >
            <FiPlus />
            Add Banner
          </button>
        </div>
      </div>

      {/* Banners Table */}
      <div className={styles.bannersTableContainer}>
        <table className={styles.bannersTable}>
          <thead className={styles.bannersTableHeader}>
            <tr>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('title')}>
                Banner Title
                {sortField === 'title' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Image Preview</th>
              <th>Link/URL</th>
              <th>Position</th>
              <th>Status</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('clicks')}>
                Performance
                {sortField === 'clicks' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('createdDate')}>
                Created Date
                {sortField === 'createdDate' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.map((banner) => (
              <tr key={banner.id} className={styles.bannersTableRow}>
                <td className={styles.bannersTableCell}>
                  <div className={styles.bannerTitleCell}>
                    <div className={styles.bannerTitle}>{banner.title}</div>
                    <div className={styles.bannerDescription}>{banner.description}</div>
                  </div>
                </td>
                <td className={styles.bannersTableCell}>
                  <div className={styles.imagePreview}>
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className={styles.bannerImage}
                      onClick={() => handleImageClick(banner.image, banner.title)}
                      style={{ cursor: 'pointer' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x60?text=No+Image';
                      }}
                    />
                  </div>
                </td>
                <td className={styles.bannersTableCell}>
                  <div className={styles.bannerUrl}>
                    <span className={styles.urlText}>{banner.url}</span>
                    <a
                      href={banner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.urlLink}
                      title="Open link"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </td>
                <td className={styles.bannersTableCell}>
                  <span className={classNames(styles.positionBadge, getPositionClass(banner.position))}>
                    {getPositionLabel(banner.position)}
                  </span>
                </td>
                <td className={styles.bannersTableCell}>
                  <span className={classNames(styles.statusBadge, getStatusClass(banner.status))}>
                    {getStatusLabel(banner.status)}
                  </span>
                </td>
                <td className={styles.bannersTableCell}>
                  <div className={styles.performanceStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Clicks:</span>
                      <span className={styles.statValue}>{banner.clicks.toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Impressions:</span>
                      <span className={styles.statValue}>{banner.impressions.toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>CTR:</span>
                      <span className={styles.ctrValue}>{calculateCTR(banner.clicks, banner.impressions)}%</span>
                    </div>
                  </div>
                </td>
                <td className={styles.bannersTableCell}>
                  <span className={styles.createdDate}>
                    {formatDate(banner.createdDate)}
                  </span>
                </td>
                <td className={styles.bannersTableCell}>
                  <div className={styles.bannersActions}>
                    <button
                      className={classNames(styles.bannersActionButton, styles.bannersEditButton)}
                      onClick={() => handleEditBanner(banner)}
                      title="Edit banner"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={classNames(styles.bannersActionButton, styles.bannersDeleteButton)}
                      onClick={() => handleDeleteBanner(banner.id)}
                      title="Delete banner"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBanners.length)} of {filteredBanners.length} banners
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
        {filteredBanners.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FiImage size={48} />
            </div>
            <div className={styles.noResultsTitle}>No banners found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Get started by adding your first banner'}
            </div>
            {!searchTerm && (
              <button
                className={styles.noResultsButton}
                onClick={handleAddBanner}
              >
                <FiPlus />
                Add Banner
              </button>
            )}
          </div>
        )}
      </div>

      {/* Banner Modal */}
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBanner}
        banner={selectedBanner}
        mode={modalMode}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={selectedImage.src}
        imageAlt={selectedImage.alt}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default BannersPage;
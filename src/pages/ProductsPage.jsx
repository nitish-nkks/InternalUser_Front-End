import React, { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProductsPage.module.css';
import ProductModal from '../components/ProductModal';
import ImageModal from '../components/ImageModal';
import { ToastContainer } from '../components/Toast';
import { useAdminLayout } from '../contexts/AdminLayoutContext';
import useToast from '../hooks/useToast';
import { productData, getCategoryLabel, getStatusLabel, formatDate, categoryOptions, statusOptions } from '../constants/productData';

const ProductsPage = () => {
  const [products, setProducts] = useState(productData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '' });

  const { openFilterSidebar } = useAdminLayout();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filterCategory || product.category === filterCategory;
      const matchesStatus = !filterStatus || product.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'price' || sortField === 'stock') {
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
  }, [products, searchTerm, filterCategory, filterStatus, sortField, sortOrder]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilterCategory(value);
    } else if (type === 'status') {
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


  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (window.confirm(`Are you sure you want to remove "${product?.name}"? This action cannot be undone.`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showSuccess(`Product "${product?.name}" removed successfully!`);
    }
  };

  const handleSaveProduct = (productData) => {
    if (modalMode === 'add') {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id)) + 1,
        createdDate: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]); // Add new product at the beginning
      showSuccess(`Product "${newProduct.name}" created successfully!`);
    } else if (modalMode === 'edit') {
      setProducts(prev => prev.map(p => 
        p.id === productData.id ? { ...productData, createdDate: p.createdDate } : p
      ));
      showSuccess(`Product "${productData.name}" updated successfully!`);
    }
  };

  const getStockClass = (stock) => {
    if (stock <= 20) return styles.productsStockLow;
    if (stock <= 50) return styles.productsStockMedium;
    return styles.productsStockHigh;
  };

  const getStatusClass = (status) => {
    return status === 'active' ? styles.productsStatusActive : styles.productsStatusInactive;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
    <div className={styles.productsPageContainer}>
      {/* Page Header */}
      <div className={styles.productsPageHeader}>
        <div className={styles.productsHeaderLeft}>
          <h1 className={styles.productsPageTitle}>Products</h1>
          <p className={styles.productsPageSubtitle}>
            Manage your feed inventory - Poultry, Shrimp, and Fish feed products
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.productsTopBar}>
        <div className={styles.productsSearchAndFilters}>
          <div className={styles.productsSearchBar}>
            <input
              type="text"
              placeholder="Search by name, SKU, category..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select 
            className={styles.productsFilterSelect}
            value={filterCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className={styles.productsFilterSelect}
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
            className={styles.productsSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="createdDate-desc">Newest First</option>
            <option value="createdDate-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stock-asc">Stock Low to High</option>
            <option value="stock-desc">Stock High to Low</option>
          </select>
        </div>

        <div className={styles.productsTopBarActions}>
          <button
            className={styles.productsAddButton}
            onClick={handleAddProduct}
          >
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.productsTableContainer}>
        <table className={styles.productsTable}>
          <thead className={styles.productsTableHeader}>
            <tr>
              <th>Product Name</th>
              <th>SKU/Code</th>
              <th>Category</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('price')}>
                Price
                {sortField === 'price' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Discount Price</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('stock')}>
                Stock
                {sortField === 'stock' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Status</th>
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
            {paginatedProducts.map((product) => (
              <tr key={product.id} className={styles.productsTableRow}>
                <td className={styles.productsTableCell}>
                  <div className={styles.productNameCell}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productsProductImage}
                      onClick={() => handleImageClick(product.image, product.name)}
                      style={{ cursor: 'pointer' }}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const placeholder = document.createElement('div');
                        placeholder.className = styles.imagePlaceholder;
                        placeholder.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7-3 4z"></path></svg>';
                        if (parent) {
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                    <div className={styles.productInfo}>
                      <div className={styles.productsProductName}>{product.name}</div>
                      <div className={styles.productsProductDescription}>
                        {product.description && product.description.length > 50 ? (
                          <>
                            {expandedDescriptions.has(product.id) 
                              ? product.description 
                              : `${product.description.substring(0, 50)}...`
                            }
                            <button
                              className={styles.readMoreButton}
                              onClick={() => toggleDescription(product.id)}
                            >
                              {expandedDescriptions.has(product.id) ? 'Read less' : 'Read more'}
                            </button>
                          </>
                        ) : (
                          product.description || 'No description'
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.productSku}>
                    {product.sku || `SKU-${product.id.toString().padStart(4, '0')}`}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.categoryBadge}>
                    {getCategoryLabel(product.category)}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.productsPrice}>₹{product.price.toFixed(2)}</span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.discountPrice}>
                    {product.discountPrice ? `₹${product.discountPrice.toFixed(2)}` : '-'}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={classNames(styles.productsStock, getStockClass(product.stock))}>
                    {product.stock}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={classNames(styles.productsStatusBadge, getStatusClass(product.status))}>
                    {getStatusLabel(product.status)}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.productsCreatedDate}>
                    {formatDate(product.createdDate)}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <div className={styles.productsActions}>
                    <button
                      className={classNames(styles.productsActionButton, styles.productsViewButton)}
                      onClick={() => handleViewProduct(product)}
                      title="View product details"
                    >
                      <FiEye />
                    </button>
                    <button
                      className={classNames(styles.productsActionButton, styles.productsEditButton)}
                      onClick={() => handleEditProduct(product)}
                      title="Edit this product"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={classNames(styles.productsActionButton, styles.productsDeleteButton)}
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Delete this product"
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
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

export default ProductsPage;
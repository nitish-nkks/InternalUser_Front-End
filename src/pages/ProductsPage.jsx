import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProductsPage.module.css';
import productModalStyles from '../components/ProductModal.module.css';
import ProductModal from '../components/ProductModal';
import ImageModal from '../components/ImageModal';
import { ToastContainer } from '../components/Toast';
import { useAdminLayout } from '../contexts/AdminLayoutContext';
import useToast from '../hooks/useToast';
import { getCategoryLabel, formatDate, categoryOptions } from '../constants/productData';
import { getAllProductsFiltered, deleteProduct, updateProduct } from '../api/api';

const UpdateModal = ({ isOpen, onClose, onSave, product }) => {
  console.log('UpdateModal props:', { isOpen, product: product?.id, productName: product?.name });
  const [formData, setFormData] = useState({
    description: product ? product.description : '',
    price: product ? product.price : 0,
    discountPercentage: product ? product.discountPercentage : 0,
    stockQuantity: product ? product.stockQuantity : 0,
    minOrderQuantity: product ? product.minOrderQuantity : 0,
    isFeatured: product ? product.isFeatured : false,
    isNewProduct: product ? product.isNewProduct : false,
    isBestSeller: product ? product.isBestSeller : false,
    image: product ? product.image : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        description: product.description || '',
        price: product.price || 0,
        discountPercentage: product.discountPercentage || 0,
        stockQuantity: product.stockQuantity || 0,
        minOrderQuantity: product.minOrderQuantity || 0,
        isFeatured: !!product.isFeatured,
        isNewProduct: !!product.isNewProduct,
        isBestSeller: !!product.isBestSeller,
        image: product.image || ''
      });
    }
  }, [isOpen, product]);

  console.log('UpdateModal render - isOpen:', isOpen, 'product:', !!product); // Debug log

  if (!isOpen || !product) {
    console.log('UpdateModal not rendering - isOpen:', isOpen, 'product:', !!product); // Debug log
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        id: product.id,
        name: product.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage),
        stockQuantity: parseFloat(formData.stockQuantity),
        minOrderQuantity: parseFloat(formData.minOrderQuantity),
        isFeatured: formData.isFeatured,
        isNewProduct: formData.isNewProduct,
        isBestSeller: formData.isBestSeller,
        image: formData.image
      };

      await onSave(updatedData);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={productModalStyles.modalOverlay}>
      <div className={productModalStyles.modalContent}>
        <h2 className={productModalStyles.modalTitle}>Update Product: {product.name}</h2>
        <form onSubmit={handleSubmit} className={productModalStyles.modalForm}>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={productModalStyles.textarea}
            />
          </div>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Price (₹)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className={productModalStyles.input}
            />
          </div>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Discount (%)</label>
            <input
              type="number"
              name="discountPercentage"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={handleChange}
              className={productModalStyles.input}
            />
          </div>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className={productModalStyles.input}
            />
          </div>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Min Order Quantity</label>
            <input
              type="number"
              name="minOrderQuantity"
              min="0"
              value={formData.minOrderQuantity}
              onChange={handleChange}
              required
              className={productModalStyles.input}
            />
          </div>
          <div className={productModalStyles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              {' '}Featured Product
            </label>
          </div>
          <div className={productModalStyles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="isNewProduct"
                checked={formData.isNewProduct}
                onChange={handleChange}
              />
              {' '}New Product
            </label>
          </div>
          <div className={productModalStyles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
              />
              {' '}Best Seller
            </label>
          </div>
          <div className={productModalStyles.formGroup}>
            <label className={productModalStyles.label}>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className={productModalStyles.input}
            />
          </div>
          <div className={productModalStyles.modalFooter}>
            <button
              type="submit"
              className={productModalStyles.modalButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={productModalStyles.modalButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProductData, setOriginalProductData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '' });
  const [totalCount, setTotalCount] = useState(0);

  const { openFilterSidebar } = useAdminLayout();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllProductsFiltered({
          page: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm,
        });
        setProducts(response.data);
        setTotalCount(response.totalCount);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm, filterCategory, sortField, sortOrder]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'price' || sortField === 'stockQuantity') {
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
  }, [products, sortField, sortOrder]);

  const paginatedProducts = useMemo(() => {
    return products;
  }, [products]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilterCategory(value);
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
    if (!product || !product.id) {
      showError('Invalid product');
      return;
    }
    setSelectedProduct(product);
    setOriginalProductData(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };


  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (window.confirm(`Are you sure you want to remove "${product?.name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(productId);
        showSuccess(`Product "${product?.name}" removed successfully!`);
        const response = await getAllProductsFiltered({
          page: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm,
        });
        setProducts(response.data);
        setTotalCount(response.totalCount);
      } catch (err) {
        console.error("Failed to delete product:", err);
        showError(`Failed to delete product: ${err.message || err}`);
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (modalMode === 'add') {
        // Handle add logic here (not shown in original code)
        showSuccess(`Product "${productData.name}" created successfully!`);
      } else if (modalMode === 'edit') {
        console.log('Saving product with ID:', productData.id); // Debug log
        console.log('Product data:', productData); // Debug log

        // Ensure we have the product ID
        if (!productData.id) {
          throw new Error('Product ID is missing');
        }

        const fieldsToCompare = [
          'description',
          'price',
          'discountPercentage',
          'stockQuantity',
          'minOrderQuantity',
          'isFeatured',
          'isNewProduct',
          'isBestSeller'
        ];

        const payload = {};
        let hasChanges = false;

        // Compare each field with original data
        fieldsToCompare.forEach(field => {
          if (productData[field] !== originalProductData[field]) {
            payload[field] = productData[field];
            hasChanges = true;
          }
        });

        // Handle image changes
        if (productData.image !== originalProductData.image) {
          payload.ProductImages = [productData.image];
          hasChanges = true;
        }

        console.log('Payload to send:', payload);
        console.log('Has changes:', hasChanges);

        if (hasChanges) {
          await updateProduct(productData.id, payload);
          showSuccess(`Product "${productData.name}" updated successfully!`);
        } else {
          showSuccess(`No changes detected for product "${productData.name}".`);
        }

        // Close modal and refresh data
        setIsModalOpen(false);

        // Refresh the products list
        const response = await getAllProductsFiltered({
          page: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm,
        });
        setProducts(response.data);
        setTotalCount(response.totalCount);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      showError(`Failed to save product: ${err.message || err}`);
    }
  };

  const getStockClass = (stock) => {
    if (stock <= 20) return styles.productsStockLow;
    if (stock <= 50) return styles.productsStockMedium;
    return styles.productsStockHigh;
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
            className={styles.productsSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stockQuantity-asc">Stock Low to High</option>
            <option value="stockQuantity-desc">Stock High to Low</option>
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
              <th>Category</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('price')}>
                Price
                {sortField === 'price' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Discount Percentage</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('stock')}>
                Stock
                {sortField === 'stock' ? (
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
            {paginatedProducts.map((product) => (
              <tr key={product.id} className={styles.productsTableRow}>
                <td className={styles.productsTableCell}>
                  <div className={styles.productNameCell}>
                    <div className={styles.productInfo}>
                      <div className={styles.productsProductName}>{product.name}</div>
                      <div className={styles.productsProductDescription}>
                        {product.description && product.description.length > 50 ? (
                          <>
                            {expandedDescriptions.has(product.id)
                              ? product.description
                              : `${product.description.substring(0, 50)}...`}
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
                  <span className={styles.categoryBadge}>
                    {product.categoryId}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.productsPrice}>₹{product.price.toFixed(2)}</span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.discountPrice}>
                    {product.discountPercentage ? `${product.discountPercentage}%` : '-'}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={classNames(styles.productsStock, getStockClass(product.stockQuantity))}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className={styles.productsTableCell}>
                  <span className={styles.productsCreatedDate}>
                    {formatDate(product.createdAt)}
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Edit button clicked for product:', product);
                        handleEditProduct(product);
                      }}
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

      {/* Add or Update Product Modal */}
      {console.log('Rendering modals - modalMode:', modalMode, 'isModalOpen:', isModalOpen, 'selectedProduct:', selectedProduct)}

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log('Closing modal');
            setIsModalOpen(false);
            setSelectedProduct(null);
            setOriginalProductData(null);
          }}
          onSave={handleSaveProduct}
          product={selectedProduct}
          mode={modalMode}
        />
      )}


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
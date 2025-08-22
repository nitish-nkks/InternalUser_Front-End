import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiLoader } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './CategoriesPage.module.css';
import CategoryModal from '../components/CategoryModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { getCategory, addCategory, updateCategory, deleteCategory } from '../api/api';

// Helpers moved outside component for better readability
const getStatusLabel = (isActive) => (isActive ? 'Active' : 'Inactive');
const getStatusClass = (isActive) => (isActive ? styles.statusActive : styles.statusInactive);

const SortableHeader = ({ children, field, sortField, sortOrder, onSort }) => (
  <th className={styles.sortableColumn} onClick={() => onSort(field)}>
    {children}
    {sortField === field && (
      sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
    )}
  </th>
);

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategory();
        const data = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getParentCategoryName = (parentId) => {
    if (!parentId) return '—';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : '—';
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(cat =>
      (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal ?? '').toLowerCase();
        bVal = String(bVal ?? '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [categories, searchTerm, sortField, sortOrder]);

  const handleSortChange = (field) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showSuccess('Category deleted.');
    } catch (err) {
      console.error(err);
      showError(err.message || 'Error deleting category.');
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (modalMode === 'edit') {
        const updatedCategory = await updateCategory(data.id, data);
        setCategories(prev => prev.map(c => (c.id === data.id ? updatedCategory : c)));
        showSuccess(`Category "${data.name}" updated.`);
      } else {
        const newCategory = await addCategory(data);
        setCategories(prev => [newCategory, ...prev]);
        showSuccess(`Category "${data.name}" added.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message || `Error saving category.`);
    }
  };

  if (loading) return <div className={styles.centeredLoader}><FiLoader className={styles.loaderIcon} /><span>Loading Categories...</span></div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.categoriesPageContainer}>
      <div className={styles.categoriesPageHeader}>
        <h1 className={styles.categoriesPageTitle}>Categories</h1>
        <p className={styles.categoriesPageSubtitle}>Manage product categories with hierarchical organization.</p>
      </div>

      <div className={styles.categoriesTopBar}>
        <div className={styles.categoriesSearchAndFilters}>
          <div className={styles.categoriesSearchBar}>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className={styles.searchIcon} />
          </div>
          <select
            className={styles.categoriesSortSelect}
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
          </select>
        </div>
        <div className={styles.categoriesTopBarActions}>
          <button className={styles.categoriesAddButton} onClick={handleAddCategory}>
            <FiPlus /> Add Category
          </button>
        </div>
      </div>

      <div className={styles.categoriesTableContainer}>
        <table className={styles.categoriesTable}>
          <thead className={styles.categoriesTableHeader}>
            <tr>
              <SortableHeader field="name" sortField={sortField} sortOrder={sortOrder} onSort={handleSortChange}>Name</SortableHeader>
              <th>Parent Category</th>
              <th>Description</th>
              <SortableHeader field="isActive" sortField={sortField} sortOrder={sortOrder} onSort={handleSortChange}>Status</SortableHeader>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.id} className={styles.categoriesTableRow}>
                <td className={styles.categoriesTableCell}>{category.name}</td>
                <td className={styles.categoriesTableCell}><span className={styles.parentCategoryBadge}>{getParentCategoryName(category.parentCategoryId)}</span></td>
                <td className={styles.categoriesTableCell}>{category.description || '—'}</td>
                <td className={styles.categoriesTableCell}>
                  <span className={classNames(styles.categoriesStatusBadge, getStatusClass(category.isActive))}>
                    {getStatusLabel(category.isActive)}
                  </span>
                </td>
                <td className={styles.categoriesTableCell}>
                  <div className={styles.categoriesActions}>
                    <button className={classNames(styles.categoriesActionButton, styles.categoriesEditButton)} onClick={() => handleEditCategory(category)}><FiEdit2 /></button>
                    <button className={classNames(styles.categoriesActionButton, styles.categoriesDeleteButton)} onClick={() => handleDeleteCategory(category.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📂</div>
            <div className={styles.noResultsTitle}>No Categories Found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Adjust your search or' : 'Get started by'} adding a new category.
            </div>
            <button className={styles.noResultsButton} onClick={handleAddCategory}>
              <FiPlus /> Add New Category
            </button>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        categories={categories}
        mode={modalMode}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default CategoriesPage;

import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './CategoriesPage.module.css';
import CategoryModal from '../components/CategoryModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { categoryData, getStatusLabel, formatDate, getParentCategoryName, getCategoryPath } from '../constants/categoryData';

const CategoriesPage = () => {
  const [categories, setCategories] = useState(categoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(category => {
      const parentName = getParentCategoryName(category.parentId);
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parentName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort categories
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'parentCategory') {
        aValue = getParentCategoryName(a.parentId);
        bValue = getParentCategoryName(b.parentId);
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
  }, [categories, searchTerm, sortField, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(c => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) return;
    
    const categoryNames = selectedCategories.map(id => 
      categories.find(c => c.id === id)?.name
    ).filter(Boolean);
    
    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} selected categories?\n\nCategories: ${categoryNames.join(', ')}\n\nThis action cannot be undone.`)) {
      setCategories(prev => prev.filter(c => !selectedCategories.includes(c.id)));
      setSelectedCategories([]);
      showSuccess(`Successfully deleted ${selectedCategories.length} categories`);
    }
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

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (window.confirm(`Are you sure you want to delete "${category?.name}"? This action cannot be undone.`)) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showSuccess(`Category "${category?.name}" deleted successfully!`);
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (modalMode === 'add') {
      const newCategory = {
        ...categoryData,
        id: Math.max(...categories.map(c => c.id)) + 1,
        createdDate: new Date().toISOString()
      };
      setCategories(prev => [newCategory, ...prev]);
      showSuccess(`Category "${newCategory.name}" created successfully!`);
    } else if (modalMode === 'edit') {
      setCategories(prev => prev.map(c => 
        c.id === categoryData.id ? { ...categoryData, createdDate: c.createdDate } : c
      ));
      showSuccess(`Category "${categoryData.name}" updated successfully!`);
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? styles.statusActive : styles.statusInactive;
  };

  return (
    <div className={styles.categoriesPageContainer}>
      {/* Page Header */}
      <div className={styles.categoriesPageHeader}>
        <div className={styles.categoriesHeaderLeft}>
          <h1 className={styles.categoriesPageTitle}>Categories</h1>
          <p className={styles.categoriesPageSubtitle}>
            Manage feed categories with hierarchical organization
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.categoriesTopBar}>
        <div className={styles.categoriesSearchAndFilters}>
          <div className={styles.categoriesSearchBar}>
            <input
              type="text"
              placeholder="Search categories, parent, description..."
              value={searchTerm}
              onChange={handleSearchChange}
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
            <option value="parentCategory-asc">Parent A-Z</option>
            <option value="parentCategory-desc">Parent Z-A</option>
            <option value="createdDate-desc">Newest First</option>
            <option value="createdDate-asc">Oldest First</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>

        <div className={styles.categoriesTopBarActions}>
          {selectedCategories.length > 0 && (
            <button
              className={styles.categoriesBulkDeleteButton}
              onClick={handleBulkDelete}
            >
              <FiTrash2 />
              Delete ({selectedCategories.length})
            </button>
          )}
          
          <button
            className={styles.categoriesAddButton}
            onClick={handleAddCategory}
          >
            <FiPlus />
            Add New Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className={styles.categoriesTableContainer}>
        <table className={styles.categoriesTable}>
          <thead className={styles.categoriesTableHeader}>
            <tr>
              <th className={styles.checkboxColumn}>
                <input
                  type="checkbox"
                  checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                  onChange={handleSelectAll}
                  className={styles.selectAllCheckbox}
                />
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('name')}>
                Category Name
                {sortField === 'name' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('parentCategory')}>
                Parent Category
                {sortField === 'parentCategory' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Description</th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('status')}>
                Status
                {sortField === 'status' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className={styles.categoriesTableRow}>
                <td className={styles.categoriesTableCell}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                    className={styles.categoryCheckbox}
                  />
                </td>
                <td className={styles.categoriesTableCell}>
                  <div className={styles.categoryNameCell}>
                    <div className={styles.categoryCategoryName}>
                      {category.name}
                    </div>
                    <div className={styles.categoryPath}>
                      {getCategoryPath(category.id)}
                    </div>
                  </div>
                </td>
                <td className={styles.categoriesTableCell}>
                  <span className={styles.parentCategoryBadge}>
                    {getParentCategoryName(category.parentId)}
                  </span>
                </td>
                <td className={styles.categoriesTableCell}>
                  <div className={styles.categoryDescription}>
                    {category.description || 'No description'}
                  </div>
                </td>
                <td className={styles.categoriesTableCell}>
                  <span className={classNames(styles.categoriesStatusBadge, getStatusClass(category.status))}>
                    {getStatusLabel(category.status)}
                  </span>
                </td>
                <td className={styles.categoriesTableCell}>
                  <div className={styles.categoriesActions}>
                    <button
                      className={classNames(styles.categoriesActionButton, styles.categoriesEditButton)}
                      onClick={() => handleEditCategory(category)}
                      title="Edit this category"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={classNames(styles.categoriesActionButton, styles.categoriesDeleteButton)}
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete this category"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📂</div>
            <div className={styles.noResultsTitle}>No categories found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first category'}
            </div>
            {!searchTerm && (
              <button
                className={styles.noResultsButton}
                onClick={handleAddCategory}
              >
                <FiPlus />
                Add New Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        categories={categories}
        mode={modalMode}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default CategoriesPage;
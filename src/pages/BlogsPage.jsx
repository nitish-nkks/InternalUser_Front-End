import React, { useState, useMemo } from 'react';
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown,
  FiFileText, FiCalendar, FiFilter, FiMoreHorizontal, FiImage
} from 'react-icons/fi';
import classNames from 'classnames';
import styles from './BlogsPage.module.css';
import AddEditBlogModal from '../components/AddEditBlogModal';
import ImageModal from '../components/ImageModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { 
  blogData as initialBlogData, 
  statusOptions,
  authors,
  formatDate,
  getStatusColor,
  stripHtml
} from '../constants/blogData';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState(initialBlogData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '' });

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtml(blog.content).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || blog.status === filterStatus;
      const matchesAuthor = !filterAuthor || blog.author === filterAuthor;
      
      let matchesDateRange = true;
      if (dateRange.start || dateRange.end) {
        const publishDate = blog.publishDate ? new Date(blog.publishDate) : null;
        const createdDate = new Date(blog.createdAt);
        const dateToCheck = publishDate || createdDate;
        
        if (dateRange.start) {
          matchesDateRange = matchesDateRange && dateToCheck >= new Date(dateRange.start);
        }
        if (dateRange.end) {
          matchesDateRange = matchesDateRange && dateToCheck <= new Date(dateRange.end + 'T23:59:59');
        }
      }
      
      return matchesSearch && matchesStatus && matchesAuthor && matchesDateRange;
    });

    // Sort blogs
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'publishDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      } else if (sortField === 'wordCount' || sortField === 'charCount') {
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
  }, [blogs, searchTerm, filterStatus, filterAuthor, dateRange, sortField, sortOrder]);

  // Paginate blogs
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') setFilterStatus(value);
    if (type === 'author') setFilterAuthor(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
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

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === paginatedBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(paginatedBlogs.map(blog => blog.id));
    }
  };

  const handleAddBlog = () => {
    setSelectedBlog(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteBlog = (blogId) => {
    const blog = blogs.find(b => b.id === blogId);
    if (window.confirm(`Are you sure you want to delete the blog "${blog?.title}"? This action cannot be undone.`)) {
      setBlogs(prev => prev.filter(b => b.id !== blogId));
      setSelectedBlogs(prev => prev.filter(id => id !== blogId));
      showSuccess(`Blog "${blog?.title}" deleted successfully!`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) return;
    
    const blogsToDelete = blogs.filter(blog => selectedBlogs.includes(blog.id));
    const blogTitles = blogsToDelete.map(blog => blog.title).join(', ');
    
    if (window.confirm(`Are you sure you want to delete ${selectedBlogs.length} blog(s)? This action cannot be undone.\n\nBlogs to delete: ${blogTitles}`)) {
      setBlogs(prev => prev.filter(blog => !selectedBlogs.includes(blog.id)));
      showSuccess(`${selectedBlogs.length} blog(s) deleted successfully!`);
      setSelectedBlogs([]);
    }
  };

  const handleSaveBlog = (blogData) => {
    if (modalMode === 'add') {
      const newBlog = {
        ...blogData,
        id: Math.max(...blogs.map(b => b.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishDate: blogData.status === 'published' ? new Date().toISOString() : null
      };
      setBlogs(prev => [newBlog, ...prev]);
      showSuccess(`Blog "${newBlog.title}" created successfully!`);
    } else if (modalMode === 'edit') {
      setBlogs(prev => prev.map(b => 
        b.id === blogData.id ? { 
          ...blogData, 
          updatedAt: new Date().toISOString(),
          publishDate: blogData.status === 'published' && !b.publishDate 
            ? new Date().toISOString() 
            : b.publishDate
        } : b
      ));
      showSuccess(`Blog "${blogData.title}" updated successfully!`);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      published: styles.statusPublished,
      draft: styles.statusDraft
    };
    return statusClasses[status] || styles.statusDefault;
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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterAuthor('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  return (
    <div className={styles.blogsPageContainer}>
      {/* Page Header */}
      <div className={styles.blogsPageHeader}>
        <div className={styles.blogsHeaderLeft}>
          <h1 className={styles.blogsPageTitle}>Blog Management</h1>
          <p className={styles.blogsPageSubtitle}>
            Create and manage blog posts
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.blogsTopBar}>
        <div className={styles.blogsSearchAndFilters}>
          <div className={styles.blogsSearchBar}>
            <input
              type="text"
              placeholder="Search blogs by title, author, or content..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select 
            className={styles.blogsFilterSelect}
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
            className={styles.blogsFilterSelect}
            value={filterAuthor}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          >
            <option value="">All Authors</option>
            {authors.map(author => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          <div className={styles.dateRangeFilters}>
            <input
              type="date"
              className={styles.dateInput}
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              placeholder="Start date"
            />
            <input
              type="date"
              className={styles.dateInput}
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              placeholder="End date"
            />
          </div>

          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className={styles.blogsTopBarActions}>
          {selectedBlogs.length > 0 && (
            <button
              className={styles.bulkDeleteButton}
              onClick={handleBulkDelete}
            >
              <FiTrash2 />
              Delete Selected ({selectedBlogs.length})
            </button>
          )}
          <button
            className={styles.blogsAddButton}
            onClick={handleAddBlog}
          >
            <FiPlus />
            Add Blog
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className={styles.blogsTableContainer}>
        <table className={styles.blogsTable}>
          <thead className={styles.blogsTableHeader}>
            <tr>
              <th className={styles.checkboxColumn}>
                <input
                  type="checkbox"
                  checked={selectedBlogs.length === paginatedBlogs.length && paginatedBlogs.length > 0}
                  onChange={handleSelectAll}
                  className={styles.selectAllCheckbox}
                />
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('title')}>
                Blog Title
                {sortField === 'title' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('author')}>
                Author
                {sortField === 'author' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('publishDate')}>
                Publish Date
                {sortField === 'publishDate' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th>Status</th>
              <th>Image</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlogs.map((blog) => (
              <tr key={blog.id} className={styles.blogsTableRow}>
                <td className={styles.blogsTableCell}>
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={() => handleSelectBlog(blog.id)}
                    className={styles.rowCheckbox}
                  />
                </td>
                <td className={styles.blogsTableCell}>
                  <div className={styles.blogTitleCell}>
                    <div className={styles.blogTitle}>
                      <FiFileText className={styles.blogIcon} />
                      {blog.title}
                    </div>
                    <div className={styles.blogMeta}>
                      <span className={styles.wordCount}>{blog.wordCount} words</span>
                      <span className={styles.charCount}>{blog.charCount} characters</span>
                    </div>
                  </div>
                </td>
                <td className={styles.blogsTableCell}>
                  <span className={styles.authorName}>{blog.author}</span>
                </td>
                <td className={styles.blogsTableCell}>
                  <span className={styles.dateTime}>
                    {blog.publishDate ? formatDate(blog.publishDate) : 'Not published'}
                  </span>
                </td>
                <td className={styles.blogsTableCell}>
                  <span className={classNames(styles.statusBadge, getStatusClass(blog.status))}>
                    {blog.status}
                  </span>
                </td>
                <td className={styles.blogsTableCell}>
                  {blog.featuredImage ? (
                    <div className={styles.featuredImageContainer}>
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title}
                        className={styles.featuredImageThumbnail}
                        onClick={() => handleImageClick(blog.featuredImage, blog.title)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ) : (
                    <div className={styles.noImagePlaceholder}>
                      <FiImage className={styles.noImageIcon} />
                    </div>
                  )}
                </td>
                <td className={styles.blogsTableCell}>
                  <div className={styles.contentPreview}>
                    {stripHtml(blog.content).substring(0, 100)}...
                  </div>
                </td>
                <td className={styles.blogsTableCell}>
                  <div className={styles.blogsActions}>
                    <button
                      className={classNames(styles.blogsActionButton, styles.blogsEditButton)}
                      onClick={() => handleEditBlog(blog)}
                      title="Edit blog"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={classNames(styles.blogsActionButton, styles.blogsDeleteButton)}
                      onClick={() => handleDeleteBlog(blog.id)}
                      title="Delete blog"
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blogs
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
        {filteredBlogs.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FiFileText size={48} />
            </div>
            <div className={styles.noResultsTitle}>No blogs found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm || filterStatus || filterAuthor || dateRange.start || dateRange.end
                ? 'Try adjusting your search terms or filters'
                : 'Get started by creating your first blog post'
              }
            </div>
            {!searchTerm && !filterStatus && !filterAuthor && !dateRange.start && !dateRange.end && (
              <button
                className={styles.noResultsButton}
                onClick={handleAddBlog}
              >
                <FiPlus />
                Add Blog
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Blog Modal */}
      <AddEditBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlog}
        blog={selectedBlog}
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

export default BlogsPage;
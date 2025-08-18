import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiKey, FiChevronUp, FiChevronDown, FiUsers } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './UsersPage.module.css';
import UserModal from '../components/UserModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { 
  userData, 
  roleOptions, 
  statusOptions,
  getRoleLabel, 
  getStatusLabel, 
  formatDate,
  getRoleColor,
  getStatusColor
} from '../constants/userData';

const UsersPage = () => {
  const [users, setUsers] = useState(userData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !filterRole || user.role === filterRole;
      const matchesStatus = !filterStatus || user.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdDate' || sortField === 'lastLogin') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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
  }, [users, searchTerm, filterRole, filterStatus, sortField, sortOrder]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'role') {
      setFilterRole(value);
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

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete user "${user?.name}"? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      showSuccess(`User "${user?.name}" deleted successfully!`);
    }
  };

  const handleResetPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to reset password for "${user?.name}"? A new password will be sent to their email.`)) {
      showSuccess(`Password reset email sent to ${user?.email}`);
    }
  };

  const handleSaveUser = (userData) => {
    if (modalMode === 'add') {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        createdDate: new Date().toISOString(),
        lastLogin: null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1890ff&color=fff`
      };
      setUsers(prev => [newUser, ...prev]);
      showSuccess(`User "${newUser.name}" created successfully!`);
    } else if (modalMode === 'edit') {
      setUsers(prev => prev.map(u => 
        u.id === userData.id ? { ...userData, createdDate: u.createdDate, lastLogin: u.lastLogin } : u
      ));
      showSuccess(`User "${userData.name}" updated successfully!`);
    }
  };

  const getRoleClass = (role) => {
    const roleClasses = {
      admin: styles.roleAdmin,
      manager: styles.roleManager,
      staff: styles.roleStaff
    };
    return roleClasses[role] || styles.roleDefault;
  };

  const getStatusClass = (status) => {
    return status === 'active' ? styles.statusActive : styles.statusInactive;
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
    <div className={styles.usersPageContainer}>
      {/* Page Header */}
      <div className={styles.usersPageHeader}>
        <div className={styles.usersHeaderLeft}>
          <h1 className={styles.usersPageTitle}>User Management</h1>
          <p className={styles.usersPageSubtitle}>
            Manage system users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className={styles.usersTopBar}>
        <div className={styles.usersSearchAndFilters}>
          <div className={styles.usersSearchBar}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className={styles.searchIcon} />
          </div>

          <select 
            className={styles.usersFilterSelect}
            value={filterRole}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className={styles.usersFilterSelect}
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
            className={styles.usersSortSelect}
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
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
            <option value="role-asc">Role A-Z</option>
            <option value="role-desc">Role Z-A</option>
            <option value="lastLogin-desc">Recently Active</option>
          </select>
        </div>

        <div className={styles.usersTopBarActions}>
          <button
            className={styles.usersAddButton}
            onClick={handleAddUser}
          >
            <FiPlus />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.usersTableContainer}>
        <table className={styles.usersTable}>
          <thead className={styles.usersTableHeader}>
            <tr>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('name')}>
                Name
                {sortField === 'name' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('email')}>
                Email
                {sortField === 'email' ? (
                  sortOrder === 'asc' ? <FiChevronUp className={styles.sortIcon} /> : <FiChevronDown className={styles.sortIcon} />
                ) : (
                  <FiChevronUp className={styles.sortIcon} style={{ opacity: 0.3 }} />
                )}
              </th>
              <th className={styles.sortableColumn} onClick={() => handleSortChange('role')}>
                Role
                {sortField === 'role' ? (
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
            {paginatedUsers.map((user) => (
              <tr key={user.id} className={styles.usersTableRow}>
                <td className={styles.usersTableCell}>
                  <div className={styles.userInfo}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.userAvatar}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1890ff&color=fff`;
                      }}
                    />
                    <div className={styles.userDetails}>
                      <div className={styles.userName}>{user.name}</div>
                      {user.lastLogin && (
                        <div className={styles.lastLogin}>
                          Last login: {formatDate(user.lastLogin)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className={styles.usersTableCell}>
                  <span className={styles.userEmail}>{user.email}</span>
                </td>
                <td className={styles.usersTableCell}>
                  <span className={classNames(styles.roleBadge, getRoleClass(user.role))}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className={styles.usersTableCell}>
                  <span className={classNames(styles.statusBadge, getStatusClass(user.status))}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className={styles.usersTableCell}>
                  <span className={styles.createdDate}>
                    {formatDate(user.createdDate)}
                  </span>
                </td>
                <td className={styles.usersTableCell}>
                  <div className={styles.usersActions}>
                    <button
                      className={classNames(styles.usersActionButton, styles.usersEditButton)}
                      onClick={() => handleEditUser(user)}
                      title="Edit user"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={classNames(styles.usersActionButton, styles.usersResetButton)}
                      onClick={() => handleResetPassword(user.id)}
                      title="Reset password"
                    >
                      <FiKey />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        className={classNames(styles.usersActionButton, styles.usersDeleteButton)}
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        <FiTrash2 />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
        {filteredUsers.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FiUsers size={48} />
            </div>
            <div className={styles.noResultsTitle}>No users found</div>
            <div className={styles.noResultsSubtitle}>
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Get started by adding your first user'}
            </div>
            {!searchTerm && (
              <button
                className={styles.noResultsButton}
                onClick={handleAddUser}
              >
                <FiPlus />
                Add User
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default UsersPage;
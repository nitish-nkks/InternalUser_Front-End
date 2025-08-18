import React, { useState, useMemo } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, 
  FiKey, FiShield, FiSearch, FiBell, FiCamera, FiUpload,
  FiLogIn, FiLogOut, FiPlus, FiTrash2, FiSettings, 
  FiShoppingCart, FiFileText, FiAlertTriangle, FiActivity,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import classNames from 'classnames';
import styles from './ProfilePage.module.css';

import ChangePasswordModal from '../components/ChangePasswordModal';
import { ToastContainer } from '../components/Toast';
import useToast from '../hooks/useToast';
import { useProfile } from '../contexts/ProfileContext';
import { 
  activityLogData,
  formatDate,
  getRelativeTime,
  getActivityTypeIcon,
  getActivityTypeColor
} from '../constants/profileData';

const ProfilePage = () => {
  const { profile, updateProfile, updateProfilePicture } = useProfile();
  const [activityLogs, setActivityLogs] = useState(activityLogData);
  
  
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Filter activity logs based on search
  const filteredActivities = useMemo(() => {
    if (!activitySearchTerm) return activityLogs;
    
    return activityLogs.filter(log =>
      log.activity.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(activitySearchTerm.toLowerCase())
    );
  }, [activityLogs, activitySearchTerm]);

  // Paginate activity logs
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const handleStatusToggle = () => {
    if (!profile) return;
    const newStatus = profile.status === 'active' ? 'inactive' : 'active';
    updateProfile({ status: newStatus });
    showSuccess(`Profile status changed to ${newStatus}`);
  };

  const handleTwoFactorToggle = () => {
    if (!profile) return;
    const newTwoFactorAuth = !profile.settings.twoFactorAuth;
    updateProfile({
      settings: {
        ...profile.settings,
        twoFactorAuth: newTwoFactorAuth
      }
    });
    showSuccess(`Two-factor authentication ${newTwoFactorAuth ? 'enabled' : 'disabled'}`);
  };

  const handleNotificationToggle = (type) => {
    if (!profile) return;
    const currentValue = profile.settings.notifications[type];
    updateProfile({
      settings: {
        ...profile.settings,
        notifications: {
          ...profile.settings.notifications,
          [type]: !currentValue
        }
      }
    });
    showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${!currentValue ? 'enabled' : 'disabled'}`);
  };

  

  const handlePasswordChange = (passwordData) => {
    // Add activity log entry
    const newActivity = {
      id: Math.max(...activityLogs.map(log => log.id)) + 1,
      date: new Date().toISOString(),
      activity: 'Changed password',
      description: 'Successfully updated account password',
      type: 'security'
    };
    setActivityLogs(prev => [newActivity, ...prev]);
    
    showSuccess('Password changed successfully!');
  };

  const handleActivitySearch = (e) => {
    setActivitySearchTerm(e.target.value);
    setCurrentPage(1);
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

  const getActivityIcon = (type) => {
    const iconComponents = {
      login: FiLogIn,
      logout: FiLogOut,
      create: FiPlus,
      update: FiEdit2,
      delete: FiTrash2,
      settings: FiSettings,
      order: FiShoppingCart,
      profile: FiUser,
      report: FiFileText,
      security: FiShield,
      moderation: FiAlertTriangle
    };
    
    const IconComponent = iconComponents[type] || FiActivity;
    return <IconComponent />;
  };

  // Show loading state if profile is not loaded
  if (!profile) {
    return (
      <div className={styles.profilePageContainer}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePageContainer}>
      {/* Top Section - Profile Header */}
      {/* <div className={styles.profileHeader}>
        <div className={styles.profileHeaderLeft}>
          
          <div className={styles.profileBasicInfo}>
            <h1 className={styles.profileName}>{profile.name}</h1>
            <div className={styles.profileDetails}>
              <div className={styles.profileDetailItem}>
                <FiMail className={styles.profileDetailIcon} />
                <span>{profile.email}</span>
              </div>
              
              <div className={styles.profileDetailItem}>
                <div className={styles.statusToggle}>
                  <button
                    className={classNames(styles.toggleButton, {
                      [styles.active]: profile.status === 'active'
                    })}
                    onClick={handleStatusToggle}
                  >
                    <div className={styles.toggleSlider}>
                      <div className={styles.toggleHandle}></div>
                    </div>
                    <span className={styles.toggleLabel}>
                      {profile.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div> */}

      {/* Middle Section - Two Side-by-Side Cards */}
      <div className={styles.profileMiddleSection}>
        {/* Personal Info Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <FiUser className={styles.cardIcon} />
              Personal Information
            </h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiUser className={styles.infoIcon} />
                  Full Name
                </label>
                <span className={styles.infoValue}>{profile.name}</span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiMail className={styles.infoIcon} />
                  Email Address
                </label>
                <span className={styles.infoValue}>{profile.email}</span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiUser className={styles.infoIcon} />
                  Employee ID
                </label>
                <span className={styles.infoValue}>{profile.employee_id}</span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiUser className={styles.infoIcon} />
                  Role
                </label>
                <span className={styles.infoValue}>{profile.role}</span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiUser className={styles.infoIcon} />
                  Designation
                </label>
                <span className={styles.infoValue}>{profile.designation}</span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>
                  <FiLogIn className={styles.infoIcon} />
                  Last Login
                </label>
                <span className={styles.infoValue}>{getRelativeTime(profile.lastloginat)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <FiSettings className={styles.cardIcon} />
              Account Settings
            </h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingsGroup}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>
                    <FiKey className={styles.settingIcon} />
                    Password
                  </label>
                  <span className={styles.settingDescription}>
                    Update your account password
                  </span>
                </div>
                <button
                  className={styles.settingButton}
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </button>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>
                    <FiShield className={styles.settingIcon} />
                    Two-Factor Authentication
                  </label>
                  <span className={styles.settingDescription}>
                    Add extra security to your account
                  </span>
                </div>
                <div className={styles.settingToggle}>
                  <button
                    className={classNames(styles.toggleButton, {
                      [styles.active]: profile.settings.twoFactorAuth
                    })}
                    onClick={handleTwoFactorToggle}
                  >
                    <div className={styles.toggleSlider}>
                      <div className={styles.toggleHandle}></div>
                    </div>
                  </button>
                </div>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>
                    <FiBell className={styles.settingIcon} />
                    Notification Preferences
                  </label>
                  <span className={styles.settingDescription}>
                    Choose how you want to receive notifications
                  </span>
                </div>
                <div className={styles.notificationToggles}>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationLabel}>Email</span>
                    <button
                      className={classNames(styles.toggleButton, styles.small, {
                        [styles.active]: profile.settings.notifications.email
                      })}
                      onClick={() => handleNotificationToggle('email')}
                    >
                      <div className={styles.toggleSlider}>
                        <div className={styles.toggleHandle}></div>
                      </div>
                    </button>
                  </div>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationLabel}>SMS</span>
                    <button
                      className={classNames(styles.toggleButton, styles.small, {
                        [styles.active]: profile.settings.notifications.sms
                      })}
                      onClick={() => handleNotificationToggle('sms')}
                    >
                      <div className={styles.toggleSlider}>
                        <div className={styles.toggleHandle}></div>
                      </div>
                    </button>
                  </div>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationLabel}>Push</span>
                    <button
                      className={classNames(styles.toggleButton, styles.small, {
                        [styles.active]: profile.settings.notifications.push
                      })}
                      onClick={() => handleNotificationToggle('push')}
                    >
                      <div className={styles.toggleSlider}>
                        <div className={styles.toggleHandle}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Activity Log */}
      <div className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={styles.activityTitle}>
            <FiActivity className={styles.activityIcon} />
            Activity Log
          </h2>
          <div className={styles.activitySearchBar}>
            <input
              type="text"
              placeholder="Search activities..."
              value={activitySearchTerm}
              onChange={handleActivitySearch}
            />
            <FiSearch className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.activityTableContainer}>
          <table className={styles.activityTable}>
            <thead className={styles.activityTableHeader}>
              <tr>
                <th>Date & Time</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.map((log) => (
                <tr key={log.id} className={styles.activityTableRow}>
                  <td className={styles.activityTableCell}>
                    <div className={styles.activityDate}>
                      <span className={styles.dateTime}>{formatDate(log.date)}</span>
                      <span className={styles.relativeTime}>{getRelativeTime(log.date)}</span>
                    </div>
                  </td>
                  <td className={styles.activityTableCell}>
                    <div className={styles.activityInfo}>
                      <div 
                        className={styles.activityTypeIcon}
                        style={{ color: getActivityTypeColor(log.type) }}
                      >
                        {getActivityIcon(log.type)}
                      </div>
                      <span className={styles.activityName}>{log.activity}</span>
                    </div>
                  </td>
                  <td className={styles.activityTableCell}>
                    <span className={styles.activityDescription}>{log.description}</span>
                  </td>
                  <td className={styles.activityTableCell}>
                    <span 
                      className={styles.activityType}
                      style={{ color: getActivityTypeColor(log.type) }}
                    >
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
            </div>

            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
                Previous
              </button>

              {renderPaginationButtons()}

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* No Results */}
          {filteredActivities.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <FiActivity size={48} />
              </div>
              <div className={styles.noResultsTitle}>No activities found</div>
              <div className={styles.noResultsSubtitle}>
                {activitySearchTerm ? 'Try adjusting your search terms' : 'No recent activity to display'}
              </div>
            </div>
          )}
        </div>
      </div>

      

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfilePage;
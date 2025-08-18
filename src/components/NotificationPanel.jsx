import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiBell, FiTrash2 } from 'react-icons/fi';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationPanel.module.css';
import { notificationData, markAsRead, clearAllNotifications } from '../constants/notificationData';

const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  darkMode = false 
}) => {
  const [notifications, setNotifications] = useState(notificationData);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

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

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    setNotifications([...notificationData]);
    
    // Close panel
    onClose();
    
    // Navigate to notification page with the notification data
    navigate('/notifications', { state: { selectedNotification: notification } });
  };

  const handleViewAllClick = () => {
    onClose();
    navigate('/notifications');
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      clearAllNotifications();
      setNotifications([]);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critical':
        return styles.priorityCritical;
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  return (
    <>
      <div 
        ref={overlayRef}
        className={classNames(styles.overlay, { [styles.open]: isOpen })}
      />
      
      <div 
        ref={panelRef}
        className={classNames(
          styles.panel, 
          { 
            [styles.open]: isOpen,
            [styles.dark]: darkMode
          }
        )}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>
            <FiBell size={20} />
            Notifications
          </h3>
          <div className={styles.headerActions}>
            {notifications.length > 0 && (
              <button 
                className={styles.clearAllButton}
                onClick={handleClearAll}
                aria-label="Clear all notifications"
                title="Clear all notifications"
              >
                <FiTrash2 size={16} />
              </button>
            )}
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close notifications panel"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <FiBell className={styles.icon} />
              <div className={styles.title}>No notifications</div>
              <div className={styles.description}>
                You're all caught up! Check back later for updates.
              </div>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={classNames(
                    styles.notificationCard,
                    { [styles.unread]: !notification.isRead }
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={classNames(
                    styles.priorityIndicator,
                    getPriorityClass(notification.priority)
                  )} />
                  
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className={styles.unreadBadge} />
                    )}
                  </div>
                  
                  <p className={styles.cardDescription}>
                    {notification.description}
                  </p>
                  
                  <p className={styles.cardTime}>
                    {notification.date}
                  </p>
                </div>
              ))}
              
              <button 
                className={styles.actionButton}
                onClick={handleViewAllClick}
              >
                View All Notifications
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
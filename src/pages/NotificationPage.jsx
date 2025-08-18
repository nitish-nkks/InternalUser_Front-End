import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button, Card, Tag, Empty } from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { notificationData, markAllAsRead, getUnreadCount, clearAllNotifications, getTotalCount } from '../constants/notificationData';
import '../styles/dashboard.css';

const { Content } = Layout;

const NotificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(notificationData);
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  
  const selectedNotification = location.state?.selectedNotification;

  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notifications]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setNotifications([...notificationData]);
    setUnreadCount(0);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const getTypeColor = (type) => {
    const colorMap = {
      order: 'blue',
      inventory: 'orange', 
      payment: 'green',
      customer: 'purple'
    };
    return colorMap[type] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      critical: 'red',
      high: 'orange',
      medium: 'gold',
      low: 'green'
    };
    return colorMap[priority] || 'default';
  };

  const formatType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: 'clamp(8px, 2vw, 24px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            background: 'white',
            padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 24px)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                style={{
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '44px'
                }}
                size="large"
              >
                Back
              </Button>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: 'clamp(18px, 4vw, 24px)', 
                  fontWeight: '600',
                  color: '#262626',
                  lineHeight: '1.2'
                }}>
                  <BellOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  Notifications
                </h1>
                <p style={{ 
                  margin: '4px 0 0 0', 
                  color: '#666',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  marginLeft: 'clamp(0px, 2vw, 32px)'
                }}>
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
              {unreadCount > 0 && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleMarkAllRead}
                  style={{
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '44px'
                  }}
                  size="large"
                >
                  <span style={{ display: window.innerWidth > 480 ? 'inline' : 'none' }}>Mark All Read</span>
                  <span style={{ display: window.innerWidth <= 480 ? 'inline' : 'none' }}>Mark</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearAll}
                  style={{
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '44px'
                  }}
                  size="large"
                >
                  <span style={{ display: window.innerWidth > 480 ? 'inline' : 'none' }}>Clear All</span>
                  <span style={{ display: window.innerWidth <= 480 ? 'inline' : 'none' }}>Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Selected Notification Detail (if coming from panel) */}
          {selectedNotification && (
            <Card
              style={{
                marginBottom: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #1890ff'
              }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>
                    Selected Notification
                  </span>
                  <Tag color={getTypeColor(selectedNotification.type)}>
                    {formatType(selectedNotification.type)}
                  </Tag>
                  <Tag color={getPriorityColor(selectedNotification.priority)}>
                    {formatPriority(selectedNotification.priority)}
                  </Tag>
                </div>
              }
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#262626',
                  marginBottom: '8px'
                }}>
                  {selectedNotification.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ClockCircleOutlined />
                  {selectedNotification.date}
                </p>
              </div>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#262626'
                }}>
                  Description
                </h4>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedNotification.description}
                </p>
              </div>

              <div style={{ 
                background: '#f0f9ff', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e6f7ff'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#262626'
                }}>
                  Details
                </h4>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedNotification.details}
                </p>
              </div>
            </Card>
          )}

          {/* All Notifications List */}
          <Card
            title={
              <span style={{ fontSize: '20px', fontWeight: '600' }}>
                All Notifications ({notifications.length})
              </span>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {notifications.length === 0 ? (
              <Empty 
                description="No notifications found"
                style={{ margin: '40px 0' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.map((notification, index) => (
                  <Card
                    key={notification.id}
                    size="small"
                    style={{
                      background: !notification.isRead 
                        ? 'linear-gradient(90deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%)' 
                        : 'white',
                      border: !notification.isRead ? '1px solid #e6f7ff' : '1px solid #f0f0f0',
                      borderRadius: '8px',
                      borderLeft: !notification.isRead ? '4px solid #1890ff' : '4px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    hoverable
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '6px'
                        }}>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: '#262626',
                            margin: 0
                          }}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              background: '#1890ff',
                              borderRadius: '50%'
                            }} />
                          )}
                        </div>
                        
                        <p style={{ 
                          color: '#666', 
                          margin: '0 0 8px 0',
                          fontSize: '14px'
                        }}>
                          {notification.description}
                        </p>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px'
                        }}>
                          <span style={{ 
                            color: '#8c8c8c', 
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ClockCircleOutlined />
                            {notification.date}
                          </span>
                          <Tag 
                            color={getTypeColor(notification.type)} 
                            style={{ fontSize: '11px' }}
                          >
                            {formatType(notification.type)}
                          </Tag>
                          <Tag 
                            color={getPriorityColor(notification.priority)}
                            style={{ fontSize: '11px' }}
                          >
                            {formatPriority(notification.priority)}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default NotificationPage;
import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  Switch,
  Button,
  Divider,
} from 'antd';
import {
  DashboardOutlined,
  ProductOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PictureOutlined,
  FileTextOutlined,
  ProfileOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  TeamOutlined,
  ShopOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUnreadCount } from '../constants/notificationData';
import AdminLayoutContext from '../contexts/AdminLayoutContext';
import { useProfile } from '../contexts/ProfileContext';
import FilterSidebar from '../components/FilterSidebar';
import NotificationPanel from '../components/NotificationPanel';
import '../styles/dashboard.css';
import '../styles/admin-layout.css';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(getUnreadCount());
  
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, getProfilePictureUrl, hasCustomProfilePicture, clearProfile } = useProfile();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("decodedToken");
      localStorage.removeItem("userDetails");
      navigate('/login');
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: 'products',
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      label: 'Products',
      onClick: () => navigate('/products')
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined style={{ fontSize: '16px' }} />,
      label: 'Categories',
      onClick: () => navigate('/categories')
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined style={{ fontSize: '16px' }} />,
      label: 'Orders',
      onClick: () => navigate('/orders')
    },
    {
      key: 'users',
      icon: <TeamOutlined style={{ fontSize: '16px' }} />,
      label: 'Users',
      onClick: () => navigate('/users')
    },
    {
      key: 'banners',
      icon: <PictureOutlined style={{ fontSize: '16px' }} />,
      label: 'Banners',
      onClick: () => navigate('/banners')
    },
    {
      key: 'blog',
      icon: <FileTextOutlined style={{ fontSize: '16px' }} />,
      label: 'Blog',
      onClick: () => navigate('/blog')
    },
    {
      key: 'notifications',
      icon: <BellOutlined style={{ fontSize: '16px' }} />,
      label: 'Notifications',
      onClick: () => navigate('/notifications')
    },
    {
      key: 'flash-sale',
      icon: <FireOutlined style={{ fontSize: '16px' }} />,
      label: 'Flash Sale',
      onClick: () => navigate('/flash-sale')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />,
      label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
      onClick: handleLogout,
      className: 'logout-menu-item'
    },
  ];

  const profileMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    },
  ];

  // Get current page key based on location
  const getCurrentKey = () => {
    const path = location.pathname.slice(1) || 'dashboard';
    return path === '' ? 'dashboard' : path;
  };

  const handleOpenNotificationPanel = () => {
    setIsNotificationPanelOpen(true);
  };

  const handleCloseNotificationPanel = () => {
    setIsNotificationPanelOpen(false);
    setUnreadNotificationCount(getUnreadCount());
  };

  const handleOpenFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
  };

  const contextValue = {
    openFilterSidebar: handleOpenFilterSidebar,
    closeFilterSidebar: handleCloseFilterSidebar,
    isFilterSidebarOpen,
    darkMode
  };

  return (
    <AdminLayoutContext.Provider value={contextValue}>
    <Layout className="admin-layout">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme={darkMode ? 'dark' : 'light'}
        className="admin-sidebar"
        width={280}
      >
        <div className="sidebar-logo">
          {!collapsed ? 'Feedora Admin' : 'FA'}
        </div>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          selectedKeys={[getCurrentKey()]}
          mode="inline"
          items={menuItems}
          className="sidebar-menu"
        />
      </Sider>
      
      <Layout className="admin-main-layout">
        <Header className="admin-header">
          <Search
            placeholder="Search products, orders, customers..."
            allowClear
            className="header-search"
            prefix={<SearchOutlined />}
            size="large"
          />
          
          <div className="header-actions">
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              onClick={handleOpenNotificationPanel}
              className="notification-btn"
              size="large"
            >
              {unreadNotificationCount > 0 && (
                <div className="notification-dot">
                  {unreadNotificationCount}
                </div>
              )}
            </Button>
            
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={darkMode}
              onChange={setDarkMode}
              className="theme-switch"
            />
            
            <Dropdown
              menu={{ items: profileMenuItems }}
              placement="bottomRight"
            >
              <div className="profile-section">
                <div className="profile-info">
                  <span className="profile-name">
                    {profile?.name || 'Loading...'}
                  </span>
                  <span className="profile-role">
                    {profile?.role || 'Administrator'}
                  </span>
                </div>
                <Avatar 
                  className="profile-avatar"
                  src={hasCustomProfilePicture() ? getProfilePictureUrl() : null}
                  icon={!hasCustomProfilePicture() ? <UserOutlined /> : null}
                  size="default"
                />
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
      
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={handleCloseFilterSidebar}
        onApplyFilters={handleApplyFilters}
        darkMode={darkMode}
      />
      
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={handleCloseNotificationPanel}
        darkMode={darkMode}
      />
    </Layout>
    </AdminLayoutContext.Provider>
  );
}

export default AdminLayout;
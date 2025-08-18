import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Statistic,
  Input,
  Space
} from 'antd';
import {
  RiseOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ShopOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiFilter } from 'react-icons/fi';
import { statsData, salesChartData, ordersOverview, lowStockData, recentOrders } from '../constants/dashboardData';
import { useAdminLayout } from '../contexts/AdminLayoutContext';
import '../styles/dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Search } = Input;

function DashboardPage() {
  const [currentFilters, setCurrentFilters] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredLowStock, setFilteredLowStock] = useState(lowStockData);
  const [filteredOrders, setFilteredOrders] = useState(recentOrders);
  const { openFilterSidebar } = useAdminLayout();

  const getIconComponent = (iconName, gradient) => {
    const iconMap = {
      'DollarOutlined': DollarOutlined,
      'ShoppingCartOutlined': ShoppingCartOutlined,
      'UserOutlined': TeamOutlined,
      'ProductOutlined': ShopOutlined,
      'RiseOutlined': RiseOutlined
    };
    const IconComponent = iconMap[iconName] || ShopOutlined;
    return (
      <div 
        style={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          marginRight: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <IconComponent />
      </div>
    );
  };

  const handleSearch = (value, type) => {
    if (type === 'lowStock') {
      const filtered = lowStockData.filter(item => 
        item.product.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLowStock(filtered);
    } else if (type === 'orders') {
      const filtered = recentOrders.filter(item => 
        item.customer.toLowerCase().includes(value.toLowerCase()) ||
        item.orderId.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const handleViewProduct = (product) => {
    console.log('View product:', product);
    // Add navigation logic here
  };


  const lowStockColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a, b) => a.product.localeCompare(b.product),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock <= 5 ? 'red' : 'orange'}>{stock}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewProduct(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const recentOrdersColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colorMap = {
          pending: 'orange',
          shipped: 'blue',
          delivered: 'green',
          cancelled: 'red',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => {
        const aNum = parseFloat(a.amount.replace(/[₹,]/g, ''));
        const bNum = parseFloat(b.amount.replace(/[₹,]/g, ''));
        return aNum - bNum;
      },
    },
  ];

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    console.log('Applied filters:', filters);
  };

  const handleOpenFilterSidebar = () => {
    openFilterSidebar();
  };

  return (
    <div className="admin-dashboard-main-container">
      {/* Dashboard Header with Filter Button */}
      <div className="admin-dashboard-header-section">
        <div className="admin-dashboard-header-content">
          <h2 className="admin-dashboard-main-title">
            Dashboard Overview
          </h2>
          <p className="admin-dashboard-sub-title">
            Monitor your feed business performance
          </p>
        </div>
        <Button
          type="primary"
          icon={<FiFilter size={16} />}
          onClick={handleOpenFilterSidebar}
          className="admin-dashboard-filter-btn"
        >
          Filter Dashboard
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card 
              className="admin-dashboard-stat-card"
              styles={{ body: { padding: '24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                {getIconComponent(stat.icon, stat.gradient)}
                <div>
                  <div className="admin-dashboard-stat-title">
                    {stat.title}
                  </div>
                  <div className="admin-dashboard-stat-value">
                    {stat.value}
                  </div>
                </div>
              </div>
              <div className="admin-dashboard-stat-change">
                <RiseOutlined style={{ marginRight: '4px' }} />
                {stat.change || '+12%'} from last month
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Sales Overview" className="admin-dashboard-chart-card">
            <Bar
              data={salesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="admin-dashboard-card-title">Orders Overview</span>}
            className="admin-dashboard-orders-overview-card"
          >
            <Row gutter={[8, 8]}>
              {ordersOverview.map((order, index) => (
                <Col span={24} key={index}>
                  <Card 
                    size="small" 
                    className="admin-dashboard-order-overview-item"
                    style={{ 
                      background: `linear-gradient(135deg, ${order.color}15 0%, ${order.color}08 100%)`,
                      border: `1px solid ${order.color}30`,
                      marginBottom: 8,
                    }}
                    styles={{ body: { padding: '12px 16px' } }}
                  >
                    <div className="admin-dashboard-order-overview-content">
                      <div className="admin-dashboard-order-status">
                        <div 
                          className="admin-dashboard-status-indicator"
                          style={{ background: order.color }}
                        />
                        <span className="admin-dashboard-status-text">
                          {order.status}
                        </span>
                      </div>
                      <span 
                        className="admin-dashboard-order-count"
                        style={{ color: order.color }}
                      >
                        {order.count}
                      </span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert Table */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="admin-dashboard-card-title">Low Stock Alert</span>
                  <Tag color="red" style={{ borderRadius: '16px', fontWeight: '500' }}>Critical</Tag>
                </div>
                <Search
                  placeholder="Search products"
                  allowClear
                  className="dashboard-table-search"
                  style={{ width: 200 }}
                  onSearch={(value) => handleSearch(value, 'lowStock')}
                />
              </div>
            }
            className="admin-dashboard-low-stock-card"
          >
            <Table
              columns={lowStockColumns}
              dataSource={filteredLowStock}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className="admin-dashboard-card-title">Recent Orders</span>
                <Search
                  placeholder="Search orders"
                  allowClear
                  className="dashboard-table-search"
                  style={{ width: 200 }}
                  onSearch={(value) => handleSearch(value, 'orders')}
                />
              </div>
            }
            className="admin-dashboard-recent-orders-card"
          >
            <Table
              columns={recentOrdersColumns}
              dataSource={filteredOrders}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}

export default DashboardPage;
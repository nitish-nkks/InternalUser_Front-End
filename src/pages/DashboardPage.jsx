import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Table, Tag, Button, Progress, Input, Space, Tooltip, Skeleton, Select, Avatar, Dropdown, Menu } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  WarningOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  BellOutlined,
  StarOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  AimOutlined,
  LikeOutlined,
  EyeOutlined,
  RetweetOutlined,
  SearchOutlined,
  PercentageOutlined,
  BoxPlotOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import SalesDashboard from '../components/dashboard/SalesDashboard';
import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import CustomerSupportDashboard from '../components/dashboard/CustomerSupportDashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend, ArcElement);

// Enhanced Mock Data
const mockData = {
  marketing: {
    totalSpend: 12500,
    spendChange: '+5%',
    websiteTraffic: '550K',
    trafficChange: '+12%',
    conversionRate: 4.2,
    conversionChange: '+0.5%',
    ctr: 7.8,
    ctrChange: '-0.1%',
    roas: 250,
    roasChange: '+15%',
    cacBounceRate: 32,
    bounceChange: '-3.5%',
    emailCtr: 48.50,
    emailChange: '-2.1%',
    socialEngagement: 18000,
    socialChange: '+4.8%',
    trafficSourceData: {
        labels: ['Organic', 'Paid', 'Social', 'Other'],
        datasets: [{
            data: [45, 35, 15, 5],
            backgroundColor: [
                '#52c41a',
                '#1890ff',
                '#722ed1',
                '#fa8c16'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    monthlyPerformanceData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Website Traffic',
                data: [420, 485, 510, 530, 545, 550],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Conversion Rate (%)',
                data: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2],
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    },
    channelPerformanceData: {
        labels: ['Google Ads', 'Facebook', 'Instagram', 'Email', 'SEO', 'Direct'],
        datasets: [{
            label: 'ROAS (%)',
            data: [320, 280, 245, 180, 425, 195],
            backgroundColor: [
                'rgba(24, 144, 255, 0.8)',
                'rgba(82, 196, 26, 0.8)',
                'rgba(250, 140, 22, 0.8)',
                'rgba(114, 46, 209, 0.8)',
                'rgba(235, 47, 6, 0.8)',
                'rgba(19, 194, 194, 0.8)'
            ],
            borderColor: [
                '#1890ff',
                '#52c41a',
                '#fa8c16',
                '#722ed1',
                '#eb2f06',
                '#13c2c2'
            ],
            borderWidth: 2
        }]
    },
    campaignData: [
        {
            key: '1',
            campaign: 'Summer Sale 2025',
            channel: 'Google Ads',
            spend: '$2,450',
            clicks: '12,450',
            conversions: '425',
            ctr: '8.2%',
            roas: '340%',
            status: 'active'
        },
        {
            key: '2',
            campaign: 'Brand Awareness',
            channel: 'Facebook',
            spend: '$1,850',
            clicks: '8,920',
            conversions: '287',
            ctr: '6.9%',
            roas: '285%',
            status: 'active'
        },
        {
            key: '3',
            campaign: 'Product Launch',
            channel: 'Instagram',
            spend: '$3,200',
            clicks: '15,680',
            conversions: '612',
            ctr: '9.1%',
            roas: '425%',
            status: 'active'
        },
        {
            key: '4',
            campaign: 'Email Newsletter',
            channel: 'Email',
            spend: '$450',
            clicks: '5,240',
            conversions: '189',
            ctr: '12.5%',
            roas: '520%',
            status: 'active'
        },
        {
            key: '5',
            campaign: 'SEO Content',
            channel: 'Organic',
            spend: '$0',
            clicks: '22,100',
            conversions: '845',
            ctr: '4.8%',
            roas: '∞',
            status: 'ongoing'
        }
    ]
  },
  customer: {
    topRowKPIs: [
        {
            title: 'Open Tickets',
            value: '287',
            change: '+5.2%',
            isPositive: false,
            icon: ExclamationCircleOutlined,
            gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
            subtitle: 'Pending resolution'
        },
        {
            title: 'Avg. Response Time',
            value: '2.4h',
            change: '-0.8h',
            isPositive: true,
            icon: ClockCircleOutlined,
            gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            subtitle: 'First response time'
        },
        {
            title: 'CSAT Score',
            value: '4.2/5',
            change: '+0.3',
            isPositive: true,
            icon: StarOutlined,
            gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
            subtitle: 'Customer satisfaction'
        },
        {
            title: 'Resolution Rate',
            value: '85.7%',
            change: '+2.4%',
            isPositive: true,
            icon: CheckCircleOutlined,
            gradient: 'linear-gradient(135deg, #13c2c2 0%, #08979c 100%)',
            subtitle: 'Tickets resolved'
        },
    ],
    channelBreakdownData: {
        labels: ['Email', 'Phone', 'Chat'],
        datasets: [{
            label: 'Tickets',
            data: [580, 400, 325],
            backgroundColor: ['#1890ff', '#52c41a', '#722ed1'],
            borderRadius: 8
        }],
    },
    commonComplaintsData: [
        {
            complaint: 'Product Quality Issues',
            count: 156,
            percentage: '35%',
            trend: '+12%',
            color: '#ff4d4f',
            category: 'Product'
        },
        {
            complaint: 'Delivery Delays',
            count: 134,
            percentage: '30%',
            trend: '+8%',
            color: '#fa8c16',
            category: 'Delivery'
        },
        {
            complaint: 'Billing Problems',
            count: 89,
            percentage: '20%',
            trend: '-5%',
            color: '#fadb14',
            category: 'Billing'
        },
        {
            complaint: 'Refund Requests',
            count: 67,
            percentage: '15%',
            trend: '+3%',
            color: '#52c41a',
            category: 'Refund'
        },
    ],
    detailedSupportKPIs: [
        {
            kpi: 'Ticket Volume',
            definition: 'Total customer queries',
            formula: 'Count of tickets',
            currentValue: '1,245',
            change: '+8.3%',
            tracking: 'Total customer queries',
            isPositive: false
        },
        {
            kpi: 'FRT (First Response Time)',
            definition: 'Avg. time to respond',
            formula: 'Σ(Response Time) ÷ Tickets',
            currentValue: '2.4 hours',
            change: '-0.8h',
            tracking: 'Avg. time to respond',
            isPositive: true
        },
        {
            kpi: 'AHT (Avg. Handling Time)',
            definition: 'Avg. time to resolve query',
            formula: 'Σ(Resolution Time) ÷ Tickets',
            currentValue: '38 minutes',
            change: '-5 min',
            tracking: 'Avg. time to resolve query',
            isPositive: true
        },
        {
            kpi: 'Resolution Rate',
            definition: '% of tickets resolved',
            formula: 'Resolved ÷ Total Tickets × 100',
            currentValue: '85.7%',
            change: '+2.4%',
            tracking: '% of tickets resolved',
            isPositive: true
        },
        {
            kpi: 'CSAT (Customer Satisfaction Score)',
            definition: 'Customer feedback rating',
            formula: 'Σ(Survey Ratings ÷ Total Surveys) × 100',
            currentValue: '4.2/5',
            change: '+0.3',
            tracking: 'Customer feedback rating',
            isPositive: true
        },
        {
            kpi: 'NPS (Net Promoter Score)',
            definition: 'Customer loyalty',
            formula: '%Promoters - %Detractors',
            currentValue: '68',
            change: '+5',
            tracking: 'Customer loyalty',
            isPositive: true
        },
        {
            kpi: 'Repeat Complaints',
            definition: '% customers contacting again',
            formula: '(Repeat Complaints ÷ Total Customers) × 100',
            currentValue: '12.3%',
            change: '-1.8%',
            tracking: '% customers contacting again',
            isPositive: true
        },
        {
            kpi: 'Channel Efficiency',
            definition: 'Resolution speed per channel',
            formula: 'e.g. Email vs Chat FRT',
            currentValue: 'Email: 3.2h',
            change: 'Chat: 1.8h',
            tracking: 'Resolution speed per channel',
            isPositive: true
        },
        {
            kpi: 'Refund-related Issues',
            definition: '% complaints linked to refunds',
            formula: 'Refund Complaints ÷ Total Tickets',
            currentValue: '5.4%',
            change: '-0.6%',
            tracking: '% complaints linked to refunds',
            isPositive: true
        }
    ],
    agentPerformance: [
        { name: 'Agent A', tickets: 320, satisfaction: 4.8, responseTime: '2.1h' },
        { name: 'Agent B', tickets: 280, satisfaction: 4.6, responseTime: '2.3h' },
        { name: 'Agent C', tickets: 210, satisfaction: 4.4, responseTime: '2.8h' },
        { name: 'Agent D', tickets: 180, satisfaction: 4.2, responseTime: '3.1h' },
    ]
  },
  sales: {
    revenue: 125340,
    revenueChange: '+12.5%',
    totalOrders: 2540,
    ordersChange: '+8.2%',
    avgOrderValue: 49.50,
    aovChange: '+3.8%',
    grossMargin: 34.2,
    marginChange: '+1.2%',
    inventoryTurnover: 8.5,
    turnoverChange: '+0.8%',
    stockouts: 12,
    stockoutChange: '-2%',
    shippingSLA: 95.2,
    slaChange: '+2.1%',
    returnsRefunds: 4.8,
    returnChange: '-0.5%',
    dailyOrdersData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Daily Orders',
            data: [350, 380, 450, 520],
            backgroundColor: 'rgba(24, 144, 255, 0.8)',
            borderColor: '#1890ff',
            borderWidth: 2,
            borderRadius: 4
        }]
    },
    orderStatusData: {
        labels: ['Shipped', 'Pending', 'Canceled'],
        datasets: [{
            data: [70, 20, 10],
            backgroundColor: [
                '#52c41a',
                '#fa8c16',
                '#ff4d4f'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    inventoryData: [
        {
            key: '1',
            product: 'Product A',
            inventory: '$25,000',
            sales: '$57,000',
            status: 'in-stock',
            stockLevel: 85
        },
        {
            key: '2',
            product: 'Product B',
            inventory: '$18,500',
            sales: '$12,500',
            status: 'low-stock',
            stockLevel: 25
        },
        {
            key: '3',
            product: 'Product C',
            inventory: '$12,200',
            sales: '$10,500',
            status: 'out-of-stock',
            stockLevel: 0
        }
    ],
    bestSellingData: [
        { key: '1', product: 'Product A', sales: '$57,000', units: 1140 },
        { key: '2', product: 'Product D', sales: '$45,200', units: 904 },
        { key: '3', product: 'Product E', sales: '$38,700', units: 774 },
        { key: '4', product: 'Product F', sales: '$32,100', units: 642 },
        { key: '5', product: 'Product B', sales: '$12,500', units: 250 }
    ]
  },
  admin: {
    gmv: '1.2M',
    gmvChange: '+8.5%',
    netRevenue: '980K',
    revenueChange: '+12.3%',
    profitability: '15%',
    profitabilityTrend: [12, 13, 14, 15, 16, 15],
    cac: '50',
    cacChange: '-5.2%',
    clv: '300K',
    clvChange: '+18.7%',
    clvCacRatio: '6.0x',
    churnRate: '2.5%',
    churnChange: '-0.8%',
    refundRate: '1.0%',
    refundChange: '-0.3%',
    healthIndex: '8.7/10',
    teamPerformanceData: [
      { team: 'Marketing', kpi: 'ROI', score: 87, trend: 5.2 },
      { team: 'Sales', kpi: 'Growth', score: 92, trend: 8.1 },
      { team: 'Customer Service', kpi: 'CSAT', score: 85, trend: 2.3 }
    ],
    riskIndicators: [
      { title: 'Refund Rate', value: '1.0%', threshold: '<2%', status: 'good' },
      { title: 'Stockouts', value: '12%', threshold: '<5%', status: 'danger' },
      { title: 'High CAC Channels', value: '3', threshold: '<5', status: 'warning' }
    ]
  }
};

const DashboardLayout = ({ children, title, onDashboardChange, currentDashboard }) => {

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        background: 'white',
        padding: '20px 24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#262626' }}>{title}</h1>
          <p style={{ margin: '4px 0 0', color: '#8c8c8c', fontSize: '16px' }}>Comprehensive KPI monitoring and performance analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Select
            value={currentDashboard}
            onChange={onDashboardChange}
            style={{ width: 200 }}
            size="large"
          >
            <Select.Option value="admin">Admin Dashboard</Select.Option>
            <Select.Option value="sales">Sales Dashboard</Select.Option>
            <Select.Option value="marketing">Marketing Dashboard</Select.Option>
            <Select.Option value="customer">Customer Support</Select.Option>
          </Select>
          <Button type="primary" icon={<FilterOutlined />} size="large" style={{ borderRadius: '8px' }}>
            Advanced Filters
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

// Main Dashboard System Component
const DashboardSystem = () => {
  const [currentDashboard, setCurrentDashboard] = useState('admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentDashboard]);

  const handleDashboardChange = (dashboard) => {
    setLoading(true);
    setCurrentDashboard(dashboard);
  };

  const getDashboardTitle = (dashboard) => {
    const titles = {
      admin: 'Business Intelligence Dashboard',
      sales: 'Sales Dashboard',
      marketing: 'Marketing Dashboard',
      customer: 'Customer Support Dashboard'
    };
    return titles[dashboard] || 'Dashboard';
  };

  const renderDashboard = () => {
    const data = mockData[currentDashboard] || mockData.admin;

    switch (currentDashboard) {
      case 'admin':
        return <AdminDashboard data={data} loading={loading} />;
      case 'sales':
        return <SalesDashboard data={data} loading={loading} />;
      case 'marketing':
        return <MarketingDashboard data={data} loading={loading} />;
      case 'customer':
        return <CustomerSupportDashboard data={data} loading={loading} />;
      default:
        return <AdminDashboard data={mockData.admin} loading={loading} />;
    }
  };

  return (
    <DashboardLayout
      title={getDashboardTitle(currentDashboard)}
      onDashboardChange={handleDashboardChange}
      currentDashboard={currentDashboard}
    >
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default DashboardSystem;

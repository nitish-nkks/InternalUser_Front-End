import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Table, Tag, Button, Progress, Input, Space, Tooltip, Skeleton } from 'antd';
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
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend);

// --- MOCK DATA (Simulating an API response) ---
const mockApiData = {
  topRowKPIs: [
    { title: 'Total Revenue', value: '₹15,45,890', change: '+12.5%', isPositive: true, icon: DollarOutlined, gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' },
    { title: 'Net Profit', value: '₹4,67,230', change: '+8.3%', isPositive: true, icon: RiseOutlined, gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)' },
    { title: 'CAC vs CLV', value: '1:4.2', change: 'Healthy', isPositive: true, icon: TeamOutlined, gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)', tooltip: 'Customer Lifetime Value (CLV) to Customer Acquisition Cost (CAC) ratio. A higher ratio is better.' },
    { title: 'Active Users', value: '8,947', change: '+15.7%', isPositive: true, icon: TeamOutlined, gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)' },
    { title: 'Total Orders', value: '2,834', change: '+22.1%', isPositive: true, icon: ShoppingCartOutlined, gradient: 'linear-gradient(135deg, #13c2c2 0%, #08979c 100%)' },
  ],
  teamPerformanceData: [
    { metric: 'Marketing ROI', value: '340%', target: '300%', progress: 85, color: '#52c41a', status: 'excellent' },
    { metric: 'Sales Growth', value: '28.5%', target: '25%', progress: 92, color: '#1890ff', status: 'excellent' },
    { metric: 'CSAT Score', value: '4.2/5', target: '4.0/5', progress: 84, color: '#722ed1', status: 'good' },
  ],
  riskIndicators: [
    { metric: 'Refund Rate', value: '2.3%', threshold: '< 5%', status: 'safe', color: '#52c41a' },
    { metric: 'Stockouts', value: '8 items', threshold: '< 10', status: 'warning', color: '#faad14' },
    { metric: 'High CAC Channels', value: '3 channels', threshold: '< 2', status: 'critical', color: '#ff4d4f' },
  ],
  detailedKPIs: [
    { kpi: 'GMV (Gross Merchandise Value)', definition: 'Total value of merchandise sold over a given period of time.', formula: 'Σ(Order Value)', currentValue: '₹18,92,450', change: '+15.0%' },
    { kpi: 'Net Revenue', definition: 'Revenue after deducting returns, allowances, and discounts.', formula: 'Revenue - Discounts - Returns', currentValue: '₹15,45,890', change: '+12.3%' },
    { kpi: 'Profitability', definition: 'The net profit margin as a percentage of revenue.', formula: '(Revenue - Costs) ÷ Revenue', currentValue: '30.2%', change: '+1.5%' },
    { kpi: 'CAC (Customer Acquisition Cost)', definition: 'The cost to acquire a new customer.', formula: 'Marketing Spend ÷ Customers', currentValue: '₹1,250', change: '+5.9%' },
    { kpi: 'CLV (Customer Lifetime Value)', definition: 'Total revenue expected from a single customer account.', formula: 'AOV × Purchase Frequency', currentValue: '₹5,240', change: '+7.2%' },
    { kpi: 'CLV : CAC Ratio', definition: 'The ratio of customer lifetime value to customer acquisition cost.', formula: 'CLV ÷ CAC', currentValue: '4.2:1', change: '+2.4%' },
    { kpi: 'Churn Rate', definition: 'The percentage of customers who stop using your service.', formula: 'Lost Customers ÷ Total Customers', currentValue: '12.5%', change: '-1.7%' },
    { kpi: 'Refund Rate', definition: 'The percentage of orders that are refunded.', formula: 'Refunds ÷ Orders', currentValue: '2.3%', change: '-0.5%' },
  ],
  salesTrendData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Revenue (₹)', data: [1.2, 1.35, 1.18, 1.52, 1.69, 1.45, 1.78, 1.92, 1.65, 1.89, 2.1, 1.85].map(v => v * 1000000), borderColor: '#1890ff', backgroundColor: 'rgba(24, 144, 255, 0.1)', tension: 0.4, fill: true }],
  },
  channelPerformanceData: {
    labels: ['Google Ads', 'Facebook', 'Instagram', 'Direct', 'Referral', 'Email'],
    datasets: [{ label: 'Customer Acquisition Cost (₹)', data: [1850, 1420, 1680, 890, 1200, 950], backgroundColor: ['#ff4d4f', '#faad14', '#52c41a', '#1890ff', '#722ed1', '#13c2c2'], borderRadius: 8 }],
  },
};

// --- Reusable Components ---

const KpiCard = ({ title, value, change, isPositive, icon: Icon, gradient, tooltip }) => {
  const content = (
    <Card
      style={{ borderRadius: '12px', border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '120px' }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px', fontWeight: '500' }}>{title}</p>
          <h2 style={{ margin: '8px 0 4px', fontSize: '24px', fontWeight: 'bold', color: '#262626' }}>{value}</h2>
          <span style={{ color: isPositive ? '#52c41a' : '#ff4d4f', fontSize: '12px', fontWeight: '600' }}>
            {isPositive ? <RiseOutlined /> : <FallOutlined />} {change}
          </span>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Icon style={{ fontSize: '18px' }} />
        </div>
      </div>
    </Card>
  );

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

// --- Main Dashboard Component ---

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDashboardData(mockApiData);
      setLoading(false);
    }, 1500); // 1.5-second delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <TrophyOutlined style={{ color: '#52c41a' }} />;
      case 'good': return <RiseOutlined style={{ color: '#1890ff' }} />;
      default: return null;
    }
  };

  const filteredKpis = useMemo(() => {
    if (!dashboardData) return [];
    if (!searchText) return dashboardData.detailedKPIs;

    const lowercasedFilter = searchText.toLowerCase();
    return dashboardData.detailedKPIs.filter(item =>
      item.kpi.toLowerCase().includes(lowercasedFilter) ||
      item.definition.toLowerCase().includes(lowercasedFilter)
    );
  }, [dashboardData, searchText]);

  const kpiTableColumns = [
    { title: 'KPI', dataIndex: 'kpi', key: 'kpi', width: '25%', render: (text) => <strong>{text}</strong> },
    { title: 'Definition', dataIndex: 'definition', key: 'definition', width: '25%' },
    { title: 'Formula', dataIndex: 'formula', key: 'formula', width: '25%', render: (text) => <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{text}</code> },
    { title: 'Current Value', dataIndex: 'currentValue', key: 'currentValue', width: '15%', render: (value) => <strong style={{ color: '#1890ff' }}>{value}</strong> },
    {
      title: 'Change', dataIndex: 'change', key: 'change', width: '10%',
      render: (change) => {
        const isPositive = typeof change === 'string' && change.startsWith('+');
        const isNegative = typeof change === 'string' && change.startsWith('-');
        const color = isPositive ? '#52c41a' : isNegative ? '#ff4d4f' : '#666';
        const icon = isPositive ? <RiseOutlined /> : isNegative ? <FallOutlined /> : null;
        return <span style={{ color, fontWeight: 'bold' }}>{icon} {change}</span>;
      }
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'white', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#262626' }}>Business Intelligence Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#8c8c8c', fontSize: '16px' }}>Comprehensive KPI monitoring and performance analytics</p>
        </div>
        <Button type="primary" icon={<FilterOutlined />} size="large" style={{ borderRadius: '8px' }}>Advanced Filters</Button>
      </div>

      {/* Top Row KPIs */}
      <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>📈 Key Performance Indicators</span>} style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={4.8} key={index}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))
          ) : (
            dashboardData.topRowKPIs.map((kpi, index) => (
              <Col xs={24} sm={12} md={8} lg={4.8} key={index}>
                <KpiCard {...kpi} icon={kpi.icon} />
              </Col>
            ))
          )}
        </Row>
      </Card>

      {/* Middle Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>🎯 Team Performance Scorecards</span>} style={{ borderRadius: '12px', height: '100%' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
              {dashboardData?.teamPerformanceData.map((item, index) => (
                <div key={index} style={{ marginBottom: index === dashboardData.teamPerformanceData.length - 1 ? 0 : '24px', padding: '20px', background: '#fafafa', borderRadius: '10px', border: '1px solid #e8e8e8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.metric}</h4>
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Target: {item.target}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(item.status)}
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: item.color }}>{item.value}</span>
                    </div>
                  </div>
                  <Progress percent={item.progress} strokeColor={item.color} trailColor="#e8e8e8" strokeWidth={8} style={{ marginBottom: '0' }} />
                </div>
              ))}
            </Skeleton>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>📊 Sales Trend Analysis</span>} style={{ borderRadius: '12px', height: '100%' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
              <div style={{ height: '250px' }}>
                <Line data={dashboardData?.salesTrendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } } }} />
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      {/* Risk Indicators */}
      <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>⚠️ Risk Indicators</span>} style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          {loading ? (
             Array.from({ length: 3 }).map((_, index) => (
              <Col xs={24} sm={8} key={index}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))
          ) : (
            dashboardData.riskIndicators.map((risk, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card style={{ borderRadius: '10px', border: `2px solid ${risk.color}`, background: `${risk.color}08` }} bodyStyle={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{risk.metric}</h4>
                      <p style={{ margin: '4px 0', color: '#8c8c8c', fontSize: '12px' }}>Threshold: {risk.threshold}</p>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: risk.color }}>{risk.value}</span>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: risk.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <WarningOutlined style={{ fontSize: '16px' }} />
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Card>

      {/* Bottom Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>📈 Channel Performance (CAC)</span>} style={{ borderRadius: '12px' }}>
             <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
              <div style={{ height: '300px' }}>
                <Bar data={dashboardData?.channelPerformanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Cost (₹)' } } } }} />
              </div>
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>🎯 Overall Team Health Index</span>} style={{ borderRadius: '12px' }}>
             <Skeleton loading={loading} active avatar={{ shape: 'circle', size: 200 }} paragraph={false}>
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <Progress type="circle" percent={87} size={200} strokeColor={{ '0%': '#52c41a', '100%': '#389e0d' }} strokeWidth={8} format={(percent) => (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a' }}>{percent}</div>
                    <div style={{ fontSize: '16px', color: '#8c8c8c', marginTop: '8px' }}>Health Score</div>
                  </div>
                )} />
                <div style={{ marginTop: '24px' }}>
                  <Tag color="green" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '20px' }}>Excellent Performance</Tag>
                  <p style={{ marginTop: '12px', color: '#8c8c8c' }}>All key metrics are performing above target thresholds</p>
                </div>
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      {/* Detailed KPI Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>📋 Detailed KPI Analysis</span>
            <Input.Search placeholder="Search KPIs..." allowClear style={{ width: 300 }} onSearch={(value) => setSearchText(value)} onChange={(e) => setSearchText(e.target.value)} />
          </div>
        }
        style={{ borderRadius: '12px' }}
      >
        <Table
          loading={loading}
          columns={kpiTableColumns}
          dataSource={filteredKpis}
          pagination={{ pageSize: 8, showSizeChanger: false, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} KPIs` }}
          size="small"
          rowKey="kpi"
        />
      </Card>
    </div>
  );
}

export default DashboardPage;
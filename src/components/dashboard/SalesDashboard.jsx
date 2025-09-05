import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Progress, Input, Space, Tooltip, Select, DatePicker } from 'antd';
import {
    RiseOutlined,
    FallOutlined,
    TrophyOutlined,
    WarningOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    PercentageOutlined,
    UserOutlined,
    BoxPlotOutlined,
    BarChartOutlined,
    SearchOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend, ArcElement);

const { Option } = Select;
const { RangePicker } = DatePicker;

// Enhanced KPI Card with gradient styling
const KpiCard = ({ title, value, change, isPositive, icon: Icon, gradient, tooltip, subtitle }) => {
    const content = (
        <Card
            className="kpi-card"
            bodyStyle={{ padding: '20px' }}
            style={{
                background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 15px 0 rgba(31, 38, 135, 0.37)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: 0.9,
                        marginBottom: '8px'
                    }}>
                        {title}
                    </div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: subtitle ? '4px' : '8px',
                        lineHeight: '1.2'
                    }}>
                        {value}
                    </div>
                    {subtitle && (
                        <div style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            marginBottom: '8px'
                        }}>
                            {subtitle}
                        </div>
                    )}
                    {change && (
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {isPositive ? <RiseOutlined /> : <FallOutlined />}
                            <span style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
                                {change}
                            </span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div style={{
                        fontSize: '32px',
                        opacity: 0.3,
                        marginLeft: '12px'
                    }}>
                        <Icon />
                    </div>
                )}
            </div>
        </Card>
    );

    return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

const SalesDashboard = ({ data, loading }) => {
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('all');

    const inventoryColumns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'inventory',
            sorter: true
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
            sorter: true
        },
        {
            title: 'Stock Level',
            dataIndex: 'stockLevel',
            key: 'stockLevel',
            render: (level) => (
                <div>
                    <Progress
                        percent={level}
                        size="small"
                        status={level === 0 ? 'exception' : level < 30 ? 'active' : 'normal'}
                        showInfo={false}
                    />
                    <span style={{
                        color: level === 0 ? '#ff4d4f' : level < 30 ? '#fa8c16' : '#52c41a',
                        fontSize: '12px',
                        marginLeft: '8px'
                    }}>
                        {level}%
                    </span>
                </div>
            )
        }
    ];

    const bestSellingColumns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
            sorter: true,
            render: (sales) => <span style={{ color: '#52c41a', fontWeight: '500' }}>{sales}</span>
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
            sorter: true,
            render: (units) => units.toLocaleString()
        }
    ];

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#666'
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#333',
                    padding: 20,
                    usePointStyle: true
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#262626' }}>
                    Sales Team Dashboard
                </h1>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                    Orders, Inventory, Pricing, Shipping Performance Overview
                </p>
            </div>

            {/* Filters Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Last 30 Days</div>
                        <RangePicker size="small" style={{ width: '100%' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Channel</div>
                        <Select
                            value={selectedChannel}
                            onChange={setSelectedChannel}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            <Option value="all">All Channels</Option>
                            <Option value="online">Online</Option>
                            <Option value="retail">Retail</Option>
                            <Option value="wholesale">Wholesale</Option>
                        </Select>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Product</div>
                        <Select
                            value={selectedProduct}
                            onChange={setSelectedProduct}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            <Option value="all">All Products</Option>
                            <Option value="product-a">Product A</Option>
                            <Option value="product-b">Product B</Option>
                            <Option value="product-c">Product C</Option>
                        </Select>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Order Status</div>
                        <Select
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="shipped">Shipped</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="canceled">Canceled</Option>
                        </Select>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Region</div>
                        <Select
                            value={selectedRegion}
                            onChange={setSelectedRegion}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            <Option value="all">All Regions</Option>
                            <Option value="north">North</Option>
                            <Option value="south">South</Option>
                            <Option value="east">East</Option>
                            <Option value="west">West</Option>
                        </Select>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>Inventory</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Progress
                                percent={70}
                                size="small"
                                strokeColor="#52c41a"
                                trailColor="#f0f0f0"
                                showInfo={false}
                            />
                            <span style={{ fontSize: '12px', color: '#52c41a' }}>70%</span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#8c8c8c', marginTop: '2px' }}>
                            In Stock 70% | Out of Stock 30%
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* KPI Cards Row 1 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Revenue"
                        value={`$${data.revenue.toLocaleString()}`}
                        change={data.revenueChange}
                        isPositive={true}
                        icon={DollarOutlined}
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        tooltip="Total sales revenue"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Total Orders"
                        value={data.totalOrders.toLocaleString()}
                        change={data.ordersChange}
                        isPositive={true}
                        icon={ShoppingCartOutlined}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        tooltip="Total number of confirmed orders"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Average Order Value"
                        value={`$${data.avgOrderValue}`}
                        change={data.aovChange}
                        isPositive={true}
                        icon={BarChartOutlined}
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                        tooltip="Average order size"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Gross Margin"
                        value={`${data.grossMargin}%`}
                        change={data.marginChange}
                        isPositive={true}
                        icon={PercentageOutlined}
                        gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                        tooltip="Profit after product costs"
                    />
                </Col>
            </Row>

            {/* KPI Cards Row 2 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Inventory Turnover"
                        value={data.inventoryTurnover}
                        change={data.turnoverChange}
                        isPositive={true}
                        icon={BoxPlotOutlined}
                        gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                        tooltip="How fast inventory is sold"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Stockouts"
                        value={`${data.stockouts}%`}
                        change={data.stockoutChange}
                        isPositive={true}
                        icon={WarningOutlined}
                        gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                        tooltip="Percentage of SKUs unavailable"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Shipping SLA"
                        value={`${data.shippingSLA}%`}
                        change={data.slaChange}
                        isPositive={true}
                        icon={ShoppingOutlined}
                        gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
                        tooltip="Orders delivered within promised time"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Returns & Refunds"
                        value={`${data.returnsRefunds}%`}
                        change={data.returnChange}
                        isPositive={true}
                        icon={UserOutlined}
                        gradient="linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
                        tooltip="Value & % of returned orders"
                    />
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Daily Orders" style={{ height: '400px' }}>
                        <div style={{ height: '300px' }}>
                            <Bar data={data.dailyOrdersData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Order Status" style={{ height: '400px' }}>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                            <Doughnut data={data.orderStatusData} options={doughnutOptions} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Tables Row */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Best Selling Products"
                        extra={
                            <Input.Search
                                placeholder="Search products..."
                                style={{ width: 200 }}
                                size="small"
                                prefix={<SearchOutlined />}
                            />
                        }
                    >
                        <Table
                            dataSource={data.bestSellingData}
                            columns={bestSellingColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title="Inventory Status"
                        extra={
                            <Space>
                                <Button type="link" size="small">View All</Button>
                                <Button type="primary" size="small">Add Product</Button>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={data.inventoryData}
                            columns={inventoryColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SalesDashboard;
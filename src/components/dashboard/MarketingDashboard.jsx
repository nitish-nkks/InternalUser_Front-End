import React from 'react';
import { Card, Row, Col, Table, Tag, Button, Input, Space, Tooltip } from 'antd';
import {
    RiseOutlined,
    FallOutlined,
    TrophyOutlined,
    WarningOutlined,
    DollarOutlined,
    AimOutlined,
    MailOutlined,
    LikeOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend, ArcElement);

// Enhanced KPI Card with dark theme styling
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
                height: '160px'
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

const MarketingDashboard = ({ data, loading }) => {

    const campaignColumns = [
        {
            title: 'Campaign Name',
            dataIndex: 'campaign',
            key: 'campaign',
            render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
            render: (channel) => {
                const colorMap = {
                    'Google Ads': '#1890ff',
                    'Facebook': '#52c41a',
                    'Instagram': '#fa8c16',
                    'Email': '#722ed1',
                    'Organic': '#13c2c2'
                };
                return <Tag color={colorMap[channel] || 'default'}>{channel}</Tag>
            }
        },
        {
            title: 'Spend',
            dataIndex: 'spend',
            key: 'spend',
            sorter: true
        },
        {
            title: 'Clicks',
            dataIndex: 'clicks',
            key: 'clicks',
            sorter: true
        },
        {
            title: 'Conversions',
            dataIndex: 'conversions',
            key: 'conversions',
            sorter: true
        },
        {
            title: 'CTR',
            dataIndex: 'ctr',
            key: 'ctr',
            sorter: true,
            render: (ctr) => {
                const value = parseFloat(ctr);
                const color = value >= 8 ? '#52c41a' : value >= 5 ? '#fa8c16' : '#ff4d4f';
                return <span style={{ color, fontWeight: '500' }}>{ctr}</span>;
            }
        },
        {
            title: 'ROAS',
            dataIndex: 'roas',
            key: 'roas',
            sorter: true,
            render: (roas) => {
                if (roas === '∞') return <span style={{ color: '#52c41a', fontWeight: '500' }}>{roas}</span>;
                const value = parseFloat(roas);
                const color = value >= 300 ? '#52c41a' : value >= 200 ? '#fa8c16' : '#ff4d4f';
                return <span style={{ color, fontWeight: '500' }}>{roas}</span>;
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'blue'}>
                    {status.toUpperCase()}
                </Tag>
            )
        }
    ];

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: '#666'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            }
        }
    };

    const barChartOptions = {
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
                    color: '#666',
                    callback: function (value) {
                        return value + '%';
                    }
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
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#262626' }}>
                    Marketing Performance Overview
                </h1>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                    Track your marketing campaigns and performance metrics in real-time
                </p>
            </div>

            {/* KPI Cards Row 1 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Total Spend"
                        value={`$${data.totalSpend.toLocaleString()}`}
                        change={data.spendChange}
                        isPositive={false}
                        icon={DollarOutlined}
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        tooltip="Total marketing spend across all channels"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Website Traffic"
                        value={data.websiteTraffic}
                        change={data.trafficChange}
                        isPositive={true}
                        icon={EyeOutlined}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        tooltip="Total website sessions from all sources"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Conversion Rate"
                        value={`${data.conversionRate}%`}
                        change={data.conversionChange}
                        isPositive={true}
                        icon={TrophyOutlined}
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                        tooltip="Percentage of visitors who complete desired actions"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="CTR (Click-through Rate)"
                        value={`${data.ctr}%`}
                        change={data.ctrChange}
                        isPositive={false}
                        icon={AimOutlined}
                        gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                        tooltip="Percentage of impressions that result in clicks"
                    />
                </Col>
            </Row>

            {/* KPI Cards Row 2 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="ROAS (Return on Ad Spend)"
                        value={`${data.roas}%`}
                        change={data.roasChange}
                        isPositive={true}
                        icon={RiseOutlined}
                        gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                        tooltip="Revenue generated per dollar spent on advertising"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="CAC Bounce Rate"
                        value={`${data.cacBounceRate}%`}
                        change={data.bounceChange}
                        isPositive={true}
                        icon={WarningOutlined}
                        gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                        tooltip="Percentage of visitors who leave after viewing only one page"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Email Campaign CTR"
                        value={data.emailCtr}
                        change={data.emailChange}
                        isPositive={false}
                        icon={MailOutlined}
                        gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
                        tooltip="Click-through rate for email marketing campaigns"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KpiCard
                        title="Social Engagement"
                        value={data.socialEngagement > 1000 ? `${(data.socialEngagement / 1000).toFixed(1)}K` : data.socialEngagement}
                        change={data.socialChange}
                        isPositive={true}
                        icon={LikeOutlined}
                        
                        gradient="linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
                        tooltip="Total social media engagement across all platforms"
                    />
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={8}>
                    <Card title="Traffic by Source" style={{ height: '400px' }}>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                            <Doughnut data={data.trafficSourceData} options={doughnutOptions} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    <Card title="Monthly Performance Trends">
                        <div style={{ height: '300px' }}>
                            <Line data={data.monthlyPerformanceData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Channel Performance Chart */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card title="Channel Performance (ROAS %)">
                        <div style={{ height: '300px' }}>
                            <Bar data={data.channelPerformanceData} options={barChartOptions} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Campaign Performance Table */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title="Campaign Performance"
                        extra={
                            <Space>
                                <Input.Search
                                    placeholder="Search campaigns..."
                                    style={{ width: 200 }}
                                    prefix={<SearchOutlined />}
                                />
                                <Button type="primary">Add Campaign</Button>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={data.campaignData}
                            columns={campaignColumns}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} campaigns`
                            }}
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MarketingDashboard;

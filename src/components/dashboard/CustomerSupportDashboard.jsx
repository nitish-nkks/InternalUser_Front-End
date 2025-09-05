import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Tag, Button, Progress, Input, Space, Tooltip, Skeleton, Select, Dropdown, Menu } from 'antd';
import {
    CustomerServiceOutlined,
    ClockCircleOutlined,
    UserOutlined,
    RiseOutlined,
    FallOutlined,
    TrophyOutlined,
    WarningOutlined,
    PhoneOutlined,
    MailOutlined,
    MessageOutlined,
    FilterOutlined,
    StarOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    PlusOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend, ArcElement);

// Enhanced KPI Card with dark theme styling
const KpiCard = ({ title, value, change, isPositive, icon: Icon, gradient, tooltip, subtitle }) => {
    const content = (
        <Card
            style={{
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(145deg, #2c3e50, #34495e)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '160px',
                position: 'relative',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '24px', position: 'relative', zIndex: 2 }}
        >
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: gradient,
                borderRadius: '50%',
                opacity: 0.1,
                transform: 'translate(30px, -30px)',
                zIndex: 1
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ margin: 0, color: '#bdc3c7', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {title}
                    </p>
                    {subtitle && (
                        <p style={{ margin: '2px 0 0', color: '#95a5a6', fontSize: '11px' }}>
                            {subtitle}
                        </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '12px' }}>
                        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>
                            {value}
                        </h2>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            <Icon style={{ fontSize: '18px' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        color: isPositive ? '#2ecc71' : '#e74c3c',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {isPositive ? <RiseOutlined /> : <FallOutlined />}
                        {change}
                    </span>
                    {/* Trend line simulation */}
                    <div style={{
                        width: '60px',
                        height: '20px',
                        background: `linear-gradient(90deg, transparent 0%, ${isPositive ? '#2ecc71' : '#e74c3c'}40 100%)`,
                        borderRadius: '10px',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: '4px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '4px',
                            background: isPositive ? '#2ecc71' : '#e74c3c',
                            borderRadius: '50%'
                        }} />
                    </div>
                </div>
            </div>
        </Card>
    );

    return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

const CustomerSupportDashboard = ({ data, loading }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState('all');

    const filteredKpis = useMemo(() => {
        if (!data || !data.detailedSupportKPIs) return [];
        if (!searchText) return data.detailedSupportKPIs;

        const lowercasedFilter = searchText.toLowerCase();
        return data.detailedSupportKPIs.filter(item =>
            item.kpi.toLowerCase().includes(lowercasedFilter) ||
            item.definition.toLowerCase().includes(lowercasedFilter)
        );
    }, [data, searchText]);

    const complaintColumns = [
        {
            title: 'Complaint Type',
            dataIndex: 'complaint',
            key: 'complaint',
            render: (complaint, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: record.color
                    }} />
                    <div>
                        <strong>{complaint}</strong>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            Category: {record.category}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            render: (count) => <strong style={{ color: '#1890ff', fontSize: '16px' }}>{count}</strong>
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (percentage) => <Tag color="blue">{percentage}</Tag>
        },
        {
            title: 'Trend',
            dataIndex: 'trend',
            key: 'trend',
            render: (trend) => {
                const isIncrease = trend.includes('+');
                // For complaints, increase is bad (red), decrease is good (green)
                const color = isIncrease ? '#ff4d4f' : '#52c41a';
                const icon = isIncrease ? <RiseOutlined /> : <FallOutlined />;
                return (
                    <span style={{ color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {icon} {trend}
                    </span>
                );
            }
        }
    ];

    const agentColumns = [
        {
            title: 'Agent',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <strong>{name}</strong>
                </div>
            )
        },
        {
            title: 'Tickets Handled',
            dataIndex: 'tickets',
            key: 'tickets',
            render: (tickets) => <strong style={{ color: '#1890ff' }}>{tickets}</strong>
        },
        {
            title: 'CSAT Score',
            dataIndex: 'satisfaction',
            key: 'satisfaction',
            render: (satisfaction) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StarOutlined style={{ color: '#fadb14' }} />
                    <span>{satisfaction}</span>
                </div>
            )
        },
        {
            title: 'Avg Response Time',
            dataIndex: 'responseTime',
            key: 'responseTime'
        }
    ];

    const kpiTableColumns = [
        {
            title: 'KPI',
            dataIndex: 'kpi',
            key: 'kpi',
            width: '20%',
            render: (text) => <strong style={{ color: '#262626' }}>{text}</strong>
        },
        {
            title: 'Definition & Tracking',
            dataIndex: 'definition',
            key: 'definition',
            width: '25%',
            render: (text, record) => (
                <div>
                    <div style={{ marginBottom: '4px' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
                        Tracking: {record.tracking}
                    </div>
                </div>
            )
        },
        {
            title: 'Formula',
            dataIndex: 'formula',
            key: 'formula',
            width: '25%',
            render: (text) => (
                <code style={{
                    background: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    wordBreak: 'break-word'
                }}>
                    {text}
                </code>
            )
        },
        {
            title: 'Current Value',
            dataIndex: 'currentValue',
            key: 'currentValue',
            width: '15%',
            render: (value) => (
                <strong style={{ color: '#1890ff', fontSize: '16px' }}>{value}</strong>
            )
        },
        {
            title: 'Change',
            dataIndex: 'change',
            key: 'change',
            width: '15%',
            render: (change, record) => {
                const isPositive = record.isPositive;
                const color = isPositive ? '#52c41a' : '#ff4d4f';
                const icon = isPositive ? <RiseOutlined /> : <FallOutlined />;
                return (
                    <span style={{ color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {icon} {change}
                    </span>
                );
            }
        }
    ];

    const filterMenu = (
        <Menu>
            <Menu.SubMenu key="channel" title="Channel" icon={<MessageOutlined />}>
                <Menu.Item key="all-channels" onClick={() => setSelectedChannel('all')}>All Channels</Menu.Item>
                <Menu.Item key="email" onClick={() => setSelectedChannel('email')}>
                    <MailOutlined /> Email
                </Menu.Item>
                <Menu.Item key="phone" onClick={() => setSelectedChannel('phone')}>
                    <PhoneOutlined /> Phone
                </Menu.Item>
                <Menu.Item key="chat" onClick={() => setSelectedChannel('chat')}>
                    <MessageOutlined /> Chat
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="priority" title="Priority" icon={<ExclamationCircleOutlined />}>
                <Menu.Item key="all-priority" onClick={() => setSelectedPriority('all')}>All Priority</Menu.Item>
                <Menu.Item key="high" onClick={() => setSelectedPriority('high')}>High</Menu.Item>
                <Menu.Item key="medium" onClick={() => setSelectedPriority('medium')}>Medium</Menu.Item>
                <Menu.Item key="low" onClick={() => setSelectedPriority('low')}>Low</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="status" title="Status" icon={<SyncOutlined />}>
                <Menu.Item key="all-status" onClick={() => setSelectedStatus('all')}>All Status</Menu.Item>
                <Menu.Item key="open" onClick={() => setSelectedStatus('open')}>Open</Menu.Item>
                <Menu.Item key="pending" onClick={() => setSelectedStatus('pending')}>Pending</Menu.Item>
                <Menu.Item key="resolved" onClick={() => setSelectedStatus('resolved')}>Resolved</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="agent" title="Agent" icon={<TeamOutlined />}>
                <Menu.Item key="all-agents" onClick={() => setSelectedAgent('all')}>All Agents</Menu.Item>
                {data?.agentPerformance?.map((agent, index) => (
                    <Menu.Item key={agent.name} onClick={() => setSelectedAgent(agent.name)}>
                        {agent.name}
                    </Menu.Item>
                ))}
            </Menu.SubMenu>
        </Menu>
    );

    return (
        <>
            {/* Filter Section */}
            <Card
                style={{ marginBottom: '24px', borderRadius: '12px' }}
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Select
                            defaultValue="Last 30 Days"
                            style={{ width: 200, marginRight: '16px' }}
                            size="large"
                        >
                            <Select.Option value="week">Last 7 Days</Select.Option>
                            <Select.Option value="month">Last 30 Days</Select.Option>
                            <Select.Option value="quarter">Last 3 Months</Select.Option>
                        </Select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Dropdown overlay={filterMenu} trigger={['click']}>
                            <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: '8px' }}>
                                Filter By
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </Card>

            {/* Top Row KPIs: Open Tickets, Avg. Response Time, CSAT Score, Resolution Rate */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Customer Support Overview</span>}
                style={{ marginBottom: '24px', borderRadius: '12px' }}
            >
                <Row gutter={[16, 16]}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Col>
                        ))
                    ) : (
                        data.topRowKPIs.map((kpi, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <KpiCard {...kpi} />
                            </Col>
                        ))
                    )}
                </Row>
            </Card>

            {/* Middle Row: Channel-wise breakdown (Phone, Email, Chat) */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Channel-wise Breakdown</span>}
                style={{ marginBottom: '24px', borderRadius: '12px' }}
            >
                <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '80%', height: '100%' }}>
                            <Bar
                                data={data?.channelBreakdownData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        title: {
                                            display: true,
                                            text: 'Tickets by Support Channel'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: { display: true, text: 'Number of Tickets' }
                                        },
                                        x: {
                                            title: { display: true, text: 'Support Channels' }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </Skeleton>
            </Card>

            {/* Agent Performance Section */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Agent Performance</span>}
                style={{ marginBottom: '24px', borderRadius: '12px' }}
            >
                <Table
                    loading={loading}
                    columns={agentColumns}
                    dataSource={data?.agentPerformance}
                    pagination={false}
                    size="middle"
                    rowKey="name"
                />
            </Card>

            {/* Bottom Row: Common complaints (product, delivery, refund, etc.) */}
            <Card
                title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Common Complaints Analysis</span>}
                style={{ marginBottom: '24px', borderRadius: '12px' }}
                extra={
                    <Tag color="orange" style={{ padding: '4px 12px' }}>
                        Product, Delivery, Refund, etc.
                    </Tag>
                }
            >
                <Table
                    loading={loading}
                    columns={complaintColumns}
                    dataSource={data?.commonComplaintsData}
                    pagination={false}
                    size="middle"
                    rowKey="complaint"
                />
            </Card>

            {/* Detailed KPI Analysis Table */}
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Detailed Support KPI Analysis</span>
                        <Input.Search
                            placeholder="Search Support KPIs..."
                            allowClear
                            style={{ width: 300 }}
                            onSearch={(value) => setSearchText(value)}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                }
                style={{ borderRadius: '12px' }}
            >
                <Table
                    loading={loading}
                    columns={kpiTableColumns}
                    dataSource={filteredKpis}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Support KPIs`
                    }}
                    size="middle"
                    rowKey="kpi"
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </>
    );
};

export default CustomerSupportDashboard;
import React from 'react';
import { Card, Row, Col, Table, Tag, Button, Progress, Input, Space, Tooltip, Skeleton, Statistic } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  WarningOutlined,
  DollarOutlined,
  UserOutlined,
  LineChartOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ChartTooltip, Legend, ArcElement);

// Enhanced KPI Card with dark theme styling matching your design
const KpiCard = ({ title, value, change, isPositive, icon: Icon, hasChart, chartData, chartType, subtitle, healthScore }) => {
  const renderChart = () => {
    if (chartType === 'line' && chartData) {
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: chartData,
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82, 196, 26, 0.1)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        elements: { point: { radius: 0 } }
      };

      return (
        <div style={{ height: '40px', width: '60px', marginLeft: '12px' }}>
          <Line data={data} options={options} />
        </div>
      );
    }

    if (chartType === 'gauge' && value) {
      return (
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(#52c41a 0deg ${(parseFloat(value) / 10) * 360}deg, rgba(255,255,255,0.2) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#2f3349',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {value}
          </div>
        </div>
      );
    }

    return null;
  };

  const getChangeColor = () => {
    if (change && change.includes('%')) {
      return isPositive ? '#52c41a' : '#ff4d4f';
    }
    return '#fff';
  };

  return (
    <Card
      className="kpi-card"
      bodyStyle={{ padding: '20px' }}
      style={{
        background: 'linear-gradient(135deg, #2f3349 0%, #1e2139 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
        color: '#fff',
        minHeight: '120px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            lineHeight: '1.2',
            color: '#fff'
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '4px'
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
              gap: '4px',
              color: getChangeColor()
            }}>
              {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {change}
            </div>
          )}
          {healthScore && (
            <div style={{
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#52c41a'
            }}>
              <CheckCircleOutlined />
              Excellent
            </div>
          )}
        </div>

        {/* Chart or Icon Section */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {hasChart && renderChart()}
          {Icon && !hasChart && (
            <div style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.3)',
              marginLeft: '12px'
            }}>
              <Icon />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Risk Indicator Component
const RiskIndicator = ({ title, value, threshold, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#52c41a';
      case 'warning': return '#fa8c16';
      case 'danger': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <CheckCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'danger': return <WarningOutlined />;
      default: return <TrophyOutlined />;
    }
  };

  return (
    <Card
      size="small"
      style={{
        background: '#f8f9fa',
        border: `2px solid ${getStatusColor()}`,
        borderRadius: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: getStatusColor() }}>
            {value}
          </div>
          <div style={{ fontSize: '10px', color: '#8c8c8c' }}>
            Threshold: {threshold}
          </div>
        </div>
        <div style={{ fontSize: '20px', color: getStatusColor() }}>
          {getStatusIcon()}
        </div>
      </div>
    </Card>
  );
};

// Team Performance Scorecard Component
const TeamScorecard = ({ team, kpi, score, trend }) => (
  <Card size="small" style={{ marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: '500', marginBottom: '2px' }}>{team}</div>
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{kpi}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: score >= 80 ? '#52c41a' : score >= 60 ? '#fa8c16' : '#ff4d4f' }}>
          {score}%
        </div>
        <div style={{ fontSize: '12px', color: trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend)}%
        </div>
      </div>
    </div>
  </Card>
);

const AdminDashboard = ({ data, loading }) => {

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#262626' }}>
          KPI Dashboard
        </h1>
        <p style={{ color: '#8c8c8c', margin: 0, fontSize: '16px' }}>
          Executive overview of key performance indicators and business metrics
        </p>
      </div>

      {/* Main KPI Cards - Top Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="GMV (Gross Merchandise Value)"
            value={`$${data.gmv}`}
            change={data.gmvChange}
            isPositive={true}
            icon={DollarOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="Net Revenue"
            value={`$${data.netRevenue}`}
            change={data.revenueChange}
            isPositive={true}
            icon={TrophyOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="Profitability"
            value={data.profitability}
            hasChart={true}
            chartType="line"
            chartData={data.profitabilityTrend}
            icon={LineChartOutlined}
          />
        </Col>
      </Row>

      {/* Second Row KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="CAC (Customer Acquisition Cost)"
            value={`$${data.cac}`}
            change={data.cacChange}
            isPositive={true}
            icon={UserOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="CLV (Customer Lifetime Value)"
            value={`$${data.clv}`}
            change={data.clvChange}
            isPositive={true}
            icon={RiseOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="CLV : CAC Ratio"
            value={data.clvCacRatio}
            hasChart={true}
            chartType="gauge"
            icon={DashboardOutlined}
          />
        </Col>
      </Row>

      {/* Third Row KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="Churn Rate"
            value={data.churnRate}
            change={data.churnChange}
            isPositive={true}
            icon={PercentageOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="Refund Rate"
            value={data.refundRate}
            change={data.refundChange}
            isPositive={true}
            icon={FallOutlined}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <KpiCard
            title="Overall Team Health Index"
            value={data.healthIndex}
            healthScore={true}
            icon={CheckCircleOutlined}
          />
        </Col>
      </Row>

      {/* Team Performance Scorecards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title="Team Performance Scorecards" style={{ height: '300px' }}>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {data.teamPerformanceData.map((team, index) => (
                <TeamScorecard
                  key={index}
                  team={team.team}
                  kpi={team.kpi}
                  score={team.score}
                  trend={team.trend}
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Risk Indicators */}
        <Col xs={24} lg={16}>
          <Card title="Risk Indicators" style={{ height: '300px' }}>
            <Row gutter={[16, 16]}>
              {data.riskIndicators.map((indicator, index) => (
                <Col key={index} xs={24} sm={8}>
                  <RiskIndicator
                    title={indicator.title}
                    value={indicator.value}
                    threshold={indicator.threshold}
                    status={indicator.status}
                  />
                </Col>
              ))}
            </Row>

            {/* Additional Risk Metrics */}
            <div style={{ marginTop: '20px' }}>
              <h4>Key Risk Metrics</h4>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Customer Complaints"
                    value={23}
                    precision={0}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<WarningOutlined />}
                    suffix="this month"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="System Uptime"
                    value={99.9}
                    precision={1}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                    suffix="%"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Security Incidents"
                    value={0}
                    precision={0}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                    suffix="this quarter"
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;

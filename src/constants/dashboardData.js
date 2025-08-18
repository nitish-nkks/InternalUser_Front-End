export const statsData = [
  {
    title: 'Total Sales',
    value: '₹3,85,920',
    icon: 'DollarOutlined',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    change: '+24.8%',
    changeColor: '#52c41a'
  },
  {
    title: 'Total Orders',
    value: '2,157',
    icon: 'ShoppingCartOutlined',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    change: '+18.3%',
    changeColor: '#1890ff'
  },
  {
    title: 'Total Customers',
    value: '1,247',
    icon: 'UserOutlined',
    color: '#722ed1',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    change: '+15.2%',
    changeColor: '#722ed1'
  },
  {
    title: 'Active Products',
    value: '189',
    icon: 'ProductOutlined',
    color: '#fa8c16',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    change: '+21.2%',
    changeColor: '#fa8c16'
  }
];

export const salesChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Sales (₹)',
      data: [12000, 15000, 18000, 22000, 19000, 25000, 28000, 32000, 29000, 35000, 38000, 42000],
      backgroundColor: 'rgba(24, 144, 255, 0.6)',
      borderColor: '#1890ff',
      borderWidth: 2,
    }
  ]
};

export const ordersOverview = [
  { status: 'Pending', count: 45, color: '#faad14' },
  { status: 'Shipped', count: 123, color: '#1890ff' },
  { status: 'Delivered', count: 234, color: '#52c41a' },
  { status: 'Cancelled', count: 12, color: '#ff4d4f' }
];

export const lowStockData = [
  { key: '1', product: 'Cattle Mineral Mix Supplement', stock: 4 },
  { key: '2', product: 'Duck Breeder Pellets', stock: 6 },
  { key: '3', product: 'Rabbit Growth Formula', stock: 2 },
  { key: '4', product: 'Goat Protein Concentrate', stock: 8 },
  { key: '5', product: 'Pig Starter Crumbles', stock: 3 }
];

export const recentOrders = [
  {
    key: '1',
    orderId: 'ORD-157',
    date: '2025-01-12',
    customer: 'Amit Singh',
    amount: '₹7,890',
    status: 'delivered'
  },
  {
    key: '2',
    orderId: 'ORD-158',
    date: '2025-01-12',
    customer: 'Meera Gupta',
    amount: '₹12,350',
    status: 'shipped'
  },
  {
    key: '3',
    orderId: 'ORD-159',
    date: '2025-01-11',
    customer: 'Ravi Patel',
    amount: '₹5,600',
    status: 'pending'
  },
  {
    key: '4',
    orderId: 'ORD-160',
    date: '2025-01-11',
    customer: 'Kavita Joshi',
    amount: '₹9,240',
    status: 'delivered'
  },
  {
    key: '5',
    orderId: 'ORD-161',
    date: '2025-01-10',
    customer: 'Deepak Sharma',
    amount: '₹4,150',
    status: 'shipped'
  }
];
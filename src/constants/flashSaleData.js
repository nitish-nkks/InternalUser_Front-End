// Flash Sale Status Options
export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'expired', label: 'Expired' }
];

// Sample Product Data for Multi-Select
export const availableProducts = [
  { id: 1, name: 'Premium Poultry Feed 25kg', category: 'poultry', price: 850.00 },
  { id: 2, name: 'Fish Feed Pellets 10kg', category: 'fish', price: 250.00 },
  { id: 3, name: 'Shrimp Feed Special 20kg', category: 'shrimp', price: 1200.00 },
  { id: 4, name: 'Organic Poultry Starter 15kg', category: 'poultry', price: 650.00 },
  { id: 5, name: 'Premium Fish Food 5kg', category: 'fish', price: 180.00 },
  { id: 6, name: 'Advanced Shrimp Nutrition 10kg', category: 'shrimp', price: 800.00 },
  { id: 7, name: 'Poultry Growth Formula 30kg', category: 'poultry', price: 950.00 },
  { id: 8, name: 'Marine Fish Feed 8kg', category: 'fish', price: 320.00 },
  { id: 9, name: 'Shrimp Breeding Feed 12kg', category: 'shrimp', price: 1100.00 },
  { id: 10, name: 'Layer Feed Premium 20kg', category: 'poultry', price: 750.00 }
];

// Sample Flash Sale Data
export const flashSaleData = [
  {
    id: 1,
    saleName: 'Summer Feed Festival',
    products: [1, 2, 3], // Product IDs
    discountPercentage: 25,
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-01-25T23:59:59Z',
    status: 'active',
    createdDate: '2024-01-15T10:30:00Z',
    totalSales: 45,
    revenue: 125000
  },
  {
    id: 2,
    saleName: 'Poultry Power Sale',
    products: [1, 4, 7, 10], // Product IDs
    discountPercentage: 15,
    startDate: '2024-01-22T06:00:00Z',
    endDate: '2024-01-28T18:00:00Z',
    status: 'scheduled',
    createdDate: '2024-01-14T14:15:00Z',
    totalSales: 0,
    revenue: 0
  },
  {
    id: 3,
    saleName: 'Aquatic Feed Bonanza',
    products: [2, 5, 8], // Product IDs
    discountPercentage: 30,
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-01-15T23:59:59Z',
    status: 'expired',
    createdDate: '2024-01-08T09:45:00Z',
    totalSales: 67,
    revenue: 89500
  },
  {
    id: 4,
    saleName: 'Shrimp Special Weekend',
    products: [3, 6, 9], // Product IDs
    discountPercentage: 20,
    startDate: '2024-01-18T00:00:00Z',
    endDate: '2024-01-21T23:59:59Z',
    status: 'active',
    createdDate: '2024-01-12T16:20:00Z',
    totalSales: 23,
    revenue: 67800
  },
  {
    id: 5,
    saleName: 'New Year Feed Sale',
    products: [1, 2, 3, 4, 5], // Product IDs
    discountPercentage: 35,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-07T23:59:59Z',
    status: 'expired',
    createdDate: '2023-12-28T11:30:00Z',
    totalSales: 156,
    revenue: 234500
  },
  {
    id: 6,
    saleName: 'Mega Feed Discount',
    products: [6, 7, 8, 9, 10], // Product IDs
    discountPercentage: 40,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-05T23:59:59Z',
    status: 'scheduled',
    createdDate: '2024-01-11T13:25:00Z',
    totalSales: 0,
    revenue: 0
  },
  {
    id: 7,
    saleName: 'Flash Friday Sale',
    products: [1, 5, 9], // Product IDs
    discountPercentage: 50,
    startDate: '2024-01-19T00:00:00Z',
    endDate: '2024-01-19T23:59:59Z',
    status: 'expired',
    createdDate: '2024-01-18T12:10:00Z',
    totalSales: 89,
    revenue: 78900
  },
  {
    id: 8,
    saleName: 'Premium Feed Showcase',
    products: [3, 7, 10], // Product IDs
    discountPercentage: 12,
    startDate: '2024-01-25T12:00:00Z',
    endDate: '2024-01-30T12:00:00Z',
    status: 'inactive',
    createdDate: '2024-01-20T15:45:00Z',
    totalSales: 0,
    revenue: 0
  }
];

// Utility Functions
export const getStatusLabel = (status) => {
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#52c41a',
    inactive: '#ff4d4f',
    scheduled: '#1890ff',
    expired: '#8c8c8c'
  };
  return colors[status] || '#666';
};

export const getProductsByIds = (productIds) => {
  if (!productIds) return [];
  return availableProducts.filter(product => productIds.includes(product.id));
};

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  return originalPrice * (1 - discountPercentage / 100);
};

export const getSaleStatus = (startDate, endDate, currentStatus) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (currentStatus === 'inactive') return 'inactive';
  
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
};



export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
};

export const getRemainingTime = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};
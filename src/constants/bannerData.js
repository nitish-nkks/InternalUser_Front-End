// Banner Status Options
export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Banner Position Options
export const positionOptions = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'footer', label: 'Footer' },
  { value: 'popup', label: 'Popup' }
];

// Sample Banner Data
export const bannerData = [
  {
    id: 1,
    title: 'Summer Feed Sale - 50% Off',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=300&fit=crop',
    url: '/products?category=poultry&sale=true',
    status: 'active',
    position: 'hero',
    createdDate: '2024-01-15T10:30:00Z',
    clicks: 1245,
    impressions: 5678,
    description: 'Limited time offer on premium poultry feed'
  },
  {
    id: 2,
    title: 'New Fish Feed Collection',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=300&fit=crop',
    url: '/products?category=fish',
    status: 'active',
    position: 'sidebar',
    createdDate: '2024-01-14T14:15:00Z',
    clicks: 892,
    impressions: 3421,
    description: 'Discover our latest fish feed products'
  },
  {
    id: 3,
    title: 'Premium Shrimp Feed',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop',
    url: '/products?category=shrimp',
    status: 'active',
    position: 'hero',
    createdDate: '2024-01-13T09:45:00Z',
    clicks: 567,
    impressions: 2134,
    description: 'High-quality nutrition for your shrimp farming'
  },
  {
    id: 4,
    title: 'Bulk Order Discounts',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=300&fit=crop',
    url: '/bulk-orders',
    status: 'inactive',
    position: 'footer',
    createdDate: '2024-01-12T16:20:00Z',
    clicks: 234,
    impressions: 1567,
    description: 'Save more with bulk purchasing options'
  },
  {
    id: 5,
    title: 'Expert Consultation Available',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&h=300&fit=crop',
    url: '/consultation',
    status: 'active',
    position: 'popup',
    createdDate: '2024-01-11T11:30:00Z',
    clicks: 789,
    impressions: 4567,
    description: 'Get professional advice for your feed requirements'
  },
  {
    id: 6,
    title: 'Free Delivery on Orders Above ₹2000',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=300&fit=crop',
    url: '/shipping-info',
    status: 'active',
    position: 'hero',
    createdDate: '2024-01-10T13:25:00Z',
    clicks: 1123,
    impressions: 6789,
    description: 'Enjoy free shipping on eligible orders'
  },
  {
    id: 7,
    title: 'Join Our Newsletter',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=300&fit=crop',
    url: '/newsletter',
    status: 'inactive',
    position: 'sidebar',
    createdDate: '2024-01-09T12:10:00Z',
    clicks: 345,
    impressions: 1890,
    description: 'Stay updated with latest feed industry news'
  },
  {
    id: 8,
    title: 'Quality Certified Products',
    image: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=800&h=300&fit=crop',
    url: '/quality-assurance',
    status: 'active',
    position: 'footer',
    createdDate: '2024-01-08T15:45:00Z',
    clicks: 678,
    impressions: 3456,
    description: 'All our products meet international quality standards'
  }
];

// Utility Functions
export const getStatusLabel = (status) => {
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
};

export const getPositionLabel = (position) => {
  const positionOption = positionOptions.find(option => option.value === position);
  return positionOption ? positionOption.label : position;
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

export const getStatusColor = (status) => {
  const colors = {
    active: '#52c41a',
    inactive: '#ff4d4f'
  };
  return colors[status] || '#666';
};

export const getPositionColor = (position) => {
  const colors = {
    hero: '#1890ff',
    sidebar: '#52c41a',
    footer: '#722ed1',
    popup: '#fa8c16'
  };
  return colors[position] || '#666';
};

export const calculateCTR = (clicks, impressions) => {
  if (impressions === 0) return 0;
  return ((clicks / impressions) * 100).toFixed(2);
};

// Image validation
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 5MB' };
  }

  return { valid: true, error: null };
};

// URL validation
export const validateURL = (url) => {
  if (!url.trim()) {
    return { valid: false, error: 'URL is required' };
  }

  // Allow relative URLs (starting with /) or full URLs
  const urlPattern = /^(https?:\/\/)|(\/)/;
  if (!urlPattern.test(url)) {
    return { valid: false, error: 'Please enter a valid URL (starting with http://, https://, or /)' };
  }

  return { valid: true, error: null };
};
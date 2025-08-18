// Profile Status Options
export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Sample User Profile Data
export const userProfile = {
  id: 1,
  name: 'Arjun Sharma',
  email: 'arjun.sharma@feedadmin.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  role: 'Admin',
  status: 'active',
  profilePicture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E",
  joinedDate: '2023-06-15T10:30:00Z',
  lastLoginDate: '2024-01-20T14:25:00Z',
  settings: {
    twoFactorAuth: false,
    notifications: {
      email: true,
      sms: true,
      push: false
    }
  }
};

// Sample Activity Log Data
export const activityLogData = [
  {
    id: 1,
    date: '2024-01-20T14:25:00Z',
    activity: 'Logged in to admin panel',
    description: 'Successful login from 192.168.1.100',
    type: 'login'
  },
  {
    id: 2,
    date: '2024-01-20T14:30:00Z',
    activity: 'Updated flash sale "Summer Feed Festival"',
    description: 'Modified discount percentage from 20% to 25%',
    type: 'update'
  },
  {
    id: 3,
    date: '2024-01-20T14:45:00Z',
    activity: 'Created new product "Premium Organic Feed 30kg"',
    description: 'Added new product in Organic category',
    type: 'create'
  },
  {
    id: 4,
    date: '2024-01-20T15:10:00Z',
    activity: 'Deleted banner "New Year Promotion"',
    description: 'Removed expired promotional banner',
    type: 'delete'
  },
  {
    id: 5,
    date: '2024-01-20T15:30:00Z',
    activity: 'Updated user role for "Priya Patel"',
    description: 'Changed role from Customer to Premium Customer',
    type: 'update'
  },
  {
    id: 6,
    date: '2024-01-19T16:20:00Z',
    activity: 'Created category "Organic Supplements"',
    description: 'Added new product category with 5% commission',
    type: 'create'
  },
  {
    id: 7,
    date: '2024-01-19T16:45:00Z',
    activity: 'Updated notification settings',
    description: 'Enabled SMS notifications, disabled push notifications',
    type: 'settings'
  },
  {
    id: 8,
    date: '2024-01-19T17:00:00Z',
    activity: 'Processed bulk order #ORD-2024-001',
    description: 'Approved order worth ₹1,25,000 for 50 customers',
    type: 'order'
  },
  {
    id: 9,
    date: '2024-01-19T09:15:00Z',
    activity: 'Logged in to admin panel',
    description: 'Successful login from 192.168.1.100',
    type: 'login'
  },
  {
    id: 10,
    date: '2024-01-18T18:30:00Z',
    activity: 'Updated profile information',
    description: 'Changed phone number and address',
    type: 'profile'
  },
  {
    id: 11,
    date: '2024-01-18T14:20:00Z',
    activity: 'Generated monthly sales report',
    description: 'Exported sales data for December 2023',
    type: 'report'
  },
  {
    id: 12,
    date: '2024-01-18T11:45:00Z',
    activity: 'Updated banner "Feed Festival 2024"',
    description: 'Modified banner position and click tracking',
    type: 'update'
  },
  {
    id: 13,
    date: '2024-01-17T16:30:00Z',
    activity: 'Logged out of admin panel',
    description: 'Session ended normally',
    type: 'logout'
  },
  {
    id: 14,
    date: '2024-01-17T16:25:00Z',
    activity: 'Changed password',
    description: 'Successfully updated account password',
    type: 'security'
  },
  {
    id: 15,
    date: '2024-01-17T15:50:00Z',
    activity: 'Disabled user account "spam@example.com"',
    description: 'Suspended account due to suspicious activity',
    type: 'moderation'
  }
];

// Utility Functions
export const getActivityTypeIcon = (type) => {
  const typeIcons = {
    login: 'FiLogIn',
    logout: 'FiLogOut',
    create: 'FiPlus',
    update: 'FiEdit2',
    delete: 'FiTrash2',
    settings: 'FiSettings',
    order: 'FiShoppingCart',
    profile: 'FiUser',
    report: 'FiFileText',
    security: 'FiShield',
    moderation: 'FiAlertTriangle'
  };
  return typeIcons[type] || 'FiActivity';
};

export const getActivityTypeColor = (type) => {
  const typeColors = {
    login: '#52c41a',
    logout: '#8c8c8c',
    create: '#1890ff',
    update: '#faad14',
    delete: '#ff4d4f',
    settings: '#722ed1',
    order: '#13c2c2',
    profile: '#fa8c16',
    report: '#52c41a',
    security: '#ff4d4f',
    moderation: '#fa541c'
  };
  return typeColors[type] || '#666666';
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

export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  
  let strengthLevel = 'weak';
  let strengthColor = '#ff4d4f';
  
  if (strength >= 4) {
    strengthLevel = 'strong';
    strengthColor = '#52c41a';
  } else if (strength >= 3) {
    strengthLevel = 'medium';
    strengthColor = '#faad14';
  }

  return {
    checks,
    strength,
    strengthLevel,
    strengthColor,
    score: Math.round((strength / 5) * 100)
  };
};

// Profile picture validation
export const validateProfilePicture = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true, error: null };
};

// Generate profile picture preview URL (base64 for persistence)
export const getProfilePicturePreview = (file) => {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

// Synchronous version for backwards compatibility (creates blob URL)
export const getProfilePicturePreviewSync = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};
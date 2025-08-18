// User Role Options
export const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' }
];

// User Status Options
export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Sample User Data
export const userData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@adminfeed.com',
    role: 'admin',
    status: 'active',
    createdDate: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T09:15:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1890ff&color=fff'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@adminfeed.com',
    role: 'manager',
    status: 'active',
    createdDate: '2024-01-14T14:15:00Z',
    lastLogin: '2024-01-19T16:30:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=52c41a&color=fff'
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@adminfeed.com',
    role: 'staff',
    status: 'active',
    createdDate: '2024-01-13T09:45:00Z',
    lastLogin: '2024-01-18T11:20:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=722ed1&color=fff'
  },
  {
    id: 4,
    name: 'Sunita Verma',
    email: 'sunita.verma@adminfeed.com',
    role: 'staff',
    status: 'inactive',
    createdDate: '2024-01-12T16:20:00Z',
    lastLogin: '2024-01-15T14:10:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Sunita+Verma&background=faad14&color=fff'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@adminfeed.com',
    role: 'manager',
    status: 'active',
    createdDate: '2024-01-11T11:30:00Z',
    lastLogin: '2024-01-20T08:45:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=fa8c16&color=fff'
  },
  {
    id: 6,
    name: 'Anita Reddy',
    email: 'anita.reddy@adminfeed.com',
    role: 'staff',
    status: 'active',
    createdDate: '2024-01-10T13:25:00Z',
    lastLogin: '2024-01-19T17:55:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Anita+Reddy&background=ff4d4f&color=fff'
  },
  {
    id: 7,
    name: 'Rahul Gupta',
    email: 'rahul.gupta@adminfeed.com',
    role: 'admin',
    status: 'active',
    createdDate: '2024-01-09T12:10:00Z',
    lastLogin: '2024-01-20T10:30:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Gupta&background=13c2c2&color=fff'
  },
  {
    id: 8,
    name: 'Meera Shah',
    email: 'meera.shah@adminfeed.com',
    role: 'staff',
    status: 'inactive',
    createdDate: '2024-01-08T15:45:00Z',
    lastLogin: '2024-01-12T12:20:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Meera+Shah&background=eb2f96&color=fff'
  }
];

// Utility Functions
export const getRoleLabel = (role) => {
  const roleOption = roleOptions.find(option => option.value === role);
  return roleOption ? roleOption.label : role;
};

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

export const getRoleColor = (role) => {
  const colors = {
    admin: '#ff4d4f',
    manager: '#1890ff',
    staff: '#52c41a'
  };
  return colors[role] || '#666';
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#52c41a',
    inactive: '#ff4d4f'
  };
  return colors[status] || '#666';
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  let score = 0;
  let feedback = [];

  if (!password) {
    return { score: 0, strength: 'none', feedback: ['Password is required'] };
  }

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character');
  }

  let strength;
  if (score === 0) {
    strength = 'none';
  } else if (score <= 2) {
    strength = 'weak';
  } else if (score <= 3) {
    strength = 'medium';
  } else if (score <= 4) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  return { score, strength, feedback };
};
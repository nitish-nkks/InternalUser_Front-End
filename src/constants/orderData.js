export const orderStatusOptions = [
  { value: 'Order_Placed', label: 'Order Placed' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Return_Requested', label: 'Return Requested' },
  { value: 'Returned', label: 'Returned' }
];

export const getOrderStatusLabel = (status) => {
  const statusLabels = {
    'Order_Placed': 'Order Placed',
    'Processing': 'Processing',
    'Shipped': 'Shipped',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled',
    'Return_Requested': 'Return Requested',
    'Returned': 'Returned'
  };
  return statusLabels[status] || status;
};

export const paymentStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partial', label: 'Partial' }
];

export const getPaymentStatusLabel = (status) => {
  const statusLabels = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    partial: 'Partial'
  };
  return statusLabels[status] || status;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getOrderStatusColor = (status) => {
  const colors = {
    'Order_Placed': '#3b82f6',
    'Processing': '#f59e0b',
    'Shipped': '#8b5cf6',
    'Delivered': '#10b981',
    'Cancelled': '#ef4444',
    'Return_Requested': '#f97316',
    'Returned': '#6b7280'
  };
  return colors[status] || '#6b7280';
};


// Sample Order Data
export const orderData = [
  {
    id: 'ORD-001',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh.kumar@email.com',
    customerPhone: '+91 98765 43210',
    orderDate: '2024-01-15T10:30:00Z',
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    totalAmount: 2450.00,
    shippingAddress: {
      street: 'Flat No. 204, Green Valley Apartments, 80 Feet Road, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560034',
      country: 'India'
    },
    items: [
      {
        id: 1,
        productName: 'Premium Poultry Feed 25kg',
        category: 'poultry',
        quantity: 2,
        unitPrice: 850.00,
        totalPrice: 1700.00
      },
      {
        id: 2,
        productName: 'Fish Feed Pellets 10kg',
        category: 'fish',
        quantity: 3,
        unitPrice: 250.00,
        totalPrice: 750.00
      }
    ],
    shippingCost: 50.00,
    taxAmount: 195.00,
    discountAmount: 0.00,
    notes: 'Customer requested expedited shipping'
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@email.com',
    customerPhone: '+91 91234 56789',
    orderDate: '2024-01-14T14:15:00Z',
    orderStatus: 'processing',
    paymentStatus: 'paid',
    totalAmount: 1250.00,
    shippingAddress: {
      street: 'House No. 456, Block C, Sushant Lok Phase I, Sector 43',
      city: 'Gurugram',
      state: 'Haryana',
      zipCode: '122002',
      country: 'India'
    },
    items: [
      {
        id: 3,
        productName: 'Shrimp Feed Special 20kg',
        category: 'shrimp',
        quantity: 1,
        unitPrice: 1200.00,
        totalPrice: 1200.00
      }
    ],
    shippingCost: 0.00,
    taxAmount: 50.00,
    discountAmount: 100.00,
    notes: 'Free shipping applied'
  },
  {
    id: 'ORD-003',
    customerName: 'Amit Patel',
    customerEmail: 'amit.patel@email.com',
    customerPhone: '+91 99887 76655',
    orderDate: '2024-01-13T09:45:00Z',
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    totalAmount: 3200.00,
    shippingAddress: {
      street: 'Plot No. 789, Shivalik Heights, Near ISCON Circle, Satellite Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      zipCode: '380015',
      country: 'India'
    },
    items: [
      {
        id: 1,
        productName: 'Premium Poultry Feed 25kg',
        category: 'poultry',
        quantity: 2,
        unitPrice: 850.00,
        totalPrice: 1700.00
      },
      {
        id: 2,
        productName: 'Fish Feed Pellets 10kg',
        category: 'fish',
        quantity: 4,
        unitPrice: 250.00,
        totalPrice: 1000.00
      },
      {
        id: 3,
        productName: 'Shrimp Feed Special 20kg',
        category: 'shrimp',
        quantity: 1,
        unitPrice: 1200.00,
        totalPrice: 1200.00
      }
    ],
    shippingCost: 75.00,
    taxAmount: 225.00,
    discountAmount: 200.00,
    notes: 'Bulk order discount applied'
  },
  {
    id: 'ORD-004',
    customerName: 'Sunita Verma',
    customerEmail: 'sunita.verma@email.com',
    customerPhone: '+91 98765 43211',
    orderDate: '2024-01-12T16:20:00Z',
    orderStatus: 'pending',
    paymentStatus: 'pending',
    totalAmount: 425.00,
    shippingAddress: {
      street: 'Bungalow No. 321, Civil Lines, Near High Court',
      city: 'Prayagraj',
      state: 'Uttar Pradesh',
      zipCode: '211001',
      country: 'India'
    },
    items: [
      {
        id: 2,
        productName: 'Fish Feed Pellets 10kg',
        category: 'fish',
        quantity: 1,
        unitPrice: 250.00,
        totalPrice: 250.00
      }
    ],
    shippingCost: 25.00,
    taxAmount: 25.00,
    discountAmount: 0.00,
    notes: 'First time customer'
  },
  {
    id: 'ORD-005',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram.singh@email.com',
    customerPhone: '+91 96543 21098',
    orderDate: '2024-01-11T11:30:00Z',
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    totalAmount: 0.00,
    shippingAddress: {
      street: 'House No. 654, Model Town Extension, Near Gurudwara Singh Sabha',
      city: 'Ludhiana',
      state: 'Punjab',
      zipCode: '141002',
      country: 'India'
    },
    items: [
      {
        id: 1,
        productName: 'Premium Poultry Feed 25kg',
        category: 'poultry',
        quantity: 3,
        unitPrice: 850.00,
        totalPrice: 2550.00
      }
    ],
    shippingCost: 0.00,
    taxAmount: 0.00,
    discountAmount: 0.00,
    notes: 'Order cancelled by customer'
  }
];


export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: '#faad14',
    paid: '#52c41a',
    failed: '#ff4d4f',
    refunded: '#722ed1',
    partial: '#fa8c16'
  };
  return colors[status] || '#666';
};
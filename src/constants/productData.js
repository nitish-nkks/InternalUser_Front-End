// Dummy product data for feed management system
export const productData = [
  {
    id: 1,
    name: "Premium Poultry Starter Feed",
    sku: "PPF-001",
    category: "poultry",
    price: 45.99,
    discountPrice: 42.99,
    stock: 150,
    status: "active",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=100&h=100&fit=crop&crop=center",
    description: "High-protein starter feed for young chicks with essential vitamins and minerals for healthy growth.",
    createdDate: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Organic Layer Feed",
    sku: "OLF-002",
    category: "poultry",
    price: 52.50,
    discountPrice: null,
    stock: 89,
    status: "active",
    image: "https://images.unsplash.com/photo-1586941962765-f84e5c8a1c32?w=100&h=100&fit=crop&crop=center",
    description: "Organic feed blend for laying hens to enhance egg production and quality.",
    createdDate: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    name: "Shrimp Growth Formula",
    sku: "SGF-003",
    category: "shrimp",
    price: 78.25,
    discountPrice: 74.99,
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&h=100&fit=crop&crop=center",
    description: "Specialized feed for optimal shrimp growth with high-quality proteins and amino acids.",
    createdDate: "2024-02-01T09:45:00Z"
  },
  {
    id: 4,
    name: "Tilapia Complete Feed",
    sku: "TCF-004",
    category: "fish",
    price: 35.75,
    discountPrice: null,
    stock: 120,
    status: "active",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop&crop=center",
    description: "Complete nutritional feed for tilapia fish with balanced protein and fat content.",
    createdDate: "2024-02-05T16:20:00Z"
  },
  {
    id: 5,
    name: "Broiler Finisher Feed",
    sku: "BFF-005",
    category: "poultry",
    price: 48.90,
    discountPrice: null,
    stock: 0,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=100&h=100&fit=crop&crop=center",
    description: "Finisher feed for broiler chickens in their final growth phase.",
    createdDate: "2024-02-10T11:30:00Z"
  },
  {
    id: 6,
    name: "Marine Shrimp Feed",
    sku: "MSF-006",
    category: "shrimp",
    price: 82.00,
    discountPrice: 78.50,
    stock: 67,
    status: "active",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&h=100&fit=crop&crop=center",
    description: "Premium marine shrimp feed with enhanced palatability and digestibility.",
    createdDate: "2024-02-12T08:15:00Z"
  },
  {
    id: 7,
    name: "Catfish Premium Pellets",
    sku: "CPP-007",
    category: "fish",
    price: 41.30,
    discountPrice: null,
    stock: 95,
    status: "active",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop&crop=center",
    description: "High-energy pellets for catfish farming with excellent feed conversion ratio.",
    createdDate: "2024-02-15T13:45:00Z"
  },
  {
    id: 8,
    name: "Turkey Grower Feed",
    sku: "TGF-008",
    category: "poultry",
    price: 55.60,
    discountPrice: 52.99,
    stock: 73,
    status: "active",
    image: "https://images.unsplash.com/photo-1586941962765-f84e5c8a1c32?w=100&h=100&fit=crop&crop=center",
    description: "Specially formulated grower feed for turkey poults with optimal nutrition.",
    createdDate: "2024-02-18T10:20:00Z"
  },
  {
    id: 9,
    name: "Freshwater Prawn Feed",
    sku: "FPF-009",
    category: "shrimp",
    price: 71.45,
    discountPrice: null,
    stock: 28,
    status: "active",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&h=100&fit=crop&crop=center",
    description: "Nutritious feed for freshwater prawns with essential nutrients for growth.",
    createdDate: "2024-02-20T15:10:00Z"
  },
  {
    id: 10,
    name: "Salmon Fingerling Feed",
    sku: "SFF-010",
    category: "fish",
    price: 89.90,
    discountPrice: 85.99,
    stock: 54,
    status: "active",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop&crop=center",
    description: "Premium feed for salmon fingerlings with high-quality marine proteins.",
    createdDate: "2024-02-22T12:30:00Z"
  },
  {
    id: 11,
    name: "Duck Layer Pellets",
    sku: "DLP-011",
    category: "poultry",
    price: 46.75,
    discountPrice: null,
    stock: 112,
    status: "active",
    image: "https://images.unsplash.com/photo-1586941962765-f84e5c8a1c32?w=100&h=100&fit=crop&crop=center",
    description: "Complete feed for laying ducks with enhanced calcium for strong eggshells.",
    createdDate: "2024-02-25T14:45:00Z"
  },
  {
    id: 12,
    name: "Carp Growth Feed",
    sku: "CGF-012",
    category: "fish",
    price: 38.25,
    discountPrice: null,
    stock: 156,
    status: "active",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop&crop=center",
    description: "Fast-growing feed formula for carp with balanced nutrition profile.",
    createdDate: "2024-02-28T09:15:00Z"
  }
];

export const categoryOptions = [
  { value: "poultry", label: "Poultry Feed" },
  { value: "shrimp", label: "Shrimp Feed" },
  { value: "fish", label: "Fish Feed" }
];

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

// Helper functions
export const getProductById = (id) => {
  return productData.find(product => product.id === parseInt(id));
};

export const getCategoryLabel = (category) => {
  const option = categoryOptions.find(opt => opt.value === category);
  return option ? option.label : category;
};

export const getStatusLabel = (status) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option ? option.label : status;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
export const categoryData = [
  {
    id: 1,
    name: "Animal Feed",
    parentId: null,
    description: "Main category for all animal feed products",
    status: "active",
    createdDate: "2024-01-10T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Poultry Feed",
    parentId: 1,
    description: "High-quality feed for chickens, ducks, and other poultry birds. Contains essential nutrients for healthy growth and egg production.",
    status: "active",
    createdDate: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 3,
    name: "Aquaculture Feed",
    parentId: 1,
    description: "Specialized feed for aquatic animals",
    status: "active",
    createdDate: "2024-01-18T14:00:00.000Z"
  },
  {
    id: 4,
    name: "Shrimp Feed",
    parentId: 3,
    description: "Premium aquaculture feed specifically formulated for shrimp farming. Promotes rapid growth and disease resistance.",
    status: "active",
    createdDate: "2024-01-20T14:15:00.000Z"
  },
  {
    id: 5,
    name: "Fish Feed",
    parentId: 3,
    description: "Nutritionally balanced feed for various fish species including carp, tilapia, and catfish. Supports healthy development and immunity.",
    status: "active",
    createdDate: "2024-02-01T09:45:00.000Z"
  },
  {
    id: 6,
    name: "Starter Feed",
    parentId: 2,
    description: "Feed for young poultry birds in their initial growth phase",
    status: "active",
    createdDate: "2024-02-05T11:20:00.000Z"
  },
  {
    id: 7,
    name: "Layer Feed",
    parentId: 2,
    description: "Specialized feed for laying hens to enhance egg production",
    status: "active",
    createdDate: "2024-02-08T09:30:00.000Z"
  },
  {
    id: 8,
    name: "Broiler Feed",
    parentId: 2,
    description: "Feed formulated for broiler chickens for optimal meat production",
    status: "inactive",
    createdDate: "2024-02-10T16:45:00.000Z"
  }
];

export const getStatusLabel = (status) => {
  return status === 'active' ? 'Active' : 'Inactive';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Helper functions for category management
export const getCategoryById = (id) => {
  return categoryData.find(category => category.id === parseInt(id));
};

export const getParentCategoryName = (parentId) => {
  if (!parentId) return 'None';
  const parent = getCategoryById(parentId);
  return parent ? parent.name : 'None';
};

export const getRootCategories = () => {
  return categoryData.filter(category => !category.parentId);
};

export const getChildCategories = (parentId) => {
  return categoryData.filter(category => category.parentId === parentId);
};

export const buildCategoryOptions = () => {
  const options = [{ value: '', label: 'None (Root Category)' }];
  
  const addCategoryOptions = (categories, prefix = '') => {
    categories.forEach(category => {
      options.push({
        value: category.id,
        label: `${prefix}${category.name}`
      });
      
      const children = getChildCategories(category.id);
      if (children.length > 0) {
        addCategoryOptions(children, `${prefix}${category.name} > `);
      }
    });
  };
  
  const rootCategories = getRootCategories();
  addCategoryOptions(rootCategories);
  
  return options;
};

export const getCategoryPath = (categoryId) => {
  const path = [];
  let current = getCategoryById(categoryId);
  
  while (current) {
    path.unshift(current.name);
    current = current.parentId ? getCategoryById(current.parentId) : null;
  }
  
  return path.join(' > ');
};
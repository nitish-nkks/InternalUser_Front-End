// Blog Status Options
export const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' }
];

// Sample Authors
export const authors = [
  'Arjun Sharma',
  'Priya Patel', 
  'Rahul Kumar',
  'Sneha Singh',
  'Vikram Reddy'
];

// Sample Blog Data
export const blogData = [
  {
    id: 1,
    title: 'Best Feed Practices for Poultry in 2024',
    slug: 'best-feed-practices-poultry-2024',
    content: `<p>Proper nutrition is the cornerstone of successful poultry farming. In 2024, we're seeing exciting developments in feed technology and nutritional understanding that can help farmers optimize their operations.</p>

<p><strong>Key Nutritional Requirements:</strong></p>
<ul>
<li>Protein: 18-22% for laying hens, 20-24% for broilers</li>
<li>Energy: 2800-3000 kcal/kg metabolizable energy</li>
<li>Calcium: 3.5-4% for laying hens</li>
<li>Phosphorus: 0.4-0.6% available phosphorus</li>
</ul>

<p>Modern feed formulations now incorporate probiotics, prebiotics, and organic trace minerals to enhance gut health and improve nutrient absorption. These additives have shown remarkable results in improving feed conversion ratios and overall bird health.</p>

<p>Temperature management during feed storage is crucial. Always store feed in cool, dry conditions below 25°C to prevent mold growth and nutrient degradation.</p>`,
    author: 'Arjun Sharma',
    publishDate: '2024-01-15T10:30:00Z',
    status: 'published',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=250&fit=crop&crop=center',
    wordCount: 145,
    charCount: 892
  },
  {
    id: 2,
    title: 'Sustainable Fish Farming: Feed Solutions for Growth',
    slug: 'sustainable-fish-farming-feed-solutions',
    content: `<p>Aquaculture is rapidly becoming one of the most important protein sources globally. With this growth comes the responsibility to develop sustainable feeding practices that support both fish health and environmental conservation.</p>

<p><strong>Sustainable Feed Ingredients:</strong></p>
<ul>
<li>Plant-based proteins (soybean meal, corn gluten)</li>
<li>Insect meal (black soldier fly larvae)</li>
<li>Single-cell proteins from yeast</li>
<li>Algae-based omega-3 fatty acids</li>
</ul>

<p>Feed conversion ratios in modern aquaculture have improved dramatically. Quality feeds now achieve FCR of 1.2:1 for salmon and 1.5:1 for tilapia, significantly reducing environmental impact.</p>

<p>Water quality management remains crucial - overfeeding leads to excess nutrients in water, causing algae blooms and oxygen depletion.</p>`,
    author: 'Priya Patel',
    publishDate: '2024-01-18T09:15:00Z',
    status: 'published',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop&crop=center',
    wordCount: 128,
    charCount: 756
  },
  {
    id: 3,
    title: 'Understanding Nutritional Requirements for Shrimp',
    slug: 'nutritional-requirements-shrimp-farming',
    content: `<p>Shrimp farming presents unique nutritional challenges due to the species' complex life cycle and specific dietary needs. Success in shrimp aquaculture heavily depends on providing balanced nutrition at each growth stage.</p>

<p><strong>Critical Nutrients for Shrimp:</strong></p>
<ul>
<li>Crude Protein: 35-40% for juvenile shrimp</li>
<li>Lipids: 6-12% with balanced omega-3/omega-6 ratios</li>
<li>Cholesterol: 0.3-0.5% for proper molting</li>
<li>Phospholipids: Essential for growth and survival</li>
</ul>

<p>Feeding frequency is crucial - young shrimp require feeding every 2-3 hours, while adults can be fed 3-4 times daily. Overfeeding not only wastes expensive feed but also deteriorates water quality.</p>

<p>Recent research shows that including immunostimulants like beta-glucan and vitamin C can significantly improve disease resistance and survival rates.</p>`,
    author: 'Rahul Kumar',
    publishDate: null,
    status: 'draft',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&crop=center',
    wordCount: 134,
    charCount: 825
  },
  {
    id: 4,
    title: 'Organic Feed Certification: Complete Guide 2024',
    slug: 'organic-feed-certification-guide-2024',
    content: `<p>The demand for organic animal products continues to grow, driving the need for certified organic feeds. Understanding the certification process and requirements is essential for feed manufacturers and livestock producers.</p>

<p><strong>Organic Feed Requirements:</strong></p>
<ul>
<li>100% organic ingredients with certified sources</li>
<li>No synthetic pesticides, herbicides, or fertilizers</li>
<li>No GMO ingredients</li>
<li>No antibiotics or growth hormones</li>
<li>Proper record keeping and traceability</li>
</ul>

<p>The certification process typically takes 3-5 years for new operations. During this transition period, farms must follow organic practices but cannot label products as organic until full certification is achieved.</p>

<p>Cost considerations include premium prices for organic ingredients (20-40% higher), certification fees ($500-$5000 annually), and additional documentation requirements.</p>

<p>Market opportunities are significant - organic animal products command 30-50% price premiums in most markets.</p>`,
    author: 'Sneha Singh',
    publishDate: '2024-01-12T13:20:00Z',
    status: 'published',
    createdAt: '2024-01-08T10:15:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop&crop=center',
    wordCount: 156,
    charCount: 965
  },
  {
    id: 5,
    title: 'Feed Storage Best Practices: Preventing Contamination',
    slug: 'feed-storage-best-practices-contamination',
    content: `<p>Proper feed storage is critical for maintaining nutritional value, preventing contamination, and ensuring animal health. Poor storage practices can lead to mycotoxin development, nutrient loss, and significant economic losses.</p>

<p><strong>Storage Environment Control:</strong></p>
<ul>
<li>Temperature: Below 25°C to prevent mold growth</li>
<li>Humidity: Less than 14% moisture content</li>
<li>Ventilation: Adequate airflow to prevent hot spots</li>
<li>Pest Control: Regular monitoring and prevention</li>
</ul>

<p>Container selection matters significantly. Use airtight containers made of food-grade materials. Avoid storing different feed types together as cross-contamination can occur.</p>

<p>First-In-First-Out (FIFO) rotation is essential. Label all feed batches with production dates and use older stock first. Most commercial feeds have a shelf life of 6-12 months when stored properly.</p>

<p>Regular quality testing should include moisture content, mycotoxin screening, and nutritional analysis to ensure feed quality remains within acceptable parameters.</p>`,
    author: 'Vikram Reddy',
    publishDate: null,
    status: 'draft',
    createdAt: '2024-01-20T15:30:00Z',
    updatedAt: '2024-01-21T09:45:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop&crop=center',
    wordCount: 162,
    charCount: 987
  }
];

// Utility Functions
export const formatDate = (dateString) => {
  if (!dateString) return 'Not published';
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
    published: '#52c41a',
    draft: '#faad14'
  };
  return colors[status] || '#666666';
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

export const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export const countWords = (text) => {
  const cleanText = stripHtml(text);
  return cleanText.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countCharacters = (text) => {
  return stripHtml(text).length;
};

export const validateBlogData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Blog title is required';
  }

  if (!data.content?.trim()) {
    errors.content = 'Blog content is required';
  } else if (countWords(data.content) > 1000) {
    errors.content = 'Content must be 1000 words or less';
  }

  if (!data.slug?.trim()) {
    errors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getBlogById = (id) => {
  return blogData.find(blog => blog.id === id);
};

export const getAuthorBlogs = (author) => {
  return blogData.filter(blog => blog.author === author);
};

export const getPublishedBlogs = () => {
  return blogData.filter(blog => blog.status === 'published');
};

export const getDraftBlogs = () => {
  return blogData.filter(blog => blog.status === 'draft');
};

// Image validation functions
export const validateBlogImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!file) return { valid: true, error: null }; // Optional field
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true, error: null };
};

// Generate image preview URL
export const getBlogImagePreview = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};
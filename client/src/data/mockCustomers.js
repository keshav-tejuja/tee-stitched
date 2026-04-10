// Mock users data for CRM/Admin analytics
// Each user has CRM-relevant fields for segmentation and ranking

const MOCK_CUSTOMERS = [
  {
    _id: 'mock_u1',
    name: 'Aarav Patel',
    email: 'aarav@example.com',
    totalSpent: 12500,
    totalOrders: 5,
    lastOrderDate: '2026-04-05',
    cartItems: 2,
    hasOrdered: true,
  },
  {
    _id: 'mock_u2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    totalSpent: 8200,
    totalOrders: 3,
    lastOrderDate: '2026-03-28',
    cartItems: 0,
    hasOrdered: true,
  },
  {
    _id: 'mock_u3',
    name: 'Rohan Gupta',
    email: 'rohan@example.com',
    totalSpent: 3400,
    totalOrders: 1,
    lastOrderDate: '2026-03-15',
    cartItems: 3,
    hasOrdered: true,
  },
  {
    _id: 'mock_u4',
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
    totalSpent: 0,
    totalOrders: 0,
    lastOrderDate: null,
    cartItems: 4,
    hasOrdered: false,
  },
  {
    _id: 'mock_u5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    totalSpent: 18900,
    totalOrders: 8,
    lastOrderDate: '2026-04-08',
    cartItems: 1,
    hasOrdered: true,
  },
  {
    _id: 'mock_u6',
    name: 'Meera Joshi',
    email: 'meera@example.com',
    totalSpent: 4500,
    totalOrders: 2,
    lastOrderDate: '2026-02-10',
    cartItems: 0,
    hasOrdered: true,
  },
  {
    _id: 'mock_u7',
    name: 'Arjun Nair',
    email: 'arjun@example.com',
    totalSpent: 0,
    totalOrders: 0,
    lastOrderDate: null,
    cartItems: 2,
    hasOrdered: false,
  },
  {
    _id: 'mock_u8',
    name: 'Sneha Menon',
    email: 'sneha@example.com',
    totalSpent: 6700,
    totalOrders: 3,
    lastOrderDate: '2026-04-01',
    cartItems: 0,
    hasOrdered: true,
  },
  {
    _id: 'mock_u9',
    name: 'Karthik Iyer',
    email: 'karthik@example.com',
    totalSpent: 1800,
    totalOrders: 1,
    lastOrderDate: '2026-01-20',
    cartItems: 5,
    hasOrdered: true,
  },
  {
    _id: 'mock_u10',
    name: 'Diya Kapoor',
    email: 'diya@example.com',
    totalSpent: 22400,
    totalOrders: 10,
    lastOrderDate: '2026-04-09',
    cartItems: 0,
    hasOrdered: true,
  },
];

/**
 * Categorize a customer based on CRM segmentation rules:
 * - Frequent Buyer: 3+ orders
 * - Active Buyer: 1-2 orders in last 60 days
 * - Inactive Buyer: no recent orders (>60 days or 0 orders)
 */
export const categorizeCustomer = (customer) => {
  if (customer.totalOrders >= 3) return 'Frequent Buyer';
  
  if (customer.totalOrders >= 1 && customer.lastOrderDate) {
    const lastOrder = new Date(customer.lastOrderDate);
    const now = new Date();
    const daysSince = Math.floor((now - lastOrder) / (1000 * 60 * 60 * 24));
    if (daysSince <= 60) return 'Active Buyer';
  }
  
  return 'Inactive Buyer';
};

/**
 * Get category badge color classes
 */
export const getCategoryBadge = (category) => {
  switch (category) {
    case 'Frequent Buyer': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Active Buyer': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Inactive Buyer': return 'bg-gray-100 text-gray-600 border border-gray-200';
    default: return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Get customers with their CRM segmentation, sorted by lifetime value
 */
export const getMockCustomers = () => {
  return MOCK_CUSTOMERS
    .map(c => ({
      ...c,
      category: categorizeCustomer(c),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
};

/**
 * Get abandoned cart users (have cart items but no orders)
 */
export const getAbandonedCartUsers = () => {
  return MOCK_CUSTOMERS.filter(c => c.cartItems > 0 && !c.hasOrdered);
};

/**
 * Get users with items in cart (regardless of order status)
 */
export const getUsersWithCartItems = () => {
  return MOCK_CUSTOMERS.filter(c => c.cartItems > 0);
};

export default MOCK_CUSTOMERS;

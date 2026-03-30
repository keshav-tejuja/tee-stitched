// In-memory database with hardcoded data
let users = [];
let designs = [];
let orders = [];
let analytics = [];
let inventory = []; // new inventory collection

// Product images as SVG data URIs
const tshirtImage1 = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22%3E%3Crect fill=%22%23f8f8f8%22 width=%22300%22 height=%22400%22/%3E%3C!-- T-shirt shape --%3E%3Cpath fill=%22%236366f1%22 d=%22M 60 80 L 120 50 L 180 50 L 240 80 L 240 180 Q 240 200 220 220 L 220 320 L 80 320 L 80 220 Q 60 200 60 180 Z%22/%3E%3C/svg%3E';
const tshirtImage2 = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22%3E%3Crect fill=%22%23f8f8f8%22 width=%22300%22 height=%22400%22/%3E%3Cpath fill=%22%23ec4899%22 d=%22M 60 80 L 120 50 L 180 50 L 240 80 L 240 180 Q 240 200 220 220 L 220 320 L 80 320 L 80 220 Q 60 200 60 180 Z%22/%3E%3C/svg%3E';
const tshirtImage3 = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22%3E%3Crect fill=%22%23f8f8f8%22 width=%22300%22 height=%22400%22/%3E%3Cpath fill=%22%2310b981%22 d=%22M 60 80 L 120 50 L 180 50 L 240 80 L 240 180 Q 240 200 220 220 L 220 320 L 80 320 L 80 220 Q 60 200 60 180 Z%22/%3E%3C/svg%3E';

const products = [
  {
    _id: '1',
    name: 'Stitched Classic Tee',
    category: 'Men',
    basePrice: 499,
    image: 'https://via.placeholder.com/350x420?text=Classic+Tee',
    description: 'Pure cotton tee with reinforced stitches and soft feel.',
    fabrics: ['cotton', 'cotton-blend'],
    colors: ['black', 'white', 'navy', 'gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['regular', 'slim'],
    stock: 15,
    reviewsData: [
      { userId: 'Rahul Sharma', rating: 5, comment: 'Amazing quality and fit!', createdAt: '2 days ago' },
      { userId: 'Sneha Shah', rating: 4, comment: 'Fabric is soft but size runs slightly large', createdAt: '1 week ago' },
      { userId: 'Anita Kumar', rating: 5, comment: 'Worth the price', createdAt: '3 days ago' },
      { userId: 'Rohan Das', rating: 4, comment: 'Very comfortable for daily wear', createdAt: '5 days ago' },
      { userId: 'Neha Verma', rating: 4, comment: 'Nice stitching and no shrinkage after wash', createdAt: '1 month ago' },
    ],
    qa: [
      { q: 'Is this pure cotton?', a: 'Yes, 100% cotton and breathable' },
      { q: 'Does it shrink after wash?', a: 'Minimal shrinkage if washed cold' },
      { q: 'Is the color fade-resistant?', a: 'Yes, colorfast and machine washable' },
    ],
  },
  {
    _id: '2',
    name: 'Stitched Streetwear Hoodie',
    category: 'Men',
    basePrice: 899,
    image: 'https://via.placeholder.com/350x420?text=Streetwear+Hoodie',
    description: 'Cozy cotton blend hoodie with hood drawstrings and kangaroo pocket.',
    fabrics: ['cotton', 'polyester'],
    colors: ['black', 'maroon', 'blue', 'olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    fits: ['regular', 'oversized'],
    stock: 4,
    reviewsData: [
      { userId: 'Arjun Mehta', rating: 5, comment: 'Perfect winter layering piece', createdAt: '4 days ago' },
      { userId: 'Pooja Rao', rating: 4, comment: 'Super warm and plush', createdAt: '6 days ago' },
      { userId: 'Karan Jain', rating: 5, comment: 'Fit is great but runs a bit big', createdAt: '2 weeks ago' },
      { userId: 'Mira Khatri', rating: 4, comment: 'Excellent stitching quality', createdAt: '2 weeks ago' },
      { userId: 'Vikram Singh', rating: 3, comment: 'Good, but sleeve length is long', createdAt: '1 month ago' },
    ],
    qa: [
      { q: 'Is this lined?', a: 'No lining but double-layered for warmth' },
      { q: 'Can I machine wash it?', a: 'Yes, wash cold and tumble dry low' },
      { q: 'Is it unisex?', a: 'Yes, it is styled for both men and women' },
    ],
  },
  {
    _id: '3',
    name: 'Stitched Slim Fit Top',
    category: 'Women',
    basePrice: 599,
    image: 'https://via.placeholder.com/350x420?text=Slim+Fit+Top',
    description: 'Lightweight top with stretch and premium finish.',
    fabrics: ['cotton', 'cotton-spandex'],
    colors: ['white', 'pink', 'black', 'lightblue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fits: ['slim'],
    stock: 8,
    reviewsData: [
      { userId: 'Priya Patel', rating: 5, comment: 'Fits perfectly and feels luxe', createdAt: '3 days ago' },
      { userId: 'Simran Kaur', rating: 4, comment: 'Nice fabric but should come in more colors', createdAt: '1 week ago' },
      { userId: 'Ritu Anand', rating: 5, comment: 'Great office wear, no wrinkles', createdAt: '6 days ago' },
      { userId: 'Nisha Gupta', rating: 4, comment: 'Soft and breathable', createdAt: '2 weeks ago' },
      { userId: 'Sakshi Mehta', rating: 5, comment: 'Excellent stitching and silhouette', createdAt: '4 days ago' },
    ],
    qa: [
      { q: 'Is this stretchable?', a: 'Yes, it has slight stretch for comfort' },
      { q: 'Is it suited for summers?', a: 'Absolutely, lightweight and airy' },
      { q: 'Color stays vibrant after washes?', a: 'Yes, colors stay intact for 5+ washes' },
    ],
  },
  {
    _id: '4',
    name: 'Stitched V-neck Tee',
    category: 'Men',
    basePrice: 529,
    image: 'https://via.placeholder.com/350x420?text=V-neck+Tee',
    description: 'Soft V-neck style tee for daily wear.',
    fabrics: ['cotton'],
    colors: ['white', 'black', 'navy', 'green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['regular'],
    stock: 0,
    reviewsData: [
      { userId: 'Anuj Desai', rating: 5, comment: 'Great price and fit', createdAt: '1 week ago' },
      { userId: 'Nina Rao', rating: 4, comment: 'Material is soft', createdAt: '2 weeks ago' },
      { userId: 'Sahil Chopra', rating: 4, comment: 'Good stitching but a bit long', createdAt: '3 weeks ago' },
      { userId: 'Tanya Paul', rating: 5, comment: 'Go-to basic tee now', createdAt: '4 days ago' },
      { userId: 'Amit Shah', rating: 5, comment: 'Color is exactly as shown', createdAt: '6 days ago' },
    ],
    qa: [
      { q: 'Does this have a pocket?', a: 'No pocket to keep the look clean' },
      { q: 'Is this shrink-free?', a: 'Has minimal shrinkage, wash cold' },
      { q: 'Can be used for workouts?', a: 'Yes, but it is more lifestyle-focused' },
    ],
  },
  {
    _id: '5',
    name: 'Stitched Relaxed Fit T-Shirt',
    category: 'Women',
    basePrice: 579,
    image: 'https://via.placeholder.com/350x420?text=Relaxed+Fit',
    description: 'Relaxed fit top with soft touch and dropped shoulders.',
    fabrics: ['cotton-blend'],
    colors: ['peach', 'gray', 'white', 'yellow'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fits: ['oversized', 'regular'],
    stock: 20,
    reviewsData: [
      { userId: 'Megha Singh', rating: 5, comment: 'Really flattering and comfy', createdAt: '3 days ago' },
      { userId: 'Rhea Kapoor', rating: 5, comment: 'Perfect for travel wardrobe', createdAt: '5 days ago' },
      { userId: 'Sana Ali', rating: 4, comment: 'Nice fabric but a bit pricey', createdAt: '2 weeks ago' },
      { userId: 'Prita Bhatt', rating: 3, comment: 'Good but colors faded slightly', createdAt: '1 month ago' },
      { userId: 'Veda Chawla', rating: 5, comment: 'Excellent quality, highly recommend', createdAt: '4 days ago' },
    ],
    qa: [
      { q: 'Does it have side slits?', a: 'Yes, small side slits for movement' },
      { q: 'Is the neck ribbed?', a: 'Yes, neat ribbed finishing at the neck' },
      { q: 'How is the wash care?', a: 'Machine wash cold and line dry' },
    ],
  },
  {
    _id: '6',
    name: 'Stitched Performance Tee',
    category: 'Men',
    basePrice: 699,
    image: 'https://via.placeholder.com/350x420?text=Performance+Tee',
    description: 'Quick-dry performance tee with anti-odor finish.',
    fabrics: ['polyester', 'polyester-blend'],
    colors: ['black', 'white', 'blue', 'red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['slim', 'regular'],
    stock: 6,
    reviewsData: [
      { userId: 'Shikha Singh', rating: 5, comment: 'Great for gym sessions', createdAt: '2 days ago' },
      { userId: 'Rajat Verma', rating: 4, comment: 'Lightweight and breathable', createdAt: '1 week ago' },
      { userId: 'Isha Kapoor', rating: 4, comment: 'Perfect fit for workouts', createdAt: '8 days ago' },
      { userId: 'Kartik Nair', rating: 5, comment: 'No smell after intense workouts', createdAt: '10 days ago' },
      { userId: 'Sneha Bose', rating: 4, comment: 'Nice quality but pricey', createdAt: '11 days ago' },
    ],
    qa: [
      { q: 'Does it wick sweat?', a: 'Yes, it dries fast and keeps you cool' },
      { q: 'Is this suitable for running?', a: 'Yes, ideal for running and gym' },
      { q: 'Is it tagless?', a: 'Yes, tagless for comfort' },
    ],
  },
  {
    _id: '7',
    name: 'Stitched Floral Graphic Tee',
    category: 'Women',
    basePrice: 649,
    image: 'https://via.placeholder.com/350x420?text=Floral+Graphic',
    description: 'Trendy floral graphic tee for a modern look.',
    fabrics: ['cotton'],
    colors: ['white', 'pink', 'lightgreen'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fits: ['regular', 'slim'],
    stock: 12,
    reviewsData: [
      { userId: 'Ankita Gupta', rating: 5, comment: 'Beautiful print and soft fabric!', createdAt: '2 days ago' },
      { userId: 'Tarun Malhotra', rating: 4, comment: 'Quality is premium', createdAt: '6 days ago' },
      { userId: 'Nivedita Sen', rating: 5, comment: 'Great for casual outings', createdAt: '1 week ago' },
      { userId: 'Smita Patel', rating: 4, comment: 'Perfect fit, true to size', createdAt: '10 days ago' },
      { userId: 'Rekha Joshi', rating: 5, comment: 'Looks even better in person', createdAt: '5 days ago' },
    ],
    qa: [
      { q: 'Is the print durable?', a: 'Yes, it survives multiple washes' },
      { q: 'Can it be tucked in?', a: 'Yes, slightly stretchy and easy to style' },
      { q: 'Is fabric breathable?', a: 'Yes, good for warm weather' },
    ],
  },
  {
    _id: '8',
    name: 'Stitched Urban Henley',
    category: 'Men',
    basePrice: 679,
    image: 'https://via.placeholder.com/350x420?text=Urban+Henley',
    description: 'Classic henley with 3-button placket and premium knit.',
    fabrics: ['cotton-blend'],
    colors: ['gray', 'navy', 'olive'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['regular'],
    stock: 7,
    reviewsData: [
      { userId: 'Bhavana Joshi', rating: 5, comment: 'Great texture and fit', createdAt: '4 days ago' },
      { userId: 'Harsh Jain', rating: 4, comment: 'Quality fabric and comfortable', createdAt: '8 days ago' },
      { userId: 'Deepa Menon', rating: 4, comment: 'Pairs well with jeans', createdAt: '1 week ago' },
      { userId: 'Mohit Sharma', rating: 5, comment: 'Exceeded expectations', createdAt: '3 days ago' },
      { userId: 'Priyanka Nair', rating: 5, comment: 'Very stylish and sturdy', createdAt: '6 days ago' },
    ],
    qa: [
      { q: 'Is this a winter wear?', a: 'Layer with jacket for cooler weather' },
      { q: 'Does it stretch?', a: 'Yes slight stretch for comfort' },
      { q: 'Has side seams?', a: 'Yes, reinforced side seams' },
    ],
  },
  {
    _id: '9',
    name: 'Stitched Comfy Crop Top',
    category: 'Women',
    basePrice: 529,
    image: 'https://via.placeholder.com/350x420?text=Comfy+Crop+Top',
    description: 'Soft crop top ideal for summer days.',
    fabrics: ['cotton'],
    colors: ['black', 'white', 'mauve'],
    sizes: ['XS', 'S', 'M', 'L'],
    fits: ['slim', 'regular'],
    stock: 3,
    reviewsData: [
      { userId: 'Latika Sharma', rating: 5, comment: 'Excellent look and fabric', createdAt: '3 days ago' },
      { userId: 'Smriti Bhatt', rating: 4, comment: 'Comfortable and stylish', createdAt: '1 week ago' },
      { userId: 'Gauri Reddy', rating: 4, comment: 'Good for casual wear', createdAt: '2 weeks ago' },
      { userId: 'Manisha Yadav', rating: 5, comment: 'Love the fit and quality', createdAt: '4 days ago' },
      { userId: 'Divya Nair', rating: 4, comment: 'Color is beautiful', createdAt: '6 days ago' },
    ],
    qa: [
      { q: 'Is the length true to picture?', a: 'Yes, mid-level crop fit' },
      { q: 'Does it roll up?', a: 'No, has a clean hem finish' },
      { q: 'Machine washable?', a: 'Yes gentle cycle only' },
    ],
  },
  {
    _id: '10',
    name: 'Stitched Longline Tee',
    category: 'Men',
    basePrice: 569,
    image: 'https://via.placeholder.com/350x420?text=Longline+Tee',
    description: 'Modern longline t-shirt with stitched hem.',
    fabrics: ['cotton'],
    colors: ['white', 'black', 'moss'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['oversized'],
    stock: 2,
    reviewsData: [
      { userId: 'Saloni Gupta', rating: 5, comment: 'Great fit and print', createdAt: '2 days ago' },
      { userId: 'Ravi K', rating: 4, comment: 'Nice style for casual hangouts', createdAt: '1 week ago' },
      { userId: 'Pavan Kumar', rating: 4, comment: 'Comfortable but longer length', createdAt: '6 days ago' },
      { userId: 'Sneha Raja', rating: 5, comment: 'Excellent material', createdAt: '8 days ago' },
      { userId: 'Nikhil Bose', rating: 5, comment: 'Best longline tee I own', createdAt: '4 days ago' },
    ],
    qa: [
      { q: 'Is it too long for short people?', a: 'It is longline; can be styled with skinny fit pants' },
      { q: 'Is it pre-shrunk?', a: 'Yes, shrinkage is minimal' },
      { q: 'Can it be used as outerwear?', a: 'Yes, great for layered outfits' },
    ],
  }
];

const colorImages = {
  black: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23000000%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  white: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23FFFFFF%22 width=%22100%22 height=%22100%22 stroke=%22%23ddd%22 stroke-width=%221%22/%3E%3C/svg%3E',
  red: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23FF0000%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  blue: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%230000FF%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  green: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23008000%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  yellow: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23FFFF00%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  gray: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23808080%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  navy: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23000080%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
  maroon: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23800000%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E',
};

// Database operations
const db = {
  // User operations
  users: {
    create: (userData) => {
      const user = {
        _id: Date.now().toString(),
        ...userData,
        loyaltyPoints: 0,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
      return user;
    },
    findByEmail: (email) => users.find(u => u.email === email),
    findById: (id) => users.find(u => u._id === id),
    updateById: (id, updates) => {
      const user = users.find(u => u._id === id);
      if (user) {
        Object.assign(user, updates, { updatedAt: new Date() });
      }
      return user;
    },
    findAll: () => users.filter(u => u.role === 'user'),
  },

  // Design operations
  designs: {
    create: (designData) => {
      const design = {
        _id: Date.now().toString(),
        ...designData,
        isSaved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      designs.push(design);
      return design;
    },
    findByUserId: (userId) => designs.filter(d => d.userId === userId && d.isSaved),
    findById: (id) => designs.find(d => d._id === id),
    deleteById: (id) => {
      const index = designs.findIndex(d => d._id === id);
      if (index !== -1) {
        designs.splice(index, 1);
        return true;
      }
      return false;
    },
  },

  // Order operations
  orders: {
    create: (orderData) => {
      const order = {
        _id: Date.now().toString(),
        ...orderData,
        status: orderData.status || 'pending',
        createdAt: orderData.createdAt || new Date(),
        updatedAt: orderData.updatedAt || new Date(),
      };
      orders.push(order);
      return order;
    },
    findByUserId: (userId) => orders.filter(o => o.userId === userId),
    findAll: () => orders,
    findById: (id) => orders.find(o => o._id === id),
    updateStatusById: (id, status) => {
      const order = orders.find(o => o._id === id);
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
      }
      return order;
    },
  },

  // Product operations
  products: {
    getAll: () => products,
    getById: (id) => products.find(p => p._id === id),
    initialize: () => products[0],
  },

  // Inventory operations
  inventory: {
    create: (itemData) => {
      const item = {
        _id: Date.now().toString(),
        ...itemData,
      };
      inventory.push(item);
      return item;
    },
    findAll: () => inventory,
    findById: (id) => inventory.find(i => i._id === id),
    updateStockById: (id, qty) => {
      const item = inventory.find(i => i._id === id);
      if (item) {
        item.stockQuantity = qty;
      }
      return item;
    },
  },

  // Analytics operations
  analytics: {
    recordOrder: (fabric, color, size, fit, totalPrice, date = null) => {
      // allow passing a custom date for seeding
      const d = date ? new Date(date) : new Date();
      d.setHours(0, 0, 0, 0);
      
      let record = analytics.find(a => {
        const aDate = new Date(a.date);
        aDate.setHours(0, 0, 0, 0);
        return aDate.getTime() === d.getTime();
      });

      if (!record) {
        record = {
          _id: Date.now().toString(),
          date: d.toISOString().split('T')[0],
          totalOrders: 0,
          totalRevenue: 0,
          itemsSold: 0,
          popularSizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
          popularColors: {},
          popularFabrics: { cotton: 0, polyester: 0, 'cotton-blend': 0 },
          popularFits: { oversized: 0, slim: 0, regular: 0 },
          averageOrderValue: 0,
        };
        analytics.push(record);
      }

      record.totalOrders += 1;
      record.totalRevenue += totalPrice;
      record.itemsSold += 1;
      record.popularSizes[size] = (record.popularSizes[size] || 0) + 1;
      record.popularFabrics[fabric] = (record.popularFabrics[fabric] || 0) + 1;
      record.popularFits[fit] = (record.popularFits[fit] || 0) + 1;
      record.popularColors[color] = (record.popularColors[color] || 0) + 1;
      record.averageOrderValue = record.totalRevenue / record.totalOrders;

      return record;
    },
    getDemandAnalytics: () => {
      const aggregated = {
        totalOrders: 0,
        totalRevenue: 0,
        totalItemsSold: 0,
        popularSizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
        popularColors: {},
        popularFabrics: { cotton: 0, polyester: 0, 'cotton-blend': 0 },
        popularFits: { oversized: 0, slim: 0, regular: 0 },
        averageOrderValue: 0,
        monthlyOrders: [], // new field
      };

      analytics.forEach(record => {
        aggregated.totalOrders += record.totalOrders;
        aggregated.totalRevenue += record.totalRevenue;
        aggregated.totalItemsSold += record.itemsSold;

        Object.keys(record.popularSizes).forEach(size => {
          aggregated.popularSizes[size] += record.popularSizes[size];
        });

        Object.keys(record.popularFabrics).forEach(fabric => {
          aggregated.popularFabrics[fabric] += record.popularFabrics[fabric];
        });

        Object.keys(record.popularFits).forEach(fit => {
          aggregated.popularFits[fit] += record.popularFits[fit];
        });

        Object.keys(record.popularColors).forEach(color => {
          aggregated.popularColors[color] = (aggregated.popularColors[color] || 0) + record.popularColors[color];
        });
      });

      aggregated.averageOrderValue = aggregated.totalOrders > 0 
        ? aggregated.totalRevenue / aggregated.totalOrders 
        : 0;

      // compute monthly orders from raw orders list for chart
      const monthly = {};
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthly[key] = (monthly[key] || 0) + 1;
      });
      aggregated.monthlyOrders = Object.entries(monthly)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));

      return aggregated;
    },
    getCustomerInsights: () => {
      const totalCustomers = users.length;
      const totalOrderCount = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const newCustomersThisMonth = users.filter(u => {
        const created = new Date(u.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth();
      }).length;
      const repeatCustomers = users.filter(u => u.loyaltyPoints > 0).length;

      return {
        totalCustomers,
        totalOrders: totalOrderCount,
        totalRevenue,
        newCustomersThisMonth,
        repeatCustomers,
        customerRetentionRate: totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(2) : 0,
        averageOrderValue: totalOrderCount > 0 ? (totalRevenue / totalOrderCount).toFixed(2) : 0,
      };
    },
  },
};


// seed dummy data on startup
const bcrypt = require('bcryptjs');

function initializeDummyData() {
  // create sample customers and required login accounts
  if (users.length === 0) {
    const requiredUsers = [
      { name: 'Demo User', email: 'user@gmail.com', password: '1234', role: 'user'},
      { name: 'Stitched Admin', email: 'admin@stitched.com', password: 'admin123', role: 'admin'},
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'user' },
      { name: 'Priya Patel', email: 'priya@example.com', password: 'password123', role: 'user' },
      { name: 'Arjun Mehta', email: 'arjun@example.com', password: 'password123', role: 'user' },
      { name: 'Sneha Shah', email: 'sneha@example.com', password: 'password123', role: 'user' },
      { name: 'Keshav Tejuja', email: 'keshav@example.com', password: 'password123', role: 'user' },
    ];

    requiredUsers.forEach(u => {
      const created = db.users.create({
        name: u.name,
        email: u.email,
        password: bcrypt.hashSync(u.password, 10),
      });
      if (u.role === 'admin') {
        created.role = 'admin';
      }
    });
  }

  // create some designs for each user
  const allUsers = db.users.findAll();
  const designIds = [];
  allUsers.forEach((u, idx) => {
    const design = db.designs.create({
      userId: u._id,
      name: `Design ${idx + 1}`,
      fabric: 'cotton',
      color: 'black',
      size: 'M',
      fit: 'regular',
      designData: {},
    });
    designIds.push(design._id);
  });

  // generate 20 dummy orders
  if (orders.length === 0) {
    const statuses = ['pending', 'in production', 'stitching', 'ready for dispatch', 'delivered'];
    for (let i = 0; i < 20; i++) {
      const user = allUsers[i % allUsers.length];
      const designId = designIds[i % designIds.length];
      const sizeOptions = ['S', 'M', 'L', 'XL'];
      const fabricOptions = ['cotton', 'organic cotton', 'polyester blend'];
      const colorOptions = ['black', 'white', 'red', 'blue', 'green'];

      // randomize createdAt within the last 90 days
      const randomOffset = Math.floor(Math.random() * 90);
      const created = new Date();
      created.setDate(created.getDate() - randomOffset);

      // compute estimated delivery date (3-10 days after created)
      const estDelivery = new Date(created);
      estDelivery.setDate(estDelivery.getDate() + 3 + Math.floor(Math.random() * 8));

      const selectedProduct = products[i % products.length];
      const quantityForOrder = Math.min(Math.max(Math.floor(Math.random() * 3) + 1, 1), selectedProduct.stock || 1);
      const totalPrice = selectedProduct.basePrice * quantityForOrder;

      const order = db.orders.create({
        orderId: `ORD10${(i + 1).toString().padStart(2, '0')}`,
        userId: user._id,
        productId: selectedProduct._id,
        designId,
        quantity: quantityForOrder,
        totalPrice,
        fabric: selectedProduct.fabrics[0],
        color: selectedProduct.colors[0],
        size: selectedProduct.sizes[0],
        fit: selectedProduct.fits[0],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
        },
        status: statuses[i % statuses.length],
        createdAt: created,
        estimatedDelivery: estDelivery,
      });

      // ensure product stock reflects existing completed orders
      const product = db.products.getById(selectedProduct._id);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - quantityForOrder);
      }

      // update analytics for each created order
      db.analytics.recordOrder(order.fabric, order.color, order.size, order.fit, order.totalPrice, order.createdAt);
    }
  }

  // create 10 inventory materials
  if (inventory.length === 0) {
    const materials = [
      'Cotton Fabric',
      'Organic Cotton',
      'Polyester Blend',
      'Collar Rib Material',
      'Thread',
      'Elastic Bands',
      'Buttons',
      'Zippers',
      'Lining Fabric',
      'Label Tags',
    ];

    materials.forEach((mat, idx) => {
      db.inventory.create({
        itemId: `MAT${1001 + idx}`,
        materialType: mat,
        color: ['white', 'black', 'blue', 'red', 'green'][idx % 5],
        stockQuantity: Math.floor(Math.random() * 100),
        minimumThreshold: 20 + Math.floor(Math.random() * 30),
      });
    });
  }
}

initializeDummyData();

module.exports = { db, products, colorImages };

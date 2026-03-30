const { db } = require('../database');

// Create order
const createOrder = (req, res) => {
  try {
    const { designId, quantity, fabric, color, size, fit, shippingAddress } = req.body;
    const userId = req.userId;

    const basePrice = 499;
    const totalPrice = basePrice * quantity;
    const orderId = `ORD-${Date.now()}`;

    // check stock and reduce
    let product = null;
    if (req.body.productId) {
      product = db.products.getById(req.body.productId);
      if (product) {
        if ((product.stock || 0) < quantity) {
          return res.status(400).json({ message: 'Not enough stock available' });
        }
        product.stock -= quantity;
      }
    }

    const order = db.orders.create({
      orderId,
      userId,
      productId: req.body.productId || null,
      designId,
      quantity,
      totalPrice,
      fabric,
      color,
      size,
      fit,
      shippingAddress,
      status: 'placed',
    });

    // Add loyalty points (5% of total price as points)
    const loyaltyPoints = Math.floor(totalPrice * 0.05);
    const user = db.users.findById(userId);
    if (user) {
      user.loyaltyPoints = (user.loyaltyPoints || 0) + loyaltyPoints;
      db.users.updateById(userId, { loyaltyPoints: user.loyaltyPoints });
    }

    // Update analytics
    db.analytics.recordOrder(fabric, color, size, fit, totalPrice);

    res.status(201).json({
      message: 'Order created successfully',
      order,
      loyaltyPointsEarned: loyaltyPoints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
const getUserOrders = (req, res) => {
  try {
    const userId = req.userId;
    const orders = db.orders.findByUserId(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
const getAllOrders = (req, res) => {
  try {
    let orders = db.orders.findAll();

    // server-side filtering
    const { status, search } = req.query;
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderId.toLowerCase().includes(term) ||
        (db.users.findById(o.userId)?.name.toLowerCase() || '').includes(term)
      );
    }

    const ordersWithUserData = orders.map(order => {
      const user = db.users.findById(order.userId);
      return {
        ...order,
        userId: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    });
    res.json(ordersWithUserData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in production', 'stitching', 'ready for dispatch', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = db.orders.updateStatusById(req.params.id, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};

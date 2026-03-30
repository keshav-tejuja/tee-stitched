const { db } = require('../database');

// Get all inventory items
const getAllInventory = (req, res) => {
  try {
    const items = db.inventory.findAll().map(item => {
      // compute status based on quantity and threshold
      let status = 'In Stock';
      if (item.stockQuantity < item.minimumThreshold) {
        status = item.stockQuantity < 20 ? 'Critical' : 'Low Stock';
      }
      return { ...item, status };
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new inventory material
const addInventoryItem = (req, res) => {
  try {
    const { itemId, materialType, color, stockQuantity, minimumThreshold } = req.body;
    const item = db.inventory.create({ itemId, materialType, color, stockQuantity, minimumThreshold });
    res.status(201).json({ message: 'Inventory item added', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stock quantity
const updateInventoryStock = (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const item = db.inventory.updateStockById(req.params.id, stockQuantity);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Stock updated', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInventory,
  addInventoryItem,
  updateInventoryStock,
};
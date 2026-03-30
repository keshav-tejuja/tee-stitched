const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getAllInventory,
  addInventoryItem,
  updateInventoryStock,
} = require('../controllers/inventoryController');

// all inventory actions - removed auth for demo
router.get('/', getAllInventory);
router.post('/', addInventoryItem);
router.patch('/:id/stock', updateInventoryStock);

module.exports = router;
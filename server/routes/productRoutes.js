const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  initializeProduct,
  updateStock,
} = require('../controllers/productController');

router.get('/init', initializeProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.patch('/:id/stock', updateStock);

module.exports = router;

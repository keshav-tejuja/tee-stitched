const { db, products } = require('../database');

// Get all products (with customization options)
const getProducts = (req, res) => {
  const allProducts = db.products.getAll();
  res.json(allProducts);
};

// Get single product
const getProduct = (req, res) => {
  const product = db.products.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

// Initialize default product
const initializeProduct = (req, res) => {
  const product = db.products.initialize();
  res.json(product);
};

const updateStock = (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock == null || isNaN(stock)) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }

    const product = db.products.getById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock = Number(stock);
    res.json({ message: 'Stock updated', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, initializeProduct, updateStock };

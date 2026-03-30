const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  saveDesign,
  getUserDesigns,
  getDesign,
  deleteDesign,
} = require('../controllers/designController');

router.post('/', authMiddleware, saveDesign);
router.get('/', authMiddleware, getUserDesigns);
router.get('/:id', authMiddleware, getDesign);
router.delete('/:id', authMiddleware, deleteDesign);

module.exports = router;

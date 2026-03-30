const { db } = require('../database');

// Create or save design
const saveDesign = (req, res) => {
  try {
    const { name, fabric, color, size, fit, designData } = req.body;
    const userId = req.userId;

    const design = db.designs.create({
      userId,
      name,
      fabric,
      color,
      size,
      fit,
      designData,
    });

    res.status(201).json({
      message: 'Design saved successfully',
      design,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's saved designs
const getUserDesigns = (req, res) => {
  try {
    const userId = req.userId;
    const designs = db.designs.findByUserId(userId);
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single design
const getDesign = (req, res) => {
  try {
    const design = db.designs.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete design
const deleteDesign = (req, res) => {
  try {
    const design = db.designs.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (design.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    db.designs.deleteById(req.params.id);
    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveDesign,
  getUserDesigns,
  getDesign,
  deleteDesign,
};

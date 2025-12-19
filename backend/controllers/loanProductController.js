const { validationResult } = require('express-validator');
const LoanProduct = require('../models/LoanProduct');

// Get all loan products
exports.getAllProducts = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const products = await LoanProduct.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
      message: 'Loan products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single loan product
exports.getProductById = async (req, res) => {
  try {
    const product = await LoanProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Loan product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Loan product retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create loan product
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const product = await LoanProduct.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Loan product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan product
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const product = await LoanProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Loan product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Loan product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete loan product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await LoanProduct.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Loan product not found'
      });
    }

    res.json({
      success: true,
      message: 'Loan product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


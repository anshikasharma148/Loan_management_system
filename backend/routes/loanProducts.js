const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const loanProductController = require('../controllers/loanProductController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', loanProductController.getAllProducts);
router.get('/:id', loanProductController.getProductById);

// Protected routes (admin only)
router.post(
  '/',
  auth,
  roleCheck('admin'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('minLTV').isFloat({ min: 0, max: 100 }).withMessage('Min LTV must be between 0 and 100'),
    body('maxLTV').isFloat({ min: 0, max: 100 }).withMessage('Max LTV must be between 0 and 100'),
    body('minInterestRate').isFloat({ min: 0 }).withMessage('Min interest rate must be positive'),
    body('maxInterestRate').isFloat({ min: 0 }).withMessage('Max interest rate must be positive'),
    body('tenureOptions').isArray({ min: 1 }).withMessage('At least one tenure option is required'),
    body('minLoanAmount').isFloat({ min: 0 }).withMessage('Min loan amount must be positive'),
    body('maxLoanAmount').isFloat({ min: 0 }).withMessage('Max loan amount must be positive')
  ],
  loanProductController.createProduct
);

router.put(
  '/:id',
  auth,
  roleCheck('admin'),
  loanProductController.updateProduct
);

router.delete(
  '/:id',
  auth,
  roleCheck('admin'),
  loanProductController.deleteProduct
);

module.exports = router;


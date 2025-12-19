const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const loanApplicationController = require('../controllers/loanApplicationController');
const auth = require('../middleware/auth');

// Get all applications (authenticated)
router.get('/', auth, loanApplicationController.getAllApplications);

// Get ongoing loans
router.get('/ongoing', auth, loanApplicationController.getOngoingLoans);

// Get single application
router.get('/:id', auth, loanApplicationController.getApplicationById);

// Create application (authenticated users)
router.post(
  '/',
  auth,
  [
    body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
    body('customerInfo.pan').trim().notEmpty().withMessage('PAN is required'),
    body('customerInfo.aadhaar').trim().notEmpty().withMessage('Aadhaar is required'),
    body('customerInfo.email').isEmail().withMessage('Valid email is required'),
    body('customerInfo.phone').trim().notEmpty().withMessage('Phone is required'),
    body('customerInfo.address').trim().notEmpty().withMessage('Address is required'),
    body('loanProductId').notEmpty().withMessage('Loan product is required'),
    body('requestedAmount').isFloat({ min: 0 }).withMessage('Requested amount must be positive'),
    body('tenure').isInt({ min: 1 }).withMessage('Tenure must be a positive integer')
  ],
  loanApplicationController.createApplication
);

// Create application via API (for fintech partners)
router.post(
  '/api',
  auth,
  [
    body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
    body('customerInfo.pan').trim().notEmpty().withMessage('PAN is required'),
    body('customerInfo.aadhaar').trim().notEmpty().withMessage('Aadhaar is required'),
    body('customerInfo.email').isEmail().withMessage('Valid email is required'),
    body('customerInfo.phone').trim().notEmpty().withMessage('Phone is required'),
    body('customerInfo.address').trim().notEmpty().withMessage('Address is required'),
    body('loanProductId').notEmpty().withMessage('Loan product is required'),
    body('requestedAmount').isFloat({ min: 0 }).withMessage('Requested amount must be positive'),
    body('tenure').isInt({ min: 1 }).withMessage('Tenure must be a positive integer')
  ],
  loanApplicationController.createApplication
);

// Update application
router.put(
  '/:id',
  auth,
  [
    body('status').optional().isIn(['pending', 'under_review', 'approved', 'rejected', 'disbursed', 'closed']).withMessage('Invalid status'),
    body('disbursedAmount').optional().isFloat({ min: 0 }).withMessage('Disbursed amount must be positive')
  ],
  loanApplicationController.updateApplication
);

module.exports = router;


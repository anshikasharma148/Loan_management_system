const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const collateralController = require('../controllers/collateralController');
const auth = require('../middleware/auth');

// Get all collaterals
router.get('/', auth, collateralController.getAllCollaterals);

// Get collaterals by loan ID
router.get('/loan/:loanId', auth, collateralController.getCollateralsByLoan);

// Get single collateral
router.get('/:id', auth, collateralController.getCollateralById);

// Create collateral
router.post(
  '/',
  auth,
  [
    body('loanApplicationId').notEmpty().withMessage('Loan application ID is required'),
    body('fundName').trim().notEmpty().withMessage('Fund name is required'),
    body('amc').trim().notEmpty().withMessage('AMC is required'),
    body('folioNumber').trim().notEmpty().withMessage('Folio number is required'),
    body('units').isFloat({ min: 0 }).withMessage('Units must be positive'),
    body('currentNAV').isFloat({ min: 0 }).withMessage('NAV must be positive')
  ],
  collateralController.createCollateral
);

// Update collateral
router.put(
  '/:id',
  auth,
  [
    body('units').optional().isFloat({ min: 0 }).withMessage('Units must be positive'),
    body('currentNAV').optional().isFloat({ min: 0 }).withMessage('NAV must be positive')
  ],
  collateralController.updateCollateral
);

// Update pledge status
router.put(
  '/:id/pledge',
  auth,
  [
    body('pledgeStatus').isIn(['pledged', 'unpledged', 'released']).withMessage('Invalid pledge status')
  ],
  collateralController.updatePledgeStatus
);

module.exports = router;


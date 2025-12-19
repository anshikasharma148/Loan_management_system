const { validationResult } = require('express-validator');
const Collateral = require('../models/Collateral');
const LoanApplication = require('../models/LoanApplication');

// Get all collaterals
exports.getAllCollaterals = async (req, res) => {
  try {
    const { loanApplicationId, pledgeStatus } = req.query;
    const filter = {};
    
    if (loanApplicationId) filter.loanApplicationId = loanApplicationId;
    if (pledgeStatus) filter.pledgeStatus = pledgeStatus;

    const collaterals = await Collateral.find(filter)
      .populate('loanApplicationId', 'applicationNumber customerInfo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: collaterals,
      message: 'Collaterals retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get collaterals by loan ID
exports.getCollateralsByLoan = async (req, res) => {
  try {
    const collaterals = await Collateral.find({ loanApplicationId: req.params.loanId })
      .populate('loanApplicationId', 'applicationNumber customerInfo');

    res.json({
      success: true,
      data: collaterals,
      message: 'Collaterals retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single collateral
exports.getCollateralById = async (req, res) => {
  try {
    const collateral = await Collateral.findById(req.params.id)
      .populate('loanApplicationId');

    if (!collateral) {
      return res.status(404).json({
        success: false,
        error: 'Collateral not found'
      });
    }

    res.json({
      success: true,
      data: collateral,
      message: 'Collateral retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create collateral
exports.createCollateral = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    // Verify loan application exists
    const loanApplication = await LoanApplication.findById(req.body.loanApplicationId);
    if (!loanApplication) {
      return res.status(400).json({
        success: false,
        error: 'Loan application not found'
      });
    }

    const collateral = await Collateral.create(req.body);

    // Update loan application collateral value
    const allCollaterals = await Collateral.find({ loanApplicationId: req.body.loanApplicationId });
    const totalCollateralValue = allCollaterals.reduce((sum, col) => sum + col.totalValue, 0);
    
    loanApplication.collateralValue = totalCollateralValue;
    await loanApplication.save();

    res.status(201).json({
      success: true,
      data: collateral,
      message: 'Collateral created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update collateral
exports.updateCollateral = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const collateral = await Collateral.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!collateral) {
      return res.status(404).json({
        success: false,
        error: 'Collateral not found'
      });
    }

    // Recalculate total value if NAV or units changed
    if (req.body.currentNAV || req.body.units) {
      collateral.totalValue = collateral.units * collateral.currentNAV;
      await collateral.save();
    }

    // Update loan application collateral value
    const loanApplication = await LoanApplication.findById(collateral.loanApplicationId);
    if (loanApplication) {
      const allCollaterals = await Collateral.find({ loanApplicationId: collateral.loanApplicationId });
      const totalCollateralValue = allCollaterals.reduce((sum, col) => sum + col.totalValue, 0);
      loanApplication.collateralValue = totalCollateralValue;
      await loanApplication.save();
    }

    res.json({
      success: true,
      data: collateral,
      message: 'Collateral updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update pledge status
exports.updatePledgeStatus = async (req, res) => {
  try {
    const { pledgeStatus } = req.body;

    if (!['pledged', 'unpledged', 'released'].includes(pledgeStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pledge status'
      });
    }

    const collateral = await Collateral.findById(req.params.id);
    if (!collateral) {
      return res.status(404).json({
        success: false,
        error: 'Collateral not found'
      });
    }

    collateral.pledgeStatus = pledgeStatus;
    if (pledgeStatus === 'pledged') {
      collateral.pledgeDate = new Date();
    } else if (pledgeStatus === 'released') {
      collateral.releaseDate = new Date();
    }

    await collateral.save();

    res.json({
      success: true,
      data: collateral,
      message: 'Pledge status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


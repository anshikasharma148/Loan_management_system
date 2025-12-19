const { validationResult } = require('express-validator');
const LoanApplication = require('../models/LoanApplication');
const LoanProduct = require('../models/LoanProduct');
const Collateral = require('../models/Collateral');
const { calculateLTV, calculateCollateralValue } = require('../utils/calculateLTV');
const generateApplicationNumber = require('../utils/generateAppNumber');

// Get all loan applications
exports.getAllApplications = async (req, res) => {
  try {
    const { status, loanProductId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (loanProductId) filter.loanProductId = loanProductId;

    const applications = await LoanApplication.find(filter)
      .populate('loanProductId', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
      message: 'Loan applications retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get ongoing loans
exports.getOngoingLoans = async (req, res) => {
  try {
    const applications = await LoanApplication.find({
      status: { $in: ['approved', 'disbursed'] }
    })
      .populate('loanProductId', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
      message: 'Ongoing loans retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single loan application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id)
      .populate('loanProductId')
      .populate('createdBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Loan application not found'
      });
    }

    // Get collaterals for this application
    const collaterals = await Collateral.find({ loanApplicationId: req.params.id });

    res.json({
      success: true,
      data: {
        application,
        collaterals
      },
      message: 'Loan application retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create loan application
exports.createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const {
      customerInfo,
      loanProductId,
      requestedAmount,
      mutualFunds,
      tenure
    } = req.body;

    // Verify loan product exists
    const loanProduct = await LoanProduct.findById(loanProductId);
    if (!loanProduct || !loanProduct.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or inactive loan product'
      });
    }

    // Calculate collateral value and LTV
    const collateralValue = calculateCollateralValue(mutualFunds || []);
    const calculatedLTV = calculateLTV(requestedAmount, collateralValue);

    // Validate LTV against product limits
    if (calculatedLTV < loanProduct.minLTV || calculatedLTV > loanProduct.maxLTV) {
      return res.status(400).json({
        success: false,
        error: `LTV ratio ${calculatedLTV.toFixed(2)}% is outside the allowed range (${loanProduct.minLTV}% - ${loanProduct.maxLTV}%)`
      });
    }

    // Validate loan amount
    if (requestedAmount < loanProduct.minLoanAmount || requestedAmount > loanProduct.maxLoanAmount) {
      return res.status(400).json({
        success: false,
        error: `Loan amount is outside the allowed range (${loanProduct.minLoanAmount} - ${loanProduct.maxLoanAmount})`
      });
    }

    // Calculate interest rate (simple linear interpolation)
    const interestRate = loanProduct.minInterestRate + 
      ((calculatedLTV - loanProduct.minLTV) / (loanProduct.maxLTV - loanProduct.minLTV)) * 
      (loanProduct.maxInterestRate - loanProduct.minInterestRate);

    // Generate application number
    let applicationNumber;
    let isUnique = false;
    while (!isUnique) {
      applicationNumber = generateApplicationNumber();
      const existing = await LoanApplication.findOne({ applicationNumber });
      if (!existing) isUnique = true;
    }

    const application = await LoanApplication.create({
      applicationNumber,
      customerInfo,
      loanProductId,
      requestedAmount,
      mutualFunds: mutualFunds || [],
      calculatedLTV,
      interestRate,
      tenure,
      collateralValue,
      createdBy: req.user?._id || req.apiClient?._id
    });

    // Create collateral records
    if (mutualFunds && mutualFunds.length > 0) {
      const collateralPromises = mutualFunds.map(fund => 
        Collateral.create({
          loanApplicationId: application._id,
          fundName: fund.fundName,
          schemeCode: fund.schemeCode,
          amc: fund.amc,
          folioNumber: fund.folioNumber,
          units: fund.units,
          currentNAV: fund.currentNAV,
          totalValue: fund.totalValue,
          pledgeStatus: 'unpledged'
        })
      );
      await Promise.all(collateralPromises);
    }

    const populatedApplication = await LoanApplication.findById(application._id)
      .populate('loanProductId')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedApplication,
      message: 'Loan application created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan application
exports.updateApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { status, disbursedAmount, disbursedDate } = req.body;

    const application = await LoanApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Loan application not found'
      });
    }

    // Update status
    if (status) {
      application.status = status;
    }

    // Update disbursement details
    if (disbursedAmount) {
      application.disbursedAmount = disbursedAmount;
    }
    if (disbursedDate) {
      application.disbursedDate = disbursedDate;
    }

    // If status is disbursed, update collateral pledge status
    if (status === 'disbursed') {
      await Collateral.updateMany(
        { loanApplicationId: application._id },
        { 
          pledgeStatus: 'pledged',
          pledgeDate: new Date()
        }
      );
    }

    await application.save();

    const updatedApplication = await LoanApplication.findById(application._id)
      .populate('loanProductId')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: updatedApplication,
      message: 'Loan application updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


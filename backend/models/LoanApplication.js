const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    pan: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    aadhaar: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  loanProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanProduct',
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  mutualFunds: [{
    fundName: String,
    schemeCode: String,
    amc: String,
    folioNumber: String,
    units: Number,
    currentNAV: Number,
    totalValue: Number
  }],
  calculatedLTV: {
    type: Number,
    min: 0,
    max: 100
  },
  interestRate: {
    type: Number,
    min: 0
  },
  tenure: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'disbursed', 'closed'],
    default: 'pending'
  },
  collateralValue: {
    type: Number,
    default: 0,
    min: 0
  },
  disbursedAmount: {
    type: Number,
    min: 0
  },
  disbursedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);


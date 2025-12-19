const mongoose = require('mongoose');

const collateralSchema = new mongoose.Schema({
  loanApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication',
    required: true
  },
  fundName: {
    type: String,
    required: true,
    trim: true
  },
  schemeCode: {
    type: String,
    trim: true
  },
  amc: {
    type: String,
    required: true,
    trim: true
  },
  folioNumber: {
    type: String,
    required: true,
    trim: true
  },
  units: {
    type: Number,
    required: true,
    min: 0
  },
  currentNAV: {
    type: Number,
    required: true,
    min: 0
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  pledgeStatus: {
    type: String,
    enum: ['pledged', 'unpledged', 'released'],
    default: 'unpledged'
  },
  pledgeDate: {
    type: Date
  },
  releaseDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collateral', collateralSchema);


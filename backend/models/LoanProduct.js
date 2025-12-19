const mongoose = require('mongoose');

const loanProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  minLTV: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxLTV: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minInterestRate: {
    type: Number,
    required: true,
    min: 0
  },
  maxInterestRate: {
    type: Number,
    required: true,
    min: 0
  },
  tenureOptions: [{
    type: Number,
    required: true
  }],
  minLoanAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxLoanAmount: {
    type: Number,
    required: true,
    min: 0
  },
  eligibilityCriteria: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanProduct', loanProductSchema);


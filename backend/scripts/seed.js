require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const LoanProduct = require('../models/LoanProduct');
const LoanApplication = require('../models/LoanApplication');
const Collateral = require('../models/Collateral');
const APIClient = require('../models/APIClient');
const crypto = require('crypto');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await LoanProduct.deleteMany({});
    await LoanApplication.deleteMany({});
    await Collateral.deleteMany({});
    await APIClient.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lamf.com',
      password: 'admin123',
      role: 'admin'
    });

    const loanOfficer = await User.create({
      name: 'Loan Officer',
      email: 'officer@lamf.com',
      password: 'officer123',
      role: 'loan_officer'
    });

    console.log('Created users...');

    // Create API client
    const clientId = 'fintech_client_001';
    const clientSecret = 'fintech_secret_123';
    const apiClient = await APIClient.create({
      clientName: 'Fintech Partner 1',
      clientId: clientId,
      clientSecret: clientSecret,
      apiKey: crypto.randomBytes(32).toString('hex'),
      isActive: true
    });

    console.log('Created API client...');
    console.log(`API Client ID: ${clientId}`);
    console.log(`API Client Secret: ${clientSecret}`);

    // Create loan products
    const product1 = await LoanProduct.create({
      name: 'Premium LAMF',
      description: 'Premium loan product with higher LTV ratio',
      minLTV: 50,
      maxLTV: 80,
      minInterestRate: 10.5,
      maxInterestRate: 15.5,
      tenureOptions: [6, 12, 18, 24, 36],
      minLoanAmount: 50000,
      maxLoanAmount: 5000000,
      eligibilityCriteria: 'Minimum collateral value of ₹1,00,000',
      isActive: true
    });

    const product2 = await LoanProduct.create({
      name: 'Standard LAMF',
      description: 'Standard loan product with moderate LTV ratio',
      minLTV: 40,
      maxLTV: 70,
      minInterestRate: 12.0,
      maxInterestRate: 17.0,
      tenureOptions: [6, 12, 24],
      minLoanAmount: 25000,
      maxLoanAmount: 2000000,
      eligibilityCriteria: 'Minimum collateral value of ₹50,000',
      isActive: true
    });

    const product3 = await LoanProduct.create({
      name: 'Basic LAMF',
      description: 'Basic loan product with lower LTV ratio',
      minLTV: 30,
      maxLTV: 60,
      minInterestRate: 13.5,
      maxInterestRate: 18.5,
      tenureOptions: [6, 12],
      minLoanAmount: 10000,
      maxLoanAmount: 1000000,
      eligibilityCriteria: 'Minimum collateral value of ₹25,000',
      isActive: true
    });

    console.log('Created loan products...');

    // Create loan applications
    const app1 = await LoanApplication.create({
      applicationNumber: 'LAMF' + Date.now().toString().slice(-8) + '001',
      customerInfo: {
        name: 'Rajesh Kumar',
        pan: 'ABCDE1234F',
        aadhaar: '123456789012',
        email: 'rajesh@example.com',
        phone: '9876543210',
        address: '123 Main Street, Mumbai, Maharashtra 400001'
      },
      loanProductId: product1._id,
      requestedAmount: 500000,
      mutualFunds: [
        {
          fundName: 'HDFC Equity Fund',
          schemeCode: 'HDFC001',
          amc: 'HDFC Mutual Fund',
          folioNumber: 'FOL001',
          units: 1000,
          currentNAV: 550,
          totalValue: 550000
        },
        {
          fundName: 'SBI Bluechip Fund',
          schemeCode: 'SBI001',
          amc: 'SBI Mutual Fund',
          folioNumber: 'FOL002',
          units: 500,
          currentNAV: 800,
          totalValue: 400000
        }
      ],
      calculatedLTV: 52.63,
      interestRate: 11.2,
      tenure: 24,
      status: 'approved',
      collateralValue: 950000,
      createdBy: loanOfficer._id
    });

    const app2 = await LoanApplication.create({
      applicationNumber: 'LAMF' + Date.now().toString().slice(-8) + '002',
      customerInfo: {
        name: 'Priya Sharma',
        pan: 'FGHIJ5678K',
        aadhaar: '987654321098',
        email: 'priya@example.com',
        phone: '9876543211',
        address: '456 Park Avenue, Delhi, Delhi 110001'
      },
      loanProductId: product2._id,
      requestedAmount: 300000,
      mutualFunds: [
        {
          fundName: 'ICICI Prudential Technology Fund',
          schemeCode: 'ICICI001',
          amc: 'ICICI Prudential Mutual Fund',
          folioNumber: 'FOL003',
          units: 2000,
          currentNAV: 250,
          totalValue: 500000
        }
      ],
      calculatedLTV: 60.0,
      interestRate: 13.5,
      tenure: 12,
      status: 'disbursed',
      collateralValue: 500000,
      disbursedAmount: 300000,
      disbursedDate: new Date(),
      createdBy: loanOfficer._id
    });

    const app3 = await LoanApplication.create({
      applicationNumber: 'LAMF' + Date.now().toString().slice(-8) + '003',
      customerInfo: {
        name: 'Amit Patel',
        pan: 'KLMNO9012P',
        aadhaar: '112233445566',
        email: 'amit@example.com',
        phone: '9876543212',
        address: '789 Business District, Bangalore, Karnataka 560001'
      },
      loanProductId: product1._id,
      requestedAmount: 800000,
      mutualFunds: [
        {
          fundName: 'Axis Long Term Equity Fund',
          schemeCode: 'AXIS001',
          amc: 'Axis Mutual Fund',
          folioNumber: 'FOL004',
          units: 1500,
          currentNAV: 600,
          totalValue: 900000
        },
        {
          fundName: 'Kotak Bluechip Fund',
          schemeCode: 'KOTAK001',
          amc: 'Kotak Mahindra Mutual Fund',
          folioNumber: 'FOL005',
          units: 800,
          currentNAV: 500,
          totalValue: 400000
        }
      ],
      calculatedLTV: 61.54,
      interestRate: 12.8,
      tenure: 36,
      status: 'under_review',
      collateralValue: 1300000,
      createdBy: loanOfficer._id
    });

    const app4 = await LoanApplication.create({
      applicationNumber: 'LAMF' + Date.now().toString().slice(-8) + '004',
      customerInfo: {
        name: 'Sneha Reddy',
        pan: 'PQRST3456U',
        aadhaar: '998877665544',
        email: 'sneha@example.com',
        phone: '9876543213',
        address: '321 Tech Park, Hyderabad, Telangana 500001'
      },
      loanProductId: product3._id,
      requestedAmount: 150000,
      mutualFunds: [
        {
          fundName: 'UTI Equity Fund',
          schemeCode: 'UTI001',
          amc: 'UTI Mutual Fund',
          folioNumber: 'FOL006',
          units: 1000,
          currentNAV: 300,
          totalValue: 300000
        }
      ],
      calculatedLTV: 50.0,
      interestRate: 15.0,
      tenure: 12,
      status: 'pending',
      collateralValue: 300000,
      createdBy: loanOfficer._id
    });

    console.log('Created loan applications...');

    // Create collaterals
    await Collateral.create({
      loanApplicationId: app1._id,
      fundName: 'HDFC Equity Fund',
      schemeCode: 'HDFC001',
      amc: 'HDFC Mutual Fund',
      folioNumber: 'FOL001',
      units: 1000,
      currentNAV: 550,
      totalValue: 550000,
      pledgeStatus: 'unpledged'
    });

    await Collateral.create({
      loanApplicationId: app1._id,
      fundName: 'SBI Bluechip Fund',
      schemeCode: 'SBI001',
      amc: 'SBI Mutual Fund',
      folioNumber: 'FOL002',
      units: 500,
      currentNAV: 800,
      totalValue: 400000,
      pledgeStatus: 'unpledged'
    });

    await Collateral.create({
      loanApplicationId: app2._id,
      fundName: 'ICICI Prudential Technology Fund',
      schemeCode: 'ICICI001',
      amc: 'ICICI Prudential Mutual Fund',
      folioNumber: 'FOL003',
      units: 2000,
      currentNAV: 250,
      totalValue: 500000,
      pledgeStatus: 'pledged',
      pledgeDate: new Date()
    });

    await Collateral.create({
      loanApplicationId: app3._id,
      fundName: 'Axis Long Term Equity Fund',
      schemeCode: 'AXIS001',
      amc: 'Axis Mutual Fund',
      folioNumber: 'FOL004',
      units: 1500,
      currentNAV: 600,
      totalValue: 900000,
      pledgeStatus: 'unpledged'
    });

    await Collateral.create({
      loanApplicationId: app3._id,
      fundName: 'Kotak Bluechip Fund',
      schemeCode: 'KOTAK001',
      amc: 'Kotak Mahindra Mutual Fund',
      folioNumber: 'FOL005',
      units: 800,
      currentNAV: 500,
      totalValue: 400000,
      pledgeStatus: 'unpledged'
    });

    await Collateral.create({
      loanApplicationId: app4._id,
      fundName: 'UTI Equity Fund',
      schemeCode: 'UTI001',
      amc: 'UTI Mutual Fund',
      folioNumber: 'FOL006',
      units: 1000,
      currentNAV: 300,
      totalValue: 300000,
      pledgeStatus: 'unpledged'
    });

    console.log('Created collaterals...');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin - Email: admin@lamf.com, Password: admin123');
    console.log('Loan Officer - Email: officer@lamf.com, Password: officer123');
    console.log(`\nAPI Client - Client ID: ${clientId}, Client Secret: ${clientSecret}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


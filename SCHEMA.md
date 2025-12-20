# Database Schema Documentation

This document provides detailed information about the database schema used in the LAMF LMS system.

## Overview

The system uses MongoDB as the database with Mongoose as the ODM (Object Document Mapper). All collections use timestamps (`createdAt` and `updatedAt`) automatically managed by Mongoose.

## Collections

### 1. Users Collection

Stores user accounts for the system (admin, loan officers, fintech partners).

**Schema:**
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, minlength: 6, hashed with bcrypt),
  role: String (enum: ['admin', 'loan_officer', 'fintech_partner'], default: 'loan_officer'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email`: Unique index

**Pre-save Hook:**
- Automatically hashes password using bcrypt before saving

**Methods:**
- `comparePassword(candidatePassword)`: Compares plain text password with hashed password

---

### 2. LoanProducts Collection

Stores different loan products with their terms and conditions.

**Schema:**
```javascript
{
  name: String (required, trimmed),
  description: String (trimmed),
  minLTV: Number (required, min: 0, max: 100),
  maxLTV: Number (required, min: 0, max: 100),
  minInterestRate: Number (required, min: 0),
  maxInterestRate: Number (required, min: 0),
  tenureOptions: [Number] (required, array of tenure in months),
  minLoanAmount: Number (required, min: 0),
  maxLoanAmount: Number (required, min: 0),
  eligibilityCriteria: String (trimmed),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Example:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Premium LAMF",
  "description": "Premium loan product with higher LTV ratio",
  "minLTV": 50,
  "maxLTV": 80,
  "minInterestRate": 10.5,
  "maxInterestRate": 15.5,
  "tenureOptions": [6, 12, 18, 24, 36],
  "minLoanAmount": 50000,
  "maxLoanAmount": 5000000,
  "eligibilityCriteria": "Minimum collateral value of ₹1,00,000",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### 3. LoanApplications Collection

Stores all loan applications submitted by customers or fintech partners.

**Schema:**
```javascript
{
  applicationNumber: String (required, unique, auto-generated),
  customerInfo: {
    name: String (required, trimmed),
    pan: String (required, uppercase, trimmed),
    aadhaar: String (required, trimmed),
    email: String (required, lowercase, trimmed),
    phone: String (required, trimmed),
    address: String (required, trimmed)
  },
  loanProductId: ObjectId (required, ref: 'LoanProduct'),
  requestedAmount: Number (required, min: 0),
  mutualFunds: [{
    fundName: String,
    schemeCode: String,
    amc: String,
    folioNumber: String,
    units: Number,
    currentNAV: Number,
    totalValue: Number
  }],
  calculatedLTV: Number (min: 0, max: 100),
  interestRate: Number (min: 0),
  tenure: Number (required, in months),
  status: String (enum: ['pending', 'under_review', 'approved', 'rejected', 'disbursed', 'closed'], default: 'pending'),
  collateralValue: Number (default: 0, min: 0),
  disbursedAmount: Number (min: 0),
  disbursedDate: Date,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `applicationNumber`: Unique index

**Status Workflow:**
1. `pending` - Initial status when application is created
2. `under_review` - Application is being reviewed by loan officer
3. `approved` - Application has been approved
4. `rejected` - Application has been rejected
5. `disbursed` - Loan amount has been disbursed
6. `closed` - Loan has been closed/paid off

**Example:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "applicationNumber": "LAMF12345678",
  "customerInfo": {
    "name": "John Doe",
    "pan": "ABCDE1234F",
    "aadhaar": "123456789012",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City, State 123456"
  },
  "loanProductId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "requestedAmount": 500000,
  "mutualFunds": [
    {
      "fundName": "HDFC Equity Fund",
      "schemeCode": "HDFC001",
      "amc": "HDFC Mutual Fund",
      "folioNumber": "FOL001",
      "units": 1000,
      "currentNAV": 550,
      "totalValue": 550000
    }
  ],
  "calculatedLTV": 52.63,
  "interestRate": 11.2,
  "tenure": 24,
  "status": "pending",
  "collateralValue": 950000,
  "createdBy": "65a1b2c3d4e5f6g7h8i9j0k3",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Collaterals Collection

Stores mutual fund units pledged as collateral for loans.

**Schema:**
```javascript
{
  loanApplicationId: ObjectId (required, ref: 'LoanApplication'),
  fundName: String (required, trimmed),
  schemeCode: String (trimmed),
  amc: String (required, trimmed),
  folioNumber: String (required, trimmed),
  units: Number (required, min: 0),
  currentNAV: Number (required, min: 0),
  totalValue: Number (required, min: 0, calculated as units * currentNAV),
  pledgeStatus: String (enum: ['pledged', 'unpledged', 'released'], default: 'unpledged'),
  pledgeDate: Date,
  releaseDate: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Pledge Status:**
- `unpledged` - Initial status, collateral not yet pledged
- `pledged` - Collateral has been pledged
- `released` - Collateral has been released after loan closure

**Example:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
  "loanApplicationId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "fundName": "HDFC Equity Fund",
  "schemeCode": "HDFC001",
  "amc": "HDFC Mutual Fund",
  "folioNumber": "FOL001",
  "units": 1000,
  "currentNAV": 550,
  "totalValue": 550000,
  "pledgeStatus": "unpledged",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 5. APIClients Collection

Stores API client credentials for fintech partners to access the API.

**Schema:**
```javascript
{
  clientName: String (required, unique, trimmed),
  clientId: String (required, unique),
  clientSecret: String (required, hashed with bcrypt),
  apiKey: String (unique, auto-generated),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `clientName`: Unique index
- `clientId`: Unique index
- `apiKey`: Unique index (sparse)

**Pre-save Hook:**
- Automatically hashes `clientSecret` using bcrypt before saving
- Generates `apiKey` if not provided

**Methods:**
- `compareSecret(candidateSecret)`: Compares plain text secret with hashed secret
- `generateApiKey()`: Generates a new API key

**Example:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
  "clientName": "Fintech Partner 1",
  "clientId": "fintech_client_001",
  "clientSecret": "$2a$10$hashedSecret...",
  "apiKey": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

## Relationships

### One-to-Many Relationships

1. **LoanProduct → LoanApplications**
   - One loan product can have many loan applications
   - Foreign key: `LoanApplication.loanProductId` → `LoanProduct._id`

2. **User → LoanApplications**
   - One user can create many loan applications
   - Foreign key: `LoanApplication.createdBy` → `User._id`

3. **LoanApplication → Collaterals**
   - One loan application can have many collaterals
   - Foreign key: `Collateral.loanApplicationId` → `LoanApplication._id`

---

## Seed Data

The seed script (`backend/scripts/seed.js`) creates the following initial data:

### Users
- **Admin**: `admin@lamf.com` / `admin123`
- **Loan Officer**: `officer@lamf.com` / `officer123`

### API Client
- **Client ID**: `fintech_client_001`
- **Client Secret**: `fintech_secret_123`

### Loan Products
- Premium LAMF (minLTV: 50%, maxLTV: 80%)
- Standard LAMF (minLTV: 40%, maxLTV: 70%)
- Basic LAMF (minLTV: 30%, maxLTV: 60%)

### Sample Loan Applications
- 4 sample applications with different statuses (pending, under_review, approved, disbursed)

### Sample Collaterals
- Multiple collateral records linked to the sample loan applications

To seed the database:
```bash
cd backend
npm run seed
```

---

## Business Logic

### LTV Calculation
```
LTV = (Requested Loan Amount / Total Collateral Value) × 100
```

### Interest Rate Calculation
The interest rate is calculated using linear interpolation based on the LTV ratio:
```
interestRate = minInterestRate + 
  ((calculatedLTV - minLTV) / (maxLTV - minLTV)) × 
  (maxInterestRate - minInterestRate)
```

### Collateral Value Calculation
```
Total Collateral Value = Σ (units × currentNAV) for all mutual funds
```

---

## Indexes and Performance

### Recommended Indexes

1. **LoanApplications**
   - `status` - For filtering by status
   - `loanProductId` - For filtering by product
   - `createdBy` - For filtering by creator
   - `createdAt` - For sorting by date

2. **Collaterals**
   - `loanApplicationId` - For finding collaterals by loan
   - `pledgeStatus` - For filtering by pledge status

3. **LoanProducts**
   - `isActive` - For filtering active products

---

## Data Validation

All collections include:
- Required field validation
- Type validation
- Range validation (for numbers)
- Enum validation (for status fields)
- Format validation (for emails, PAN, etc.)
- Unique constraint validation

---

## Security Considerations

1. **Password Hashing**: All passwords and client secrets are hashed using bcrypt with salt rounds of 10
2. **Input Sanitization**: All string inputs are trimmed and validated
3. **Email Normalization**: All emails are converted to lowercase
4. **PAN Normalization**: All PAN numbers are converted to uppercase
5. **Unique Constraints**: Critical fields like email, applicationNumber, clientId have unique indexes

---

## Migration Notes

When deploying to production:
1. Ensure all indexes are created
2. Run the seed script to create initial admin user
3. Create API clients for fintech partners
4. Set up proper backup and monitoring


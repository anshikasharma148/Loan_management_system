# LAMF LMS - Loan Management System

A full-stack Loan Management System for Non-Banking Financial Companies (NBFC) specializing in Lending Against Mutual Funds (LAMF).

## Overview

This system provides comprehensive loan management capabilities including:
- **Loan Products Management**: Define and manage different loan products with varying LTV ratios, interest rates, and terms
- **Loan Applications**: Create, track, and manage loan applications through their lifecycle
- **Ongoing Loans**: Monitor and manage active loans
- **Collateral Management**: Track mutual fund units pledged as collateral
- **Fintech API Integration**: RESTful APIs for fintech partners to create loan applications programmatically

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

## Project Structure

```
lamf-lms/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── loanProductController.js
│   │   ├── loanApplicationController.js
│   │   └── collateralController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── roleCheck.js         # Role-based access control
│   ├── models/
│   │   ├── User.js
│   │   ├── LoanProduct.js
│   │   ├── LoanApplication.js
│   │   ├── Collateral.js
│   │   └── APIClient.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── loanProducts.js
│   │   ├── loanApplications.js
│   │   └── collaterals.js
│   ├── scripts/
│   │   └── seed.js              # Database seeding script
│   ├── utils/
│   │   ├── generateAppNumber.js
│   │   └── calculateLTV.js
│   └── server.js                # Express server entry point
├── frontend/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.js
│   │   ├── page.js              # Dashboard
│   │   ├── login/
│   │   ├── loan-products/
│   │   ├── loan-applications/
│   │   │   ├── page.js
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── ongoing-loans/
│   │   ├── collaterals/
│   │   └── api-docs/
│   ├── components/              # React components
│   │   ├── Layout.js
│   │   ├── StatusBadge.js
│   │   ├── LoanProductCard.js
│   │   └── LoanApplicationCard.js
│   ├── lib/
│   │   ├── api.js               # API client functions
│   │   └── utils.js             # Utility functions
│   └── styles/
│       └── globals.css
└── README.md
```

## Database Schema

For detailed database schema documentation, see [SCHEMA.md](./SCHEMA.md).

### Quick Overview

The system uses MongoDB with the following collections:

- **Users**: Admin, loan officers, and fintech partners
- **LoanProducts**: Different loan products with LTV ratios and interest rates
- **LoanApplications**: All loan applications with customer information and mutual fund details
- **Collaterals**: Mutual fund units pledged as collateral
- **APIClients**: API client credentials for fintech partners

### Seed Data

The seed script creates:
- Admin user: `admin@lamf.com` / `admin123`
- Loan officer: `officer@lamf.com` / `officer123`
- API client: `fintech_client_001` / `fintech_secret_123`
- Sample loan products (Premium, Standard, Basic LAMF)
- Sample loan applications with different statuses
- Sample collaterals

Run the seed script:
```bash
cd backend
npm run seed
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lamf-lms
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for root, backend, and frontend.

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` file with your MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lamf_lms
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```
   This will create:
   - Admin user: `admin@lamf.com` / `admin123`
   - Loan officer: `officer@lamf.com` / `officer123`
   - Sample loan products
   - Sample loan applications
   - Sample collaterals
   - API client credentials

6. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

7. **Access the Application**
   - Open `http://localhost:3000` in your browser
   - Login with admin or loan officer credentials

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "loan_officer"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@lamf.com",
  "password": "admin123"
}
```

#### API Client Login (for Fintech Partners)
```http
POST /api/auth/api-login
Content-Type: application/json

{
  "clientId": "fintech_client_001",
  "clientSecret": "fintech_secret_123"
}
```

### Loan Products

#### Get All Products
```http
GET /api/loan-products
GET /api/loan-products?isActive=true
```

#### Get Product by ID
```http
GET /api/loan-products/:id
```

#### Create Product (Admin only)
```http
POST /api/loan-products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium LAMF",
  "description": "Premium loan product",
  "minLTV": 50,
  "maxLTV": 80,
  "minInterestRate": 10.5,
  "maxInterestRate": 15.5,
  "tenureOptions": [6, 12, 18, 24, 36],
  "minLoanAmount": 50000,
  "maxLoanAmount": 5000000,
  "eligibilityCriteria": "Minimum collateral value of ₹1,00,000"
}
```

#### Update Product (Admin only)
```http
PUT /api/loan-products/:id
Authorization: Bearer <token>
```

#### Delete Product (Admin only)
```http
DELETE /api/loan-products/:id
Authorization: Bearer <token>
```

### Loan Applications

#### Get All Applications
```http
GET /api/loan-applications
GET /api/loan-applications?status=pending
GET /api/loan-applications?loanProductId=<product_id>
Authorization: Bearer <token>
```

#### Get Ongoing Loans
```http
GET /api/loan-applications/ongoing
Authorization: Bearer <token>
```

#### Get Application by ID
```http
GET /api/loan-applications/:id
Authorization: Bearer <token>
```

#### Create Application
```http
POST /api/loan-applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerInfo": {
    "name": "John Doe",
    "pan": "ABCDE1234F",
    "aadhaar": "123456789012",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City, State 123456"
  },
  "loanProductId": "<product_id>",
  "requestedAmount": 500000,
  "tenure": 24,
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
  ]
}
```

#### Create Application via API (Fintech Partners)
```http
POST /api/loan-applications/api
Authorization: Bearer <api_client_token>
Content-Type: application/json

{
  "customerInfo": {...},
  "loanProductId": "<product_id>",
  "requestedAmount": 500000,
  "tenure": 24,
  "mutualFunds": [...]
}
```

#### Update Application
```http
PUT /api/loan-applications/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "disbursedAmount": 500000,
  "disbursedDate": "2024-01-15T00:00:00.000Z"
}
```

### Collaterals

#### Get All Collaterals
```http
GET /api/collaterals
GET /api/collaterals?loanApplicationId=<loan_id>
GET /api/collaterals?pledgeStatus=pledged
Authorization: Bearer <token>
```

#### Get Collaterals by Loan ID
```http
GET /api/collaterals/loan/:loanId
Authorization: Bearer <token>
```

#### Get Collateral by ID
```http
GET /api/collaterals/:id
Authorization: Bearer <token>
```

#### Create Collateral
```http
POST /api/collaterals
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanApplicationId": "<loan_id>",
  "fundName": "HDFC Equity Fund",
  "schemeCode": "HDFC001",
  "amc": "HDFC Mutual Fund",
  "folioNumber": "FOL001",
  "units": 1000,
  "currentNAV": 550
}
```

#### Update Collateral
```http
PUT /api/collaterals/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "units": 1200,
  "currentNAV": 560
}
```

#### Update Pledge Status
```http
PUT /api/collaterals/:id/pledge
Authorization: Bearer <token>
Content-Type: application/json

{
  "pledgeStatus": "pledged"
}
```

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Example API Responses

### Create Loan Application Response
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "applicationNumber": "LAMF12345678",
    "customerInfo": {
      "name": "John Doe",
      "pan": "ABCDE1234F",
      "aadhaar": "123456789012",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Main St, City, State 123456"
    },
    "loanProductId": {
      "_id": "...",
      "name": "Premium LAMF"
    },
    "requestedAmount": 500000,
    "calculatedLTV": 52.63,
    "interestRate": 11.2,
    "tenure": 24,
    "status": "pending",
    "collateralValue": 950000,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Loan application created successfully"
}
```

## Features

### 1. Loan Products Management
- Create, view, update, and delete loan products
- Define LTV ranges, interest rates, tenure options
- Set minimum and maximum loan amounts
- Active/inactive product status

### 2. Loan Applications
- Create new loan applications with customer information
- Automatic LTV calculation based on mutual fund values
- Interest rate calculation based on LTV ratio
- Application status workflow: pending → under_review → approved → disbursed → closed
- View all applications with filtering options

### 3. Ongoing Loans
- Track all active loans (approved and disbursed)
- Monitor loan status and collateral values

### 4. Collateral Management
- Track mutual fund units pledged as collateral
- Update NAV and units
- Manage pledge status (pledged, unpledged, released)
- View collaterals by loan application

### 5. Fintech API Integration
- RESTful API endpoints for programmatic loan application creation
- JWT-based authentication for API clients
- Comprehensive error handling and validation
- API documentation page in the frontend

## User Roles

- **Admin**: Full access to all features, can manage loan products
- **Loan Officer**: Can create and manage loan applications, view all data
- **Fintech Partner**: API access only, can create loan applications via API

## Deployment

### Backend Deployment (Render)
1. Connect your repository to Render
2. Create a new Web Service
3. Set the following environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRES_IN` - Token expiration (default: 7d)
   - `NODE_ENV` - Set to `production`
   - `RENDER_EXTERNAL_URL` - Will be automatically set by Render
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. The server includes a keep-alive mechanism to prevent sleeping

**Live Backend:** https://loan-management-system-xcuu.onrender.com

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://loan-management-system-xcuu.onrender.com/api`
3. Deploy

**Live Frontend:** https://loan-management-system-beryl.vercel.app

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- API endpoints are protected with authentication middleware
- Role-based access control for sensitive operations
- Input validation on all API endpoints

## Future Enhancements

- Email notifications for application status changes
- PDF generation for loan documents
- Integration with mutual fund APIs for real-time NAV
- Payment tracking and EMI management
- Advanced reporting and analytics
- Mobile app support

## License

This project is created for assignment purposes.

## Contact

For questions or support, please refer to the project documentation or contact the development team.


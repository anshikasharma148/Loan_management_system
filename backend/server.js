const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const keepAlive = require('./utils/keepAlive');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://loan-management-system-beryl.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/loan-products', require('./routes/loanProducts'));
app.use('/api/loan-applications', require('./routes/loanApplications'));
app.use('/api/collaterals', require('./routes/collaterals'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LAMF LMS API is running',
    timestamp: new Date().toISOString()
  });
});

// Keep-alive endpoint (for Render server to prevent sleeping)
app.get('/api/keep-alive', (req, res) => {
  res.json({
    success: true,
    message: 'Server is awake',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start keep-alive mechanism to prevent Render from sleeping
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    keepAlive();
  }
});


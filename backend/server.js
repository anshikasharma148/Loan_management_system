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

// CORS Configuration - Allow all Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (preview and production)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific production frontend
    if (origin === 'https://loan-management-system-beryl.vercel.app') {
      return callback(null, true);
    }
    
    // Allow all origins for now (for demo purposes)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

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


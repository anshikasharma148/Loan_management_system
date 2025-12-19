const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const apiClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  clientId: {
    type: String,
    required: true,
    unique: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash client secret before saving
apiClientSchema.pre('save', async function(next) {
  if (!this.isModified('clientSecret')) return next();
  this.clientSecret = await bcrypt.hash(this.clientSecret, 10);
  next();
});

// Generate API key
apiClientSchema.methods.generateApiKey = function() {
  this.apiKey = crypto.randomBytes(32).toString('hex');
  return this.apiKey;
};

// Compare client secret
apiClientSchema.methods.compareSecret = async function(candidateSecret) {
  return await bcrypt.compare(candidateSecret, this.clientSecret);
};

module.exports = mongoose.model('APIClient', apiClientSchema);


const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 200 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  message: { 
    type: String, 
    required: true, 
    maxlength: 5000 
  },
  ip: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

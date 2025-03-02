const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  phonenumber: {
    type: String, // ✅ جعله String لحفظ 11 رقمًا بشكل دقيق
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v); // ✅ تأكد أن الرقم مكون من 11 خانة
      },
    }
  },

  role: { 
    type: String, 
    enum: ['customer', 'delivery', 'admin'],
    required: true
  },

  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'
  },

  address: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

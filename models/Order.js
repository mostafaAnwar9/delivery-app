const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderText: { type: String, required: true },

    location: { 
        latitude: { type: Number, required: true }, 
        longitude: { type: Number, required: true }, 
        address: { type: String, required: true },
    },

    status: {type: String, 
        enum: ['Pending','Accepted','Delivered'], 
        default: 'Pending'},

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

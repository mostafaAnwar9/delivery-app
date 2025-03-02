const express = require('express');
const Order = require('../models/Order');  // ✅ استيراد نموذج الطلب

module.exports = (io) => {
    const router = express.Router();

    // 🟢 جلب جميع الطلبات
    router.get('/', async (req, res) => {
        try {
            const orders = await Order.find();
            const formattedOrders = orders.map(order => ({
                id: order._id,
                orderText: order.orderText,
                location: order.location,
                status: order.status,
                createdAt: new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Africa/Cairo' })
            }));
            res.status(200).json(formattedOrders);
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // 🟢 جلب الطلبات النشطة فقط (Pending & Accepted)
    router.get('/active', async (req, res) => {
        try {
            const activeOrders = await Order.find({ status: { $in: ['Pending', 'Accepted'] } });
            res.status(200).json(activeOrders);
        } catch (error) {
            console.error("❌ Error fetching active orders:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // 🟢 إنشاء طلب جديد
    router.post('/', async (req, res) => {
        try {
            const { orderText, location } = req.body;
            if (!orderText || !location || !location.latitude || !location.longitude || !location.address) {
                return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
            }
            const newOrder = new Order({ orderText, location, status: 'Pending' });
            await newOrder.save();
            io.emit('new_order', newOrder);
            res.status(201).json({ message: 'تم إنشاء الطلب بنجاح', order: newOrder });
        } catch (err) {
            console.error("❌ Error creating order:", err);
            res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطلب', error: err.message });
        }
    });

    return router;
};

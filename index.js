const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/env', (req, res) => {
    res.json({
        BACKEND_URL: process.env.BACKEND_URL,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        FIREBASE_KEY: process.env.FIREBASE_KEY
    });
});

const server = http.createServer(app);

const io = socketIo(server, { 
    cors: { origin: "*" },
    path: "/socket.io/"
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const orderRoutes = require('./routes/orders')(io);
app.use('/orders', orderRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the delivery app backend');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./BACKEND/config/db');
const { initSocket } = require('./BACKEND/socket');

// Log environment check
console.log(`🔍 MONGO_URI is: ${process.env.MONGO_URI ? 'SET (' + process.env.MONGO_URI.substring(0, 20) + '...)' : '❌ NOT SET'}`);
console.log(`🔍 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for debugging)
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
        server: 'running',
        database: states[dbState] || 'unknown',
        mongoUri: process.env.MONGO_URI ? 'set' : 'NOT SET',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'FRONTEND')));
app.use('/uploads', express.static(path.join(__dirname, 'BACKEND/uploads')));

// API Routes
app.use('/api/auth', require('./BACKEND/routes/auth'));
app.use('/api/posts', require('./BACKEND/routes/posts'));
app.use('/api/users', require('./BACKEND/routes/users'));
app.use('/api/chat', require('./BACKEND/routes/chat'));

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FRONTEND', 'index.html'));
});

// Initialize Socket.IO
initSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🎨 ═══════════════════════════════════════`);
    console.log(`   Artisan Hub Server Running`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`═══════════════════════════════════════════\n`);
});

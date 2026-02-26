require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { initSocket } = require('./BACKEND/socket');

// Log environment check
console.log(`🔍 MONGO_URI is: ${process.env.MONGO_URI ? 'SET (' + process.env.MONGO_URI.substring(0, 25) + '...)' : '❌ NOT SET'}`);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
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

// Start server and connect to MongoDB
const PORT = process.env.PORT || 3000;

async function startServer() {
    // Start Express first so the app is reachable
    server.listen(PORT, () => {
        console.log(`\n🎨 ═══════════════════════════════════════`);
        console.log(`   Artisan Hub Server Running`);
        console.log(`   http://localhost:${PORT}`);
        console.log(`═══════════════════════════════════════════\n`);
    });

    // Then connect to MongoDB
    if (!process.env.MONGO_URI) {
        console.error('⚠️  MONGO_URI not set. Database features will not work.');
        return;
    }

    const mongoOptions = {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        family: 4,  // Force IPv4 (fixes DNS issues on some cloud platforms)
    };

    // Try connecting with retries
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            console.log(`🔄 MongoDB connection attempt ${attempt}/5...`);
            await mongoose.connect(process.env.MONGO_URI, mongoOptions);
            console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
            return; // Success!
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
            if (attempt < 5) {
                console.log(`⏳ Waiting 5 seconds before retry...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }

    console.error(`\n⚠️  Could not connect to MongoDB after 5 attempts.`);
    console.error(`   The server is running but database features won't work.`);
    console.error(`   Check your MONGO_URI, Atlas Network Access (0.0.0.0/0), and credentials.\n`);
}

startServer();

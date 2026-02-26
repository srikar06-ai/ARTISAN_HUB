require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./BACKEND/config/db');
const { initSocket } = require('./BACKEND/socket');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

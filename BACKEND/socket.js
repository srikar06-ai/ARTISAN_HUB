const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const onlineUsers = new Map();

function initSocket(io) {
    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // User joins with their userId
        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId;
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            console.log(`👤 User ${userId} is online`);
        });

        // Join a conversation room
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
        });

        // Send message (encrypted content)
        socket.on('sendMessage', async (data) => {
            try {
                const { conversationId, senderId, encryptedContent, iv, senderName, senderAvatar } = data;

                // Save to DB
                const message = await Message.create({
                    conversation: conversationId,
                    sender: senderId,
                    encryptedContent,
                    iv
                });

                // Update conversation
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: '🔒 Encrypted message',
                    lastMessageAt: new Date()
                });

                // Emit to the conversation room
                io.to(conversationId).emit('newMessage', {
                    _id: message._id,
                    conversation: conversationId,
                    sender: {
                        _id: senderId,
                        name: senderName,
                        avatar: senderAvatar
                    },
                    encryptedContent,
                    iv,
                    createdAt: message.createdAt
                });
            } catch (error) {
                console.error('Message error:', error);
            }
        });

        // Typing indicator
        socket.on('typing', (data) => {
            socket.to(data.conversationId).emit('userTyping', {
                userId: data.userId,
                name: data.name
            });
        });

        socket.on('stopTyping', (data) => {
            socket.to(data.conversationId).emit('userStopTyping', {
                userId: data.userId
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
}

module.exports = { initSocket };

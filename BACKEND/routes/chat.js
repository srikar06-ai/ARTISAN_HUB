const express = require('express');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/chat/conversation — Start or get existing conversation
router.post('/conversation', protect, async (req, res) => {
    try {
        const { participantId } = req.body;

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, participantId] }
        }).populate('participants', 'name avatar role isVerified');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, participantId]
            });
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'name avatar role isVerified');
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/chat/conversations — List all conversations for the user
router.get('/conversations', protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'name avatar role isVerified')
            .sort({ lastMessageAt: -1 });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/chat/messages/:conversationId — Get messages in a conversation
router.get('/messages/:conversationId', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            conversation: req.params.conversationId
        })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/chat/messages — Send message (encrypted)
router.post('/messages', protect, async (req, res) => {
    try {
        const { conversationId, encryptedContent, iv } = req.body;

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            encryptedContent,
            iv
        });

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: '🔒 Encrypted message',
            lastMessageAt: new Date()
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

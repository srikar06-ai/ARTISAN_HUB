const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../BACKEND/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname || mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image and video files are allowed'));
    }
});

// POST /api/posts — Create a post
router.post('/', protect, upload.single('media'), async (req, res) => {
    try {
        const { type, content, tags } = req.body;
        const postData = {
            author: req.user._id,
            type: type || 'text',
            content: content || '',
            tags: tags ? tags.split(',').map(t => t.trim()) : []
        };

        if (req.file) {
            postData.mediaUrl = `/uploads/${req.file.filename}`;
        }

        const post = await Post.create(postData);
        const populatedPost = await Post.findById(post._id).populate('author', 'name avatar role isVerified');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/posts — Feed (paginated)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'name avatar role isVerified')
            .populate('comments.user', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.json({ posts, page, pages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/posts/user/:userId — Posts by a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name avatar role isVerified')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/posts/:id/like — Toggle like
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            post.likes.push(req.user._id);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/posts/:id/comment — Add comment
router.post('/:id/comment', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = { user: req.user._id, text: req.body.text };
        post.comments.push(comment);
        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('comments.user', 'name avatar');

        res.json(updatedPost.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

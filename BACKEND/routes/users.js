const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/users — Search & Explore users
router.get('/', async (req, res) => {
    try {
        const { search, role, skill, page = 1, limit = 20 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;
        if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({ users, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/:id — Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/profile — Update profile (protected)
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, bio, skills, location, website, socialLinks, avatar, banner, publicKey } = req.body;

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        if (location !== undefined) user.location = location;
        if (website !== undefined) user.website = website;
        if (socialLinks) user.socialLinks = socialLinks;
        if (avatar) user.avatar = avatar;
        if (banner) user.banner = banner;
        if (publicKey) user.publicKey = publicKey;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            avatar: updatedUser.avatar,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            location: updatedUser.location
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/:id/follow — Follow/Unfollow
router.put('/:id/follow', protect, async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        const isFollowing = currentUser.following.includes(req.params.id);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user._id.toString());
        } else {
            currentUser.following.push(req.params.id);
            targetUser.followers.push(req.user._id);
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ following: !isFollowing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

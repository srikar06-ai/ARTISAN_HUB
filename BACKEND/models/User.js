const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['artist', 'production_company'], default: 'artist' },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    banner: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    companyRegNumber: { type: String, default: '' },
    publicKey: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    website: { type: String, default: '' },
    socialLinks: {
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
        twitter: { type: String, default: '' }
    }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

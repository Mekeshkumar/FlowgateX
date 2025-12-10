import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        // Basic Information
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[\d\s-]{10,}$/, 'Please provide a valid phone number'],
        },

        // Profile Information
        avatar: {
            type: String,
            default: '',
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },

        // Role & Permissions
        role: {
            type: String,
            enum: ['user', 'organizer', 'admin'],
            default: 'user',
        },

        // Account Status
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },

        // Security
        emailVerificationToken: String,
        emailVerificationExpire: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lastLogin: Date,

        // Preferences
        preferences: {
            newsletter: {
                type: Boolean,
                default: false,
            },
            notifications: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
            },
            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },
        },

        // Statistics
        eventsAttended: {
            type: Number,
            default: 0,
        },
        eventsOrganized: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpire;
    return user;
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;

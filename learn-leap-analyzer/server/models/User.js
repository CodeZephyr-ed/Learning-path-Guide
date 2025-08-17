const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    company: {
      type: String,
      maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    github: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
        'Please enter a valid GitHub profile URL'
      ]
    },
    twitter: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
        'Please enter a valid Twitter profile URL'
      ]
    },
    linkedin: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9-]+\/?$/,
        'Please enter a valid LinkedIn profile URL'
      ]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    },
    avatar: {
      type: String,
      default: 'default.jpg'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire - 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire - 24 hours
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Cascade delete user skills when a user is deleted
UserSchema.pre('remove', async function (next) {
  await this.model('UserSkills').deleteMany({ userId: this._id });
  next();
});

// Virtual for user's skills
UserSchema.virtual('skills', {
  ref: 'UserSkills',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

module.exports = mongoose.model('User', UserSchema);

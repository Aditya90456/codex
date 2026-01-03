const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  website: {
    type: String,
    maxlength: 200,
    default: ''
  },
  github: {
    type: String,
    maxlength: 100,
    default: ''
  },
  linkedin: {
    type: String,
    maxlength: 200,
    default: ''
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'],
    default: 'Beginner'
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastSolvedDate: { type: Date, default: null }
  },
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    easyProblems: { type: Number, default: 0 },
    mediumProblems: { type: Number, default: 0 },
    hardProblems: { type: Number, default: 0 },
    favoriteLanguage: { type: String, default: 'javascript' },
    averageRuntime: { type: Number, default: 0 },
    totalCodeLines: { type: Number, default: 0 }
  },
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
    language: { type: String, default: 'javascript' },
    fontSize: { type: Number, default: 14 },
    tabSize: { type: Number, default: 2 },
    wordWrap: { type: Boolean, default: true },
    minimap: { type: Boolean, default: true },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      contests: { type: Boolean, default: true }
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLoginAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ points: -1 });
userSchema.index({ 'stats.problemsSolved': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for acceptance rate
userSchema.virtual('acceptanceRate').get(function() {
  if (this.stats.totalSubmissions === 0) return 0;
  return Math.round((this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100);
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update level based on points
userSchema.pre('save', function(next) {
  if (this.isModified('points')) {
    if (this.points >= 10000) this.level = 'Master';
    else if (this.points >= 5000) this.level = 'Expert';
    else if (this.points >= 2000) this.level = 'Advanced';
    else if (this.points >= 500) this.level = 'Intermediate';
    else this.level = 'Beginner';
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate auth token method
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      userId: this._id, 
      username: this.username,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Add points method
userSchema.methods.addPoints = function(points, reason = 'Problem solved') {
  this.points += points;
  
  // Update streak if solving today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (reason === 'Problem solved') {
    const lastSolved = this.streak.lastSolvedDate;
    if (!lastSolved) {
      this.streak.current = 1;
    } else {
      const lastSolvedDate = new Date(lastSolved);
      lastSolvedDate.setHours(0, 0, 0, 0);
      
      const daysDiff = (today - lastSolvedDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        this.streak.current += 1;
      } else if (daysDiff > 1) {
        this.streak.current = 1;
      }
      // If daysDiff === 0, don't change streak (already solved today)
    }
    
    this.streak.longest = Math.max(this.streak.longest, this.streak.current);
    this.streak.lastSolvedDate = new Date();
  }
  
  return this.save();
};

// Get public profile method
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    website: this.website,
    github: this.github,
    linkedin: this.linkedin,
    points: this.points,
    level: this.level,
    streak: this.streak,
    stats: this.stats,
    achievements: this.achievements,
    acceptanceRate: this.acceptanceRate,
    joinedAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
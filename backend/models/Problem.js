const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    c: String,
    go: String,
    rust: String,
    typescript: String
  },
  solution: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    explanation: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expected: mongoose.Schema.Types.Mixed,
    isHidden: { type: Boolean, default: false }
  }],
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    averageRuntime: { type: Number, default: 0 },
    memoryUsage: { type: Number, default: 0 }
  },
  points: {
    easy: { type: Number, default: 10 },
    medium: { type: Number, default: 25 },
    hard: { type: Number, default: 50 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  editorialContent: {
    approach: String,
    intuition: String,
    algorithm: String,
    implementation: String,
    complexity: String
  },
  relatedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  companies: [String], // Companies that have asked this problem
  frequency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes
problemSchema.index({ difficulty: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ slug: 1 });
problemSchema.index({ isActive: 1 });
problemSchema.index({ 'stats.acceptanceRate': -1 });
problemSchema.index({ createdAt: -1 });

// Virtual for points based on difficulty
problemSchema.virtual('pointsReward').get(function() {
  return this.points[this.difficulty.toLowerCase()] || 10;
});

// Pre-save middleware to generate slug
problemSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Update acceptance rate when stats change
problemSchema.pre('save', function(next) {
  if (this.isModified('stats.totalSubmissions') || this.isModified('stats.acceptedSubmissions')) {
    if (this.stats.totalSubmissions > 0) {
      this.stats.acceptanceRate = Math.round(
        (this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100
      );
    }
  }
  next();
});

// Method to get public problem data (without solutions)
problemSchema.methods.getPublicData = function() {
  const problem = this.toObject();
  delete problem.solution;
  delete problem.testCases;
  return problem;
};

// Method to get problem for solving (with starter code but no solution)
problemSchema.methods.getForSolving = function() {
  const problem = this.toObject();
  delete problem.solution;
  // Only return visible test cases
  problem.testCases = problem.testCases.filter(tc => !tc.isHidden);
  return problem;
};

// Static method to get random problem
problemSchema.statics.getRandomProblem = function(difficulty = null, category = null) {
  const query = { isActive: true };
  if (difficulty) query.difficulty = difficulty;
  if (category) query.category = category;
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

// Static method to get trending problems
problemSchema.statics.getTrendingProblems = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.totalSubmissions': -1, frequency: -1 })
    .limit(limit)
    .select('-solution -testCases');
};

module.exports = mongoose.model('Problem', problemSchema);
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript']
  },
  status: {
    type: String,
    required: true,
    enum: [
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Memory Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
      'Output Limit Exceeded'
    ]
  },
  runtime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  testResults: [{
    input: mongoose.Schema.Types.Mixed,
    expected: mongoose.Schema.Types.Mixed,
    actual: mongoose.Schema.Types.Mixed,
    passed: Boolean,
    error: String,
    runtime: Number
  }],
  totalTests: {
    type: Number,
    default: 0
  },
  passedTests: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  isFirstAccepted: {
    type: Boolean,
    default: false
  },
  codeLength: {
    type: Number,
    default: 0
  },
  submissionNumber: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ language: 1 });
submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ isPublic: 1, likes: -1 });

// Virtual for acceptance rate
submissionSchema.virtual('acceptanceRate').get(function() {
  if (this.totalTests === 0) return 0;
  return Math.round((this.passedTests / this.totalTests) * 100);
});

// Virtual for like count
submissionSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Pre-save middleware to calculate code length
submissionSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    this.codeLength = this.code.length;
  }
  next();
});

// Method to check if user liked this submission
submissionSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Method to toggle like
submissionSchema.methods.toggleLike = function(userId) {
  const existingLikeIndex = this.likes.findIndex(
    like => like.user.toString() === userId.toString()
  );
  
  if (existingLikeIndex > -1) {
    this.likes.splice(existingLikeIndex, 1);
    return false; // unliked
  } else {
    this.likes.push({ user: userId });
    return true; // liked
  }
};

// Method to add comment
submissionSchema.methods.addComment = function(userId, content) { 
  this.comments.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Static method to get user's best submission for a problem
submissionSchema.statics.getBestSubmission = function(userId, problemId) {
  return this.findOne({
    user: userId,
    problem: problemId,
    status: 'Accepted'
  }).sort({ runtime: 1, memory: 1, createdAt: 1 });
};

// Static method to get leaderboard for a problem
submissionSchema.statics.getLeaderboard = function(problemId, limit = 10) {
  return this.aggregate([
    {
      $match: {
        problem: new mongoose.Types.ObjectId(problemId),
        status: 'Accepted'
      }
    },
    {
      $sort: { runtime: 1, memory: 1, createdAt: 1 }
    },
    {
      $group: {
        _id: '$user',
        bestSubmission: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$bestSubmission' }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        runtime: 1,
        memory: 1,
        language: 1,
        createdAt: 1,
        'userInfo.username': 1,
        'userInfo.avatar': 1,
        'userInfo.level': 1
      }
    }
  ]);
};

// Static method to get user statistics
submissionSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
        },
        averageRuntime: { $avg: '$runtime' },
        totalCodeLines: { $sum: { $size: { $split: ['$code', '\n'] } } },
        languageStats: {
          $push: '$language'
        },
        recentSubmissions: {
          $push: {
            problem: '$problem',
            status: '$status',
            createdAt: '$createdAt',
            runtime: '$runtime'
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Submission', submissionSchema);
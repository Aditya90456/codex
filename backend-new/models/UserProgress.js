const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'attempted', 'solved', 'reviewed'],
    default: 'not_started'
  },
  attempts: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  firstSolvedAt: {
    type: Date,
    default: null
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  solutions: [{
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp'],
      required: true
    },
    code: {
      type: String,
      required: true
    },
    runtime: {
      type: Number, // in milliseconds
      default: null
    },
    memory: {
      type: Number, // in MB
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index for user-problem uniqueness
userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Indexes for performance
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ userId: 1, difficulty: 1 });
userProgressSchema.index({ userId: 1, category: 1 });
userProgressSchema.index({ userId: 1, firstSolvedAt: 1 });
userProgressSchema.index({ lastAttemptAt: -1 });

// Update user stats when progress changes
userProgressSchema.post('save', async function(doc) {
  try {
    const User = mongoose.model('User');
    const UserProgress = mongoose.model('UserProgress');
    
    // Calculate user statistics
    const stats = await UserProgress.aggregate([
      { $match: { userId: doc.userId } },
      {
        $group: {
          _id: '$userId',
          totalProblems: { $sum: 1 },
          solvedProblems: {
            $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] }
          },
          easySolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Easy'] }] }, 
                1, 0
              ]
            }
          },
          mediumSolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Medium'] }] }, 
                1, 0
              ]
            }
          },
          hardSolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Hard'] }] }, 
                1, 0
              ]
            }
          },
          totalAttempts: { $sum: '$attempts' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    if (stats.length > 0) {
      const userStats = stats[0];
      
      // Calculate streak
      const recentSolved = await UserProgress.find({
        userId: doc.userId,
        status: 'solved',
        firstSolvedAt: { $exists: true }
      }).sort({ firstSolvedDate: -1 }).limit(30);

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const progress of recentSolved) {
        const solvedDate = new Date(progress.firstSolvedAt);
        solvedDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate - solvedDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Update user stats
      await User.findByIdAndUpdate(doc.userId, {
        'stats.problemsSolved': userStats.solvedProblems,
        'stats.totalSubmissions': userStats.totalAttempts,
        'stats.acceptedSubmissions': userStats.solvedProblems,
        'stats.streak': streak,
        'stats.lastSolvedDate': doc.status === 'solved' ? doc.firstSolvedAt : undefined,
        'stats.easySolved': userStats.easySolved,
        'stats.mediumSolved': userStats.mediumSolved,
        'stats.hardSolved': userStats.hardSolved,
        'stats.totalTimeSpent': userStats.totalTimeSpent
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
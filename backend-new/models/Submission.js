const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp'],
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    required: true
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
    testCase: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Passed', 'Failed', 'Error'],
      required: true
    },
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    actualOutput: mongoose.Schema.Types.Mixed,
    runtime: Number,
    error: String
  }],
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for performance
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ language: 1 });

// Calculate score based on test results
submissionSchema.pre('save', function(next) {
  if (this.testResults && this.testResults.length > 0) {
    const passedTests = this.testResults.filter(result => result.status === 'Passed').length;
    this.score = Math.round((passedTests / this.testResults.length) * 100);
  }
  next();
});

module.exports = mongoose.model('Submission', submissionSchema);
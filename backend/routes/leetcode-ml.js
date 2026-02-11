const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// ML-powered LeetCode addiction system
class LeetCodeMLEngine {
  constructor() {
    this.userDataFile = path.join(__dirname, '../data/user-ml-data.json');
    this.problemsDataFile = path.join(__dirname, '../data/problems-ml-data.json');
    this.streakMultiplier = 1.5;
    this.difficultyWeights = { Easy: 1, Medium: 2, Hard: 3 };
    this.addictionFactors = {
      streakBonus: 0.3,
      difficultyProgression: 0.25,
      timeOfDay: 0.2,
      weeklyPattern: 0.15,
      personalizedRecommendations: 0.1
    };
  }

  async ensureDataFiles() {
    const dataDir = path.join(__dirname, '../data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Initialize user data file
    try {
      await fs.access(this.userDataFile);
    } catch {
      await fs.writeFile(this.userDataFile, JSON.stringify({}));
    }

    // Initialize problems data file
    try {
      await fs.access(this.problemsDataFile);
    } catch {
      await fs.writeFile(this.problemsDataFile, JSON.stringify({}));
    }
  }

  async getUserData(userId) {
    await this.ensureDataFiles();
    const data = JSON.parse(await fs.readFile(this.userDataFile, 'utf8'));
    return data[userId] || this.createNewUserProfile(userId);
  }

  async saveUserData(userId, userData) {
    await this.ensureDataFiles();
    const data = JSON.parse(await fs.readFile(this.userDataFile, 'utf8'));
    data[userId] = userData;
    await fs.writeFile(this.userDataFile, JSON.stringify(data, null, 2));
  }

  createNewUserProfile(userId) {
    return {
      userId,
      level: 1,
      xp: 0,
      streak: 0,
      longestStreak: 0,
      totalProblems: 0,
      problemsByDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      solvingPatterns: {
        timeOfDay: {},
        dayOfWeek: {},
        problemTypes: {},
        languages: {}
      },
      preferences: {
        favoriteTopics: [],
        preferredDifficulty: 'Easy',
        learningGoals: []
      },
      achievements: [],
      lastActive: new Date().toISOString(),
      addictionScore: 0,
      engagementMetrics: {
        dailyGoal: 1,
        weeklyGoal: 7,
        monthlyGoal: 30,
        currentDailyStreak: 0,
        currentWeeklyStreak: 0
      }
    };
  }

  calculateAddictionScore(userData) {
    const now = new Date();
    const lastActive = new Date(userData.lastActive);
    const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);

    let score = 0;

    // Streak bonus (higher streak = more addictive)
    score += userData.streak * this.addictionFactors.streakBonus * 10;

    // Difficulty progression (solving harder problems = more engagement)
    const difficultyScore = 
      userData.problemsByDifficulty.Easy * 1 +
      userData.problemsByDifficulty.Medium * 3 +
      userData.problemsByDifficulty.Hard * 5;
    score += difficultyScore * this.addictionFactors.difficultyProgression;

    // Recency factor (recent activity = higher addiction)
    if (daysSinceActive < 1) score *= 1.5;
    else if (daysSinceActive < 3) score *= 1.2;
    else if (daysSinceActive > 7) score *= 0.5;

    // Level progression bonus
    score += userData.level * 5;

    return Math.min(Math.max(score, 0), 100);
  }

  async updateUserProgress(userId, problemData) {
    const userData = await this.getUserData(userId);
    const now = new Date();

    // Update basic stats
    userData.totalProblems++;
    userData.problemsByDifficulty[problemData.difficulty]++;
    userData.xp += this.difficultyWeights[problemData.difficulty] * 10;

    // Update streak
    const lastActiveDate = new Date(userData.lastActive).toDateString();
    const todayDate = now.toDateString();
    
    if (lastActiveDate !== todayDate) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActiveDate === yesterday.toDateString()) {
        userData.streak++;
      } else {
        userData.streak = 1;
      }
      
      userData.longestStreak = Math.max(userData.longestStreak, userData.streak);
    }

    // Update solving patterns
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    userData.solvingPatterns.timeOfDay[hour] = (userData.solvingPatterns.timeOfDay[hour] || 0) + 1;
    userData.solvingPatterns.dayOfWeek[dayOfWeek] = (userData.solvingPatterns.dayOfWeek[dayOfWeek] || 0) + 1;
    userData.solvingPatterns.problemTypes[problemData.category] = (userData.solvingPatterns.problemTypes[problemData.category] || 0) + 1;
    userData.solvingPatterns.languages[problemData.language] = (userData.solvingPatterns.languages[problemData.language] || 0) + 1;

    // Level up system
    const requiredXP = userData.level * 100;
    if (userData.xp >= requiredXP) {
      userData.level++;
      userData.xp = userData.xp - requiredXP;
    }

    // Update addiction score
    userData.addictionScore = this.calculateAddictionScore(userData);
    userData.lastActive = now.toISOString();

    await this.saveUserData(userId, userData);
    return userData;
  }

  async getPersonalizedRecommendations(userId) {
    const userData = await this.getUserData(userId);
    const recommendations = [];

    // Streak-based recommendations
    if (userData.streak === 0) {
      recommendations.push({
        type: 'streak_starter',
        title: '🔥 Start Your Streak!',
        description: 'Solve one problem to begin your coding streak',
        priority: 10,
        problems: await this.getEasyProblemsForUser(userData),
        motivation: 'Every expert was once a beginner!'
      });
    } else if (userData.streak < 7) {
      recommendations.push({
        type: 'streak_builder',
        title: `🚀 ${userData.streak} Day Streak - Keep Going!`,
        description: 'You\'re building momentum. Don\'t break the chain!',
        priority: 9,
        problems: await this.getProgressiveProblems(userData),
        motivation: `Only ${7 - userData.streak} more days to reach a week streak!`
      });
    } else {
      recommendations.push({
        type: 'streak_master',
        title: `🏆 ${userData.streak} Day Streak Master!`,
        description: 'You\'re on fire! Challenge yourself with harder problems',
        priority: 8,
        problems: await this.getChallengeProblems(userData),
        motivation: 'Consistency is the key to mastery!'
      });
    }

    // Difficulty progression
    const totalEasy = userData.problemsByDifficulty.Easy;
    const totalMedium = userData.problemsByDifficulty.Medium;
    const totalHard = userData.problemsByDifficulty.Hard;

    if (totalEasy >= 10 && totalMedium < 5) {
      recommendations.push({
        type: 'difficulty_progression',
        title: '📈 Ready for Medium Problems!',
        description: 'You\'ve mastered Easy problems. Time to level up!',
        priority: 8,
        problems: await this.getMediumProblemsForUser(userData),
        motivation: 'Growth happens outside your comfort zone!'
      });
    } else if (totalMedium >= 15 && totalHard < 3) {
      recommendations.push({
        type: 'difficulty_progression',
        title: '🎯 Hard Problems Await!',
        description: 'You\'re ready for the ultimate challenge',
        priority: 7,
        problems: await this.getHardProblemsForUser(userData),
        motivation: 'The expert in anything was once a beginner!'
      });
    }

    // Time-based recommendations
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 9 && hour <= 11) {
      recommendations.push({
        type: 'morning_boost',
        title: '☀️ Morning Brain Boost!',
        description: 'Start your day with a coding challenge',
        priority: 6,
        problems: await this.getMorningProblems(userData),
        motivation: 'Morning coding sessions improve focus all day!'
      });
    } else if (hour >= 19 && hour <= 21) {
      recommendations.push({
        type: 'evening_wind_down',
        title: '🌙 Evening Code Session',
        description: 'End your day with some productive coding',
        priority: 6,
        problems: await this.getEveningProblems(userData),
        motivation: 'Consistent evening practice builds lasting skills!'
      });
    }

    // Weakness-based recommendations
    const weakestTopic = this.findWeakestTopic(userData);
    if (weakestTopic) {
      recommendations.push({
        type: 'skill_improvement',
        title: `💪 Strengthen Your ${weakestTopic} Skills`,
        description: 'Focus on your growth areas for maximum improvement',
        priority: 7,
        problems: await this.getTopicProblems(weakestTopic),
        motivation: 'Every weakness is a strength waiting to be developed!'
      });
    }

    // Achievement-based recommendations
    const nextAchievement = this.getNextAchievement(userData);
    if (nextAchievement) {
      recommendations.push({
        type: 'achievement_hunt',
        title: `🏅 ${nextAchievement.title}`,
        description: nextAchievement.description,
        priority: 5,
        problems: nextAchievement.problems,
        motivation: nextAchievement.motivation
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  async getEasyProblemsForUser(userData) {
    // Return easy problems based on user's weak areas
    return [
      { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array' },
      { id: 2, title: 'Reverse String', difficulty: 'Easy', category: 'String' },
      { id: 3, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack' }
    ];
  }

  async getProgressiveProblems(userData) {
    // Return problems that gradually increase in difficulty
    const currentLevel = userData.level;
    if (currentLevel <= 3) {
      return await this.getEasyProblemsForUser(userData);
    } else if (currentLevel <= 7) {
      return [
        { id: 15, title: 'Three Sum', difficulty: 'Medium', category: 'Array' },
        { id: 16, title: 'Group Anagrams', difficulty: 'Medium', category: 'String' }
      ];
    } else {
      return await this.getChallengeProblems(userData);
    }
  }

  async getChallengeProblems(userData) {
    return [
      { id: 25, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Array' },
      { id: 26, title: 'Regular Expression Matching', difficulty: 'Hard', category: 'Dynamic Programming' }
    ];
  }

  async getMediumProblemsForUser(userData) {
    return [
      { id: 10, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'String' },
      { id: 11, title: 'Container With Most Water', difficulty: 'Medium', category: 'Array' }
    ];
  }

  async getHardProblemsForUser(userData) {
    return [
      { id: 20, title: 'Merge k Sorted Lists', difficulty: 'Hard', category: 'Linked List' },
      { id: 21, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Array' }
    ];
  }

  async getMorningProblems(userData) {
    // Return problems that are good for morning brain activation
    return [
      { id: 5, title: 'Palindrome Number', difficulty: 'Easy', category: 'Math' },
      { id: 6, title: 'Roman to Integer', difficulty: 'Easy', category: 'String' }
    ];
  }

  async getEveningProblems(userData) {
    // Return relaxing but engaging problems for evening
    return [
      { id: 7, title: 'Longest Common Prefix', difficulty: 'Easy', category: 'String' },
      { id: 8, title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', category: 'Array' }
    ];
  }

  findWeakestTopic(userData) {
    const topics = userData.solvingPatterns.problemTypes;
    const allTopics = ['Array', 'String', 'Linked List', 'Tree', 'Dynamic Programming', 'Graph'];
    
    let weakestTopic = null;
    let minCount = Infinity;
    
    for (const topic of allTopics) {
      const count = topics[topic] || 0;
      if (count < minCount) {
        minCount = count;
        weakestTopic = topic;
      }
    }
    
    return weakestTopic;
  }

  async getTopicProblems(topic) {
    const topicProblems = {
      'Array': [
        { id: 30, title: 'Maximum Subarray', difficulty: 'Easy', category: 'Array' },
        { id: 31, title: 'Rotate Array', difficulty: 'Medium', category: 'Array' }
      ],
      'String': [
        { id: 32, title: 'Valid Anagram', difficulty: 'Easy', category: 'String' },
        { id: 33, title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'String' }
      ],
      'Tree': [
        { id: 34, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'Tree' },
        { id: 35, title: 'Binary Tree Inorder Traversal', difficulty: 'Medium', category: 'Tree' }
      ]
    };
    
    return topicProblems[topic] || [];
  }

  async getNextAchievement(userData) {
    const achievements = [
      {
        id: 'first_solve',
        title: 'First Steps',
        description: 'Solve your first problem',
        condition: () => userData.totalProblems >= 1,
        motivation: 'Every journey begins with a single step!'
      },
      {
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day solving streak',
        condition: () => userData.streak >= 7,
        motivation: 'Consistency is the mother of mastery!'
      },
      {
        id: 'problem_solver',
        title: 'Problem Solver',
        description: 'Solve 50 problems',
        condition: () => userData.totalProblems >= 50,
        motivation: 'You\'re becoming a true problem solver!'
      },
      {
        id: 'difficulty_master',
        title: 'Difficulty Master',
        description: 'Solve problems in all difficulty levels',
        condition: () => userData.problemsByDifficulty.Easy > 0 && 
                         userData.problemsByDifficulty.Medium > 0 && 
                         userData.problemsByDifficulty.Hard > 0,
        motivation: 'Versatility is the key to mastery!'
      }
    ];

    for (const achievement of achievements) {
      if (!userData.achievements.includes(achievement.id) && !achievement.condition()) {
        return {
          ...achievement,
          problems: await this.getAchievementProblems(achievement.id)
        };
      }
    }

    return null;
  }

  async getAchievementProblems(achievementId) {
    const problemSets = {
      'first_solve': await this.getEasyProblemsForUser({}),
      'week_streak': [
        { id: 40, title: 'Daily Challenge', difficulty: 'Easy', category: 'Array' }
      ],
      'problem_solver': [
        { id: 41, title: 'Milestone Problem', difficulty: 'Medium', category: 'String' }
      ],
      'difficulty_master': [
        { id: 42, title: 'Master Challenge', difficulty: 'Hard', category: 'Dynamic Programming' }
      ]
    };

    return problemSets[achievementId] || [];
  }

  async getDailyChallenge(userId) {
    const userData = await this.getUserData(userId);
    const today = new Date().toDateString();
    
    // Generate a daily challenge based on user's level and preferences
    const challengeLevel = Math.min(userData.level, 10);
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const difficultyIndex = Math.min(Math.floor(challengeLevel / 3), 2);
    const targetDifficulty = difficulties[difficultyIndex];

    return {
      id: `daily_${today}`,
      title: '🎯 Daily Challenge',
      difficulty: targetDifficulty,
      category: this.getRandomCategory(),
      description: 'Complete today\'s challenge to maintain your streak!',
      bonusXP: 50,
      streakBonus: userData.streak >= 7 ? 25 : 0,
      timeLimit: 60, // minutes
      hints: this.generateHints(targetDifficulty)
    };
  }

  getRandomCategory() {
    const categories = ['Array', 'String', 'Linked List', 'Tree', 'Dynamic Programming', 'Graph', 'Math'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  generateHints(difficulty) {
    const hints = {
      'Easy': [
        'Start with the brute force approach',
        'Think about edge cases',
        'Consider using built-in functions'
      ],
      'Medium': [
        'Consider using a hash map for O(1) lookups',
        'Think about two-pointer technique',
        'Dynamic programming might be useful'
      ],
      'Hard': [
        'Break the problem into smaller subproblems',
        'Consider advanced data structures',
        'Think about time-space tradeoffs'
      ]
    };

    return hints[difficulty] || hints['Easy'];
  }

  async getEngagementMetrics(userId) {
    const userData = await this.getUserData(userId);
    const now = new Date();
    
    return {
      addictionScore: userData.addictionScore,
      engagementLevel: this.getEngagementLevel(userData.addictionScore),
      streakMotivation: this.getStreakMotivation(userData.streak),
      nextMilestone: this.getNextMilestone(userData),
      dailyProgress: this.getDailyProgress(userData),
      weeklyProgress: this.getWeeklyProgress(userData),
      recommendations: await this.getPersonalizedRecommendations(userId),
      urgencyFactors: this.getUrgencyFactors(userData)
    };
  }

  getEngagementLevel(score) {
    if (score >= 80) return { level: 'Addicted', emoji: '🔥', color: '#ff4444' };
    if (score >= 60) return { level: 'Highly Engaged', emoji: '⚡', color: '#ff8800' };
    if (score >= 40) return { level: 'Engaged', emoji: '💪', color: '#ffaa00' };
    if (score >= 20) return { level: 'Casual', emoji: '😊', color: '#88cc00' };
    return { level: 'New', emoji: '🌱', color: '#00cc88' };
  }

  getStreakMotivation(streak) {
    if (streak === 0) return 'Start your coding journey today! 🚀';
    if (streak < 3) return `${streak} day${streak > 1 ? 's' : ''} strong! Keep building! 💪`;
    if (streak < 7) return `${streak} days in a row! You're on fire! 🔥`;
    if (streak < 30) return `${streak} day streak! You're unstoppable! ⚡`;
    return `${streak} days! You're a coding legend! 👑`;
  }

  getNextMilestone(userData) {
    const milestones = [
      { problems: 10, title: 'Problem Solver Novice' },
      { problems: 25, title: 'Algorithm Explorer' },
      { problems: 50, title: 'Code Warrior' },
      { problems: 100, title: 'Programming Master' },
      { problems: 200, title: 'LeetCode Legend' }
    ];

    for (const milestone of milestones) {
      if (userData.totalProblems < milestone.problems) {
        return {
          ...milestone,
          remaining: milestone.problems - userData.totalProblems,
          progress: (userData.totalProblems / milestone.problems) * 100
        };
      }
    }

    return { title: 'Ultimate Master', remaining: 0, progress: 100 };
  }

  getDailyProgress(userData) {
    const today = new Date().toDateString();
    const lastActive = new Date(userData.lastActive).toDateString();
    
    return {
      completedToday: today === lastActive,
      goal: userData.engagementMetrics.dailyGoal,
      streak: userData.streak,
      motivation: today === lastActive ? 'Great job today! 🎉' : 'Ready for today\'s challenge? 💪'
    };
  }

  getWeeklyProgress(userData) {
    // Calculate weekly progress based on solving patterns
    const dayOfWeek = new Date().getDay();
    const weeklyGoal = userData.engagementMetrics.weeklyGoal;
    const currentWeekProgress = Object.values(userData.solvingPatterns.dayOfWeek).reduce((a, b) => a + b, 0) % 7;
    
    return {
      completed: currentWeekProgress,
      goal: weeklyGoal,
      remaining: Math.max(0, weeklyGoal - currentWeekProgress),
      progress: (currentWeekProgress / weeklyGoal) * 100
    };
  }

  getUrgencyFactors(userData) {
    const factors = [];
    const now = new Date();
    const lastActive = new Date(userData.lastActive);
    const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);

    if (userData.streak > 0 && hoursSinceActive > 20) {
      factors.push({
        type: 'streak_risk',
        message: '⚠️ Your streak is at risk! Solve a problem to keep it alive!',
        urgency: 'high',
        timeLeft: Math.max(0, 24 - hoursSinceActive)
      });
    }

    if (userData.streak >= 7 && hoursSinceActive > 16) {
      factors.push({
        type: 'streak_master_risk',
        message: '🔥 Don\'t break your amazing streak! You\'ve come so far!',
        urgency: 'critical',
        timeLeft: Math.max(0, 24 - hoursSinceActive)
      });
    }

    return factors;
  }
}

const mlEngine = new LeetCodeMLEngine();

// API Routes

// Get personalized dashboard
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await mlEngine.getUserData(userId);
    const recommendations = await mlEngine.getPersonalizedRecommendations(userId);
    const dailyChallenge = await mlEngine.getDailyChallenge(userId);
    const metrics = await mlEngine.getEngagementMetrics(userId);

    res.json({
      success: true,
      data: {
        user: userData,
        recommendations,
        dailyChallenge,
        metrics
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user progress
router.post('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { problemId, difficulty, category, language, timeSpent, solved } = req.body;

    if (!solved) {
      return res.json({ success: true, message: 'Progress noted, keep trying!' });
    }

    const updatedUser = await mlEngine.updateUserProgress(userId, {
      problemId,
      difficulty,
      category,
      language,
      timeSpent
    });

    const newRecommendations = await mlEngine.getPersonalizedRecommendations(userId);

    res.json({
      success: true,
      data: {
        user: updatedUser,
        recommendations: newRecommendations,
        levelUp: updatedUser.level > (await mlEngine.getUserData(userId)).level,
        newAchievements: [] // TODO: Implement achievement checking
      }
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await mlEngine.getPersonalizedRecommendations(userId);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get daily challenge
router.get('/daily-challenge/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const challenge = await mlEngine.getDailyChallenge(userId);

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Daily challenge error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get engagement metrics
router.get('/engagement/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const metrics = await mlEngine.getEngagementMetrics(userId);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Engagement metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LeetCode ML Engine',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;


// DSA AI Agent endpoint
router.post('/dsa-agent', async (req, res) => {
  try {
    const {
      userId,
      problemTitle,
      problemDescription,
      problemDifficulty,
      problemTags,
      userCode,
      message,
      conversationHistory
    } = req.body;

    // Initialize Gemini AI
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build context-aware prompt
    const systemPrompt = `You are an expert DSA (Data Structures & Algorithms) tutor and LeetCode coach. Your role is to help users solve coding problems through:

1. **Progressive Hints**: Give hints that guide without revealing the solution
2. **Pattern Recognition**: Identify DSA patterns (Two Pointers, Sliding Window, etc.)
3. **Complexity Analysis**: Explain time and space complexity
4. **Code Review**: Analyze user code and suggest improvements
5. **Concept Explanation**: Teach underlying concepts clearly

**Current Problem:**
Title: ${problemTitle}
Difficulty: ${problemDifficulty}
Tags: ${problemTags?.join(', ') || 'N/A'}
Description: ${problemDescription}

${userCode ? `**User's Current Code:**\n\`\`\`\n${userCode}\n\`\`\`` : ''}

**Conversation History:**
${conversationHistory?.map(m => `${m.role}: ${m.content}`).join('\n') || 'No previous messages'}

**User's Question:** ${message}

**Instructions:**
- Be encouraging and supportive
- Use emojis sparingly for clarity
- Provide code snippets when helpful
- Break down complex concepts
- Ask clarifying questions if needed
- Never give the complete solution unless explicitly asked
- Focus on teaching, not just answering`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Extract structured data from response
    const hints = extractHints(response);
    const patterns = extractPatterns(response, problemTags);
    const complexity = extractComplexity(response);
    const codeSnippet = extractCodeSnippet(response);

    res.json({
      success: true,
      response: response,
      hints: hints,
      patterns: patterns,
      complexity: complexity,
      codeSnippet: codeSnippet,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DSA Agent error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process request'
    });
  }
});

// Helper function to extract hints from AI response
function extractHints(response) {
  const hints = [];
  const hintPatterns = [
    /hint\s*\d*:?\s*(.+?)(?=\n\n|hint|$)/gi,
    /💡\s*(.+?)(?=\n\n|💡|$)/gi,
    /consider\s+(.+?)(?=\n\n|consider|$)/gi
  ];

  hintPatterns.forEach(pattern => {
    const matches = response.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 10) {
        hints.push(match[1].trim());
      }
    }
  });

  return hints.slice(0, 5); // Max 5 hints
}

// Helper function to extract DSA patterns
function extractPatterns(response, problemTags) {
  const commonPatterns = [
    { name: 'Two Pointers', keywords: ['two pointer', 'left', 'right', 'start', 'end'], description: 'Use two pointers moving towards each other or in same direction' },
    { name: 'Sliding Window', keywords: ['sliding window', 'window', 'subarray', 'substring'], description: 'Maintain a window that slides through the array' },
    { name: 'Binary Search', keywords: ['binary search', 'sorted', 'log n', 'divide'], description: 'Divide and conquer on sorted data' },
    { name: 'Dynamic Programming', keywords: ['dp', 'dynamic programming', 'memoization', 'optimal substructure'], description: 'Break down into overlapping subproblems' },
    { name: 'Backtracking', keywords: ['backtrack', 'recursive', 'permutation', 'combination'], description: 'Explore all possibilities with pruning' },
    { name: 'BFS/DFS', keywords: ['bfs', 'dfs', 'graph', 'tree', 'traversal'], description: 'Graph or tree traversal algorithms' },
    { name: 'Greedy', keywords: ['greedy', 'optimal', 'local'], description: 'Make locally optimal choices' },
    { name: 'Hash Map', keywords: ['hash', 'map', 'dictionary', 'frequency'], description: 'Use hash table for O(1) lookups' },
    { name: 'Stack/Queue', keywords: ['stack', 'queue', 'lifo', 'fifo'], description: 'Use stack or queue data structure' },
    { name: 'Heap', keywords: ['heap', 'priority queue', 'top k'], description: 'Use heap for efficient min/max operations' }
  ];

  const detectedPatterns = [];
  const responseLower = response.toLowerCase();

  commonPatterns.forEach(pattern => {
    const matchCount = pattern.keywords.filter(keyword => 
      responseLower.includes(keyword.toLowerCase())
    ).length;

    if (matchCount >= 2 || (problemTags && problemTags.some(tag => 
      pattern.keywords.some(keyword => tag.toLowerCase().includes(keyword))
    ))) {
      detectedPatterns.push({
        name: pattern.name,
        description: pattern.description,
        examples: [`${pattern.name} problems on LeetCode`]
      });
    }
  });

  return detectedPatterns.slice(0, 3); // Max 3 patterns
}

// Helper function to extract complexity analysis
function extractComplexity(response) {
  const timeMatch = response.match(/time complexity[:\s]+O\(([^)]+)\)/i);
  const spaceMatch = response.match(/space complexity[:\s]+O\(([^)]+)\)/i);

  if (timeMatch || spaceMatch) {
    return {
      time: timeMatch ? `O(${timeMatch[1]})` : 'Not specified',
      space: spaceMatch ? `O(${spaceMatch[1]})` : 'Not specified',
      timeExplanation: extractComplexityExplanation(response, 'time'),
      spaceExplanation: extractComplexityExplanation(response, 'space'),
      optimization: extractOptimization(response)
    };
  }

  return null;
}

function extractComplexityExplanation(response, type) {
  const pattern = new RegExp(`${type} complexity[^.]+\\.([^.]+\\.)`, 'i');
  const match = response.match(pattern);
  return match ? match[1].trim() : `${type} complexity analysis`;
}

function extractOptimization(response) {
  const optimizationPatterns = [
    /optimi[zs]e[^.]+\./gi,
    /can be improved[^.]+\./gi,
    /better approach[^.]+\./gi
  ];

  for (const pattern of optimizationPatterns) {
    const match = response.match(pattern);
    if (match) return match[0];
  }

  return null;
}

// Helper function to extract code snippets
function extractCodeSnippet(response) {
  const codeBlockMatch = response.match(/```[\w]*\n([\s\S]+?)```/);
  return codeBlockMatch ? codeBlockMatch[1].trim() : null;
}

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const LeaderboardContext = createContext();

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within LeaderboardProvider');
  }
  return context;
};

// Point system based on difficulty
export const POINTS = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  BONUS_FIRST_SOLVE: 5,
  BONUS_STREAK: 10,
  BONUS_PERFECT_WEEK: 50,
  BONUS_SPEED: 15, // Solved faster than average
};

// Achievement badges
export const BADGES = {
  BEGINNER: { name: 'Beginner', icon: '🌱', requirement: 1, color: 'green' },
  PROBLEM_SOLVER: { name: 'Problem Solver', icon: '💡', requirement: 10, color: 'blue' },
  CODE_WARRIOR: { name: 'Code Warrior', icon: '⚔️', requirement: 50, color: 'purple' },
  ALGORITHM_MASTER: { name: 'Algorithm Master', icon: '🎯', requirement: 100, color: 'red' },
  LEGEND: { name: 'Legend', icon: '👑', requirement: 250, color: 'gold' },
  SPEED_DEMON: { name: 'Speed Demon', icon: '⚡', requirement: 'speed', color: 'yellow' },
  STREAK_KEEPER: { name: 'Streak Keeper', icon: '🔥', requirement: 'streak', color: 'orange' },
  PERFECTIONIST: { name: 'Perfectionist', icon: '✨', requirement: 'perfect', color: 'pink' },
};

// Rank tiers
export const RANKS = [
  { name: 'Bronze', min: 0, max: 99, icon: '🥉', color: 'from-amber-700 to-amber-900' },
  { name: 'Silver', min: 100, max: 299, icon: '🥈', color: 'from-gray-400 to-gray-600' },
  { name: 'Gold', min: 300, max: 599, icon: '🥇', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Platinum', min: 600, max: 999, icon: '💎', color: 'from-cyan-400 to-cyan-600' },
  { name: 'Diamond', min: 1000, max: 1999, icon: '💠', color: 'from-blue-400 to-blue-600' },
  { name: 'Master', min: 2000, max: 3999, icon: '🌟', color: 'from-purple-400 to-purple-600' },
  { name: 'Grandmaster', min: 4000, max: Infinity, icon: '👑', color: 'from-red-400 to-red-600' },
];

export const LeaderboardProvider = ({ children }) => {
  const { user } = useUser();
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    problemsSolved: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    rank: RANKS[0],
    globalRank: 0,
    lastSolvedDate: null,
  });

  const [leaderboard, setLeaderboard] = useState([]);

  // Load user stats from localStorage
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`leaderboard_${user.id}`);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        setUserStats(stats);
      }
    }
  }, [user]);

  // Save stats to localStorage
  useEffect(() => {
    if (user && userStats.totalPoints > 0) {
      localStorage.setItem(`leaderboard_${user.id}`, JSON.stringify(userStats));
    }
  }, [user, userStats]);

  // Calculate rank based on points
  const calculateRank = (points) => {
    return RANKS.find(rank => points >= rank.min && points <= rank.max) || RANKS[0];
  };

  // Check and award badges
  const checkBadges = (stats) => {
    const newBadges = [];
    
    // Problem count badges
    Object.entries(BADGES).forEach(([key, badge]) => {
      if (typeof badge.requirement === 'number') {
        if (stats.problemsSolved >= badge.requirement && !stats.badges.includes(key)) {
          newBadges.push(key);
        }
      }
    });

    // Streak badge
    if (stats.currentStreak >= 7 && !stats.badges.includes('STREAK_KEEPER')) {
      newBadges.push('STREAK_KEEPER');
    }

    return [...stats.badges, ...newBadges];
  };

  // Add points for solving a problem
  const addProblemSolved = (difficulty, timeSpent, averageTime) => {
    const basePoints = POINTS[difficulty.toUpperCase()] || 0;
    let bonusPoints = 0;

    // First solve bonus
    if (userStats.problemsSolved === 0) {
      bonusPoints += POINTS.BONUS_FIRST_SOLVE;
    }

    // Speed bonus
    if (timeSpent && averageTime && timeSpent < averageTime * 0.8) {
      bonusPoints += POINTS.BONUS_SPEED;
    }

    // Streak bonus
    const today = new Date().toDateString();
    const lastSolved = userStats.lastSolvedDate;
    let newStreak = userStats.currentStreak;

    if (lastSolved) {
      const lastDate = new Date(lastSolved).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === yesterday) {
        newStreak += 1;
        if (newStreak % 7 === 0) {
          bonusPoints += POINTS.BONUS_STREAK;
        }
      } else if (lastDate !== today) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const totalPoints = userStats.totalPoints + basePoints + bonusPoints;
    const problemsSolved = userStats.problemsSolved + 1;
    
    const newStats = {
      ...userStats,
      totalPoints,
      problemsSolved,
      easyCount: difficulty === 'easy' ? userStats.easyCount + 1 : userStats.easyCount,
      mediumCount: difficulty === 'medium' ? userStats.mediumCount + 1 : userStats.mediumCount,
      hardCount: difficulty === 'hard' ? userStats.hardCount + 1 : userStats.hardCount,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userStats.longestStreak),
      lastSolvedDate: today,
      rank: calculateRank(totalPoints),
    };

    newStats.badges = checkBadges(newStats);
    setUserStats(newStats);

    return {
      pointsEarned: basePoints + bonusPoints,
      bonusPoints,
      newBadges: newStats.badges.filter(b => !userStats.badges.includes(b)),
    };
  };

  // Get user's rank position
  const getUserRankPosition = () => {
    return userStats.globalRank || leaderboard.findIndex(u => u.id === user?.id) + 1;
  };

  // Mock leaderboard data (replace with API call)
  useEffect(() => {
    const mockLeaderboard = [
      { id: 1, name: 'CodeMaster', avatar: '👨‍💻', points: 4500, solved: 180, rank: RANKS[6] },
      { id: 2, name: 'AlgoQueen', avatar: '👩‍💻', points: 3200, solved: 128, rank: RANKS[5] },
      { id: 3, name: 'ByteNinja', avatar: '🥷', points: 2800, solved: 112, rank: RANKS[5] },
      { id: 4, name: 'StackOverflow', avatar: '📚', points: 1500, solved: 60, rank: RANKS[4] },
      { id: 5, name: 'BugHunter', avatar: '🐛', points: 1200, solved: 48, rank: RANKS[4] },
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

  const value = {
    userStats,
    leaderboard,
    addProblemSolved,
    getUserRankPosition,
    POINTS,
    BADGES,
    RANKS,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};

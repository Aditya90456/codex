import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useClerkProgress = () => {
  const { user, isLoaded } = useUser();
  const [progress, setProgress] = useState({
    completedProblems: [],
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastSubmissionDate: null,
    problemStats: {},
    categoryProgress: {},
    difficultyStats: {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 }
    },
    certificates: [],
    achievements: [],
    totalCodeTime: 0,
    favoriteLanguage: 'javascript',
    languageStats: {}
  });
  const [loading, setLoading] = useState(true);

  // Load progress from Clerk user metadata
  useEffect(() => {
    if (isLoaded && user) {
      loadProgressFromClerk();
    } else if (isLoaded && !user) {
      // Guest mode - use localStorage
      loadProgressFromLocalStorage();
    }
  }, [isLoaded, user]);

  const loadProgressFromClerk = async () => {
    try {
      setLoading(true);
      
      // Get progress from Clerk user's public metadata
      const clerkProgress = user.publicMetadata?.progress || {};
      
      // Merge with default progress structure
      const loadedProgress = {
        ...progress,
        ...clerkProgress,
        completedProblems: clerkProgress.completedProblems || [],
        certificates: clerkProgress.certificates || [],
        achievements: clerkProgress.achievements || []
      };
      
      setProgress(loadedProgress);
      console.log('✅ Progress loaded from Clerk:', loadedProgress);
    } catch (error) {
      console.error('❌ Failed to load progress from Clerk:', error);
      // Fallback to localStorage
      loadProgressFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadProgressFromLocalStorage = () => {
    try {
      const savedProgress = localStorage.getItem('codingProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(prev => ({ ...prev, ...parsedProgress }));
        console.log('✅ Progress loaded from localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to load progress from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgressToClerk = async (newProgress) => {
    if (!user) {
      // Save to localStorage for guests
      localStorage.setItem('codingProgress', JSON.stringify(newProgress));
      return;
    }

    try {
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          progress: newProgress,
          lastUpdated: new Date().toISOString()
        }
      });
      console.log('✅ Progress saved to Clerk');
    } catch (error) {
      console.error('❌ Failed to save progress to Clerk:', error);
      // Fallback to localStorage
      localStorage.setItem('codingProgress', JSON.stringify(newProgress));
    }
  };

  const updateProgress = async (updates) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    await saveProgressToClerk(newProgress);
  };

  const markProblemCompleted = async (problemId, difficulty, category, language, timeSpent = 0) => {
    if (progress.completedProblems.includes(problemId)) {
      return; // Already completed
    }

    const today = new Date().toDateString();
    const lastSubmissionDate = progress.lastSubmissionDate;
    
    // Calculate streak
    let newStreak = progress.currentStreak;
    if (lastSubmissionDate) {
      const lastDate = new Date(lastSubmissionDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === today) {
        // Same day, keep streak
      } else if (lastDate === yesterday) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    } else {
      // First submission
      newStreak = 1;
    }

    const newProgress = {
      ...progress,
      completedProblems: [...progress.completedProblems, problemId],
      totalSubmissions: progress.totalSubmissions + 1,
      acceptedSubmissions: progress.acceptedSubmissions + 1,
      currentStreak: newStreak,
      maxStreak: Math.max(progress.maxStreak, newStreak),
      lastSubmissionDate: today,
      totalCodeTime: progress.totalCodeTime + timeSpent,
      difficultyStats: {
        ...progress.difficultyStats,
        [difficulty.toLowerCase()]: {
          ...progress.difficultyStats[difficulty.toLowerCase()],
          solved: progress.difficultyStats[difficulty.toLowerCase()].solved + 1
        }
      },
      categoryProgress: {
        ...progress.categoryProgress,
        [category]: (progress.categoryProgress[category] || 0) + 1
      },
      languageStats: {
        ...progress.languageStats,
        [language]: (progress.languageStats[language] || 0) + 1
      }
    };

    // Check for achievements
    const newAchievements = checkAchievements(newProgress);
    if (newAchievements.length > 0) {
      newProgress.achievements = [...progress.achievements, ...newAchievements];
    }

    setProgress(newProgress);
    await saveProgressToClerk(newProgress);
    
    return newAchievements;
  };

  const recordSubmission = async (problemId, accepted, language, timeSpent = 0) => {
    const newProgress = {
      ...progress,
      totalSubmissions: progress.totalSubmissions + 1,
      totalCodeTime: progress.totalCodeTime + timeSpent,
      languageStats: {
        ...progress.languageStats,
        [language]: (progress.languageStats[language] || 0) + 1
      }
    };

    if (accepted) {
      newProgress.acceptedSubmissions = progress.acceptedSubmissions + 1;
    }

    setProgress(newProgress);
    await saveProgressToClerk(newProgress);
  };

  const addCertificate = async (certificate) => {
    const newProgress = {
      ...progress,
      certificates: [...progress.certificates, {
        ...certificate,
        earnedAt: new Date().toISOString(),
        id: Date.now().toString()
      }]
    };

    setProgress(newProgress);
    await saveProgressToClerk(newProgress);
  };

  const checkAchievements = (currentProgress) => {
    const achievements = [];
    const existingAchievements = currentProgress.achievements.map(a => a.id);

    // Problem count achievements
    const problemMilestones = [
      { count: 1, id: 'first_solve', name: 'First Steps', description: 'Solved your first problem!' },
      { count: 10, id: 'problem_solver', name: 'Problem Solver', description: 'Solved 10 problems' },
      { count: 50, id: 'coding_enthusiast', name: 'Coding Enthusiast', description: 'Solved 50 problems' },
      { count: 100, id: 'algorithm_master', name: 'Algorithm Master', description: 'Solved 100 problems' },
      { count: 200, id: 'coding_legend', name: 'Coding Legend', description: 'Solved 200 problems' }
    ];

    problemMilestones.forEach(milestone => {
      if (currentProgress.completedProblems.length >= milestone.count && 
          !existingAchievements.includes(milestone.id)) {
        achievements.push({
          ...milestone,
          earnedAt: new Date().toISOString(),
          type: 'milestone'
        });
      }
    });

    // Streak achievements
    const streakMilestones = [
      { streak: 3, id: 'streak_3', name: 'On Fire', description: '3-day coding streak!' },
      { streak: 7, id: 'streak_7', name: 'Week Warrior', description: '7-day coding streak!' },
      { streak: 30, id: 'streak_30', name: 'Monthly Master', description: '30-day coding streak!' }
    ];

    streakMilestones.forEach(milestone => {
      if (currentProgress.currentStreak >= milestone.streak && 
          !existingAchievements.includes(milestone.id)) {
        achievements.push({
          ...milestone,
          earnedAt: new Date().toISOString(),
          type: 'streak'
        });
      }
    });

    // Language achievements
    Object.entries(currentProgress.languageStats).forEach(([language, count]) => {
      const langAchievementId = `${language}_expert`;
      if (count >= 25 && !existingAchievements.includes(langAchievementId)) {
        achievements.push({
          id: langAchievementId,
          name: `${language.charAt(0).toUpperCase() + language.slice(1)} Expert`,
          description: `Solved 25 problems in ${language}`,
          earnedAt: new Date().toISOString(),
          type: 'language'
        });
      }
    });

    return achievements;
  };

  const getProgressStats = () => {
    const totalProblems = progress.completedProblems.length;
    const acceptanceRate = progress.totalSubmissions > 0 
      ? ((progress.acceptedSubmissions / progress.totalSubmissions) * 100).toFixed(1)
      : 0;
    
    const favoriteLanguage = Object.entries(progress.languageStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'javascript';

    return {
      totalProblems,
      acceptanceRate,
      favoriteLanguage,
      currentStreak: progress.currentStreak,
      maxStreak: progress.maxStreak,
      totalSubmissions: progress.totalSubmissions,
      certificates: progress.certificates.length,
      achievements: progress.achievements.length,
      totalCodeTime: progress.totalCodeTime,
      rank: calculateRank(totalProblems, progress.currentStreak)
    };
  };

  const calculateRank = (problemsSolved, streak) => {
    if (problemsSolved >= 200 && streak >= 30) return 'Grandmaster';
    if (problemsSolved >= 100 && streak >= 14) return 'Master';
    if (problemsSolved >= 50 && streak >= 7) return 'Expert';
    if (problemsSolved >= 25 && streak >= 3) return 'Advanced';
    if (problemsSolved >= 10) return 'Intermediate';
    if (problemsSolved >= 1) return 'Beginner';
    return 'Newbie';
  };

  const resetProgress = async () => {
    const defaultProgress = {
      completedProblems: [],
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastSubmissionDate: null,
      problemStats: {},
      categoryProgress: {},
      difficultyStats: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 }
      },
      certificates: [],
      achievements: [],
      totalCodeTime: 0,
      favoriteLanguage: 'javascript',
      languageStats: {}
    };

    setProgress(defaultProgress);
    await saveProgressToClerk(defaultProgress);
  };

  return {
    progress,
    loading,
    updateProgress,
    markProblemCompleted,
    recordSubmission,
    addCertificate,
    getProgressStats,
    resetProgress,
    isAuthenticated: !!user
  };
};          
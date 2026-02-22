# 🏆 Leaderboard & Points System Guide

## Overview

An exciting gamification system with LeetCode-style points, rankings, badges, and achievements to motivate users and create competition.

## Features

### 🎯 Point System

#### Base Points by Difficulty
- **Easy**: 10 points
- **Medium**: 25 points  
- **Hard**: 50 points

#### Bonus Points
- **First Solve**: +5 points (first problem ever)
- **Speed Bonus**: +15 points (solved faster than average)
- **Streak Bonus**: +10 points (every 7-day streak)
- **Perfect Week**: +50 points (solved every day for a week)

### 🏅 Rank Tiers

1. **Bronze** 🥉 (0-99 points)
2. **Silver** 🥈 (100-299 points)
3. **Gold** 🥇 (300-599 points)
4. **Platinum** 💎 (600-999 points)
5. **Diamond** 💠 (1000-1999 points)
6. **Master** 🌟 (2000-3999 points)
7. **Grandmaster** 👑 (4000+ points)

### 🎖️ Achievement Badges

- **Beginner** 🌱 - Solve 1 problem
- **Problem Solver** 💡 - Solve 10 problems
- **Code Warrior** ⚔️ - Solve 50 problems
- **Algorithm Master** 🎯 - Solve 100 problems
- **Legend** 👑 - Solve 250 problems
- **Speed Demon** ⚡ - Solve problems faster than average
- **Streak Keeper** 🔥 - Maintain 7-day streak
- **Perfectionist** ✨ - Complete perfect week

### 📊 User Statistics

- Total points earned
- Problems solved (Easy/Medium/Hard breakdown)
- Current streak
- Longest streak
- Global rank position
- Badges earned
- Activity heatmap

## Installation

### 1. Install Dependencies

```bash
npm install framer-motion
```

### 2. Wrap App with LeaderboardProvider

```jsx
// src/main.jsx or src/App.jsx
import { LeaderboardProvider } from './contexts/LeaderboardContext';

function App() {
  return (
    <LeaderboardProvider>
      {/* Your app components */}
    </LeaderboardProvider>
  );
}
```

### 3. Add Routes

```jsx
import LeaderboardFullPage from './pages/LeaderboardFullPage';

// In your router
<Route path="/leaderboard" element={<LeaderboardFullPage />} />
```

## Usage

### Award Points When Problem is Solved

```jsx
import { useLeaderboard } from './contexts/LeaderboardContext';

function ProblemEditor() {
  const { addProblemSolved } = useLeaderboard();
  
  const handleSubmit = async () => {
    // ... your submission logic
    
    if (isCorrect) {
      const result = addProblemSolved(
        'medium',      // difficulty: 'easy' | 'medium' | 'hard'
        120,           // timeSpent in seconds
        180            // averageTime in seconds (for speed bonus)
      );
      
      // Show points animation
      console.log('Points earned:', result.pointsEarned);
      console.log('Bonus points:', result.bonusPoints);
      console.log('New badges:', result.newBadges);
    }
  };
}
```

### Display Points Animation

```jsx
import { useState } from 'react';
import PointsAnimation from './components/Leaderboard/PointsAnimation';

function ProblemEditor() {
  const [showPoints, setShowPoints] = useState(false);
  const [pointsData, setPointsData] = useState(null);
  
  const handleSubmit = async () => {
    if (isCorrect) {
      const result = addProblemSolved('medium', 120, 180);
      setPointsData(result);
      setShowPoints(true);
    }
  };
  
  return (
    <>
      {/* Your editor */}
      
      {showPoints && (
        <PointsAnimation
          points={pointsData.pointsEarned}
          bonusPoints={pointsData.bonusPoints}
          newBadges={pointsData.newBadges}
          onComplete={() => setShowPoints(false)}
        />
      )}
    </>
  );
}
```

### Access User Stats

```jsx
import { useLeaderboard } from './contexts/LeaderboardContext';

function UserProfile() {
  const { userStats, getUserRankPosition } = useLeaderboard();
  
  return (
    <div>
      <h2>Rank: {userStats.rank.name} {userStats.rank.icon}</h2>
      <p>Points: {userStats.totalPoints}</p>
      <p>Global Rank: #{getUserRankPosition()}</p>
      <p>Problems Solved: {userStats.problemsSolved}</p>
      <p>Current Streak: {userStats.currentStreak} days</p>
      <p>Badges: {userStats.badges.length}</p>
    </div>
  );
}
```

### Display Leaderboard

```jsx
import { useLeaderboard } from './contexts/LeaderboardContext';

function Leaderboard() {
  const { leaderboard } = useLeaderboard();
  
  return (
    <div>
      {leaderboard.map((user, index) => (
        <div key={user.id}>
          <span>#{index + 1}</span>
          <span>{user.name}</span>
          <span>{user.points} pts</span>
          <span>{user.rank.icon}</span>
        </div>
      ))}
    </div>
  );
}
```

## Components

### LeaderboardPage
Main leaderboard with top 3 podium and full rankings table.

```jsx
import LeaderboardPage from './components/Leaderboard/LeaderboardPage';

<LeaderboardPage />
```

### BadgesShowcase
Display all badges with unlock progress.

```jsx
import BadgesShowcase from './components/Leaderboard/BadgesShowcase';

<BadgesShowcase />
```

### UserProfileStats
Comprehensive user statistics with activity heatmap.

```jsx
import UserProfileStats from './components/Leaderboard/UserProfileStats';

<UserProfileStats />
```

### PointsAnimation
Animated celebration when earning points.

```jsx
import PointsAnimation from './components/Leaderboard/PointsAnimation';

<PointsAnimation
  points={50}
  bonusPoints={15}
  newBadges={[{ icon: '🎯', name: 'Algorithm Master' }]}
  onComplete={() => console.log('Animation complete')}
/>
```

## Customization

### Add New Badges

```javascript
// In LeaderboardContext.jsx
export const BADGES = {
  // ... existing badges
  CUSTOM_BADGE: { 
    name: 'Custom Badge', 
    icon: '🎨', 
    requirement: 75, 
    color: 'indigo' 
  },
};
```

### Modify Point Values

```javascript
// In LeaderboardContext.jsx
export const POINTS = {
  EASY: 15,           // Changed from 10
  MEDIUM: 30,         // Changed from 25
  HARD: 60,           // Changed from 50
  BONUS_CUSTOM: 20,   // New bonus type
};
```

### Add New Rank Tiers

```javascript
// In LeaderboardContext.jsx
export const RANKS = [
  // ... existing ranks
  { 
    name: 'Elite', 
    min: 5000, 
    max: Infinity, 
    icon: '⭐', 
    color: 'from-rainbow-400 to-rainbow-600' 
  },
];
```

## Backend Integration

### API Endpoints (Example)

```javascript
// Save user stats
POST /api/leaderboard/stats
Body: {
  userId: string,
  points: number,
  problemsSolved: number,
  difficulty: 'easy' | 'medium' | 'hard'
}

// Get leaderboard
GET /api/leaderboard?timeframe=all-time&category=global&limit=100

// Get user rank
GET /api/leaderboard/user/:userId/rank

// Get user stats
GET /api/leaderboard/user/:userId/stats
```

### Database Schema (Example)

```sql
CREATE TABLE user_stats (
  user_id VARCHAR(255) PRIMARY KEY,
  total_points INT DEFAULT 0,
  problems_solved INT DEFAULT 0,
  easy_count INT DEFAULT 0,
  medium_count INT DEFAULT 0,
  hard_count INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  badges JSON,
  last_solved_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  username VARCHAR(255),
  avatar VARCHAR(255),
  points INT,
  rank VARCHAR(50),
  timeframe VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'all-time'
  category VARCHAR(20),  -- 'global', 'country', 'friends'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_points (points DESC),
  INDEX idx_timeframe (timeframe, points DESC)
);
```

## Advanced Features

### Real-time Updates

```jsx
import { useEffect } from 'react';
import { useLeaderboard } from './contexts/LeaderboardContext';

function RealtimeLeaderboard() {
  const { leaderboard, setLeaderboard } = useLeaderboard();
  
  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('ws://your-server.com/leaderboard');
    
    ws.onmessage = (event) => {
      const updatedLeaderboard = JSON.parse(event.data);
      setLeaderboard(updatedLeaderboard);
    };
    
    return () => ws.close();
  }, []);
  
  return <LeaderboardPage />;
}
```

### Streak Notifications

```jsx
import { useEffect } from 'react';
import { useLeaderboard } from './contexts/LeaderboardContext';

function StreakNotification() {
  const { userStats } = useLeaderboard();
  
  useEffect(() => {
    if (userStats.currentStreak > 0 && userStats.currentStreak % 7 === 0) {
      // Show notification
      new Notification('🔥 Streak Milestone!', {
        body: `You've maintained a ${userStats.currentStreak}-day streak!`,
      });
    }
  }, [userStats.currentStreak]);
}
```

### Social Sharing

```jsx
function ShareButton() {
  const { userStats } = useLeaderboard();
  
  const shareStats = () => {
    const text = `I just reached ${userStats.rank.name} rank with ${userStats.totalPoints} points! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My LeetCode Stats',
        text: text,
        url: window.location.href,
      });
    }
  };
  
  return <button onClick={shareStats}>Share My Stats</button>;
}
```

## Performance Optimization

### Lazy Load Leaderboard

```jsx
import { lazy, Suspense } from 'react';

const LeaderboardPage = lazy(() => import('./components/Leaderboard/LeaderboardPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeaderboardPage />
    </Suspense>
  );
}
```

### Memoize Calculations

```jsx
import { useMemo } from 'react';
import { useLeaderboard } from './contexts/LeaderboardContext';

function LeaderboardStats() {
  const { leaderboard } = useLeaderboard();
  
  const topUsers = useMemo(() => {
    return leaderboard.slice(0, 10);
  }, [leaderboard]);
  
  return <div>{/* Render top users */}</div>;
}
```

## Troubleshooting

### Points Not Saving
- Check localStorage permissions
- Verify user is authenticated
- Check browser console for errors

### Badges Not Unlocking
- Verify badge requirements are met
- Check `checkBadges` function logic
- Ensure stats are updating correctly

### Leaderboard Not Loading
- Check API endpoint
- Verify data format matches expected structure
- Check network tab for errors

## Future Enhancements

- [ ] Weekly/Monthly leaderboard resets
- [ ] Country-specific leaderboards
- [ ] Friends-only leaderboards
- [ ] Team competitions
- [ ] Seasonal events with special badges
- [ ] Leaderboard history and trends
- [ ] Push notifications for rank changes
- [ ] Social media integration
- [ ] Custom profile themes based on rank
- [ ] Tournament mode

## License

Part of the main application license.

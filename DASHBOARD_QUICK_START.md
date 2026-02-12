# Dashboard - Quick Start Guide 🚀

## What is the Dashboard?

The Dashboard is your central hub showing all your coding progress, stats, achievements, and activity in one place.

## How to Access

### Method 1: Navigation Bar
1. Start the app: `npm run dev`
2. Sign in to your account
3. Click **"Dashboard"** in the top navigation bar (first item with icon)

### Method 2: Direct URL
- Visit: `http://localhost:5173/dashboard`
- Must be logged in to access

### Method 3: User Menu
- Click your avatar in the top right
- Select "Dashboard" from the dropdown

## Dashboard Features

### 📊 Quick Stats Cards (Top Row)
- **Problems Solved**: Total problems completed with trend
- **Certificates Earned**: Number of certificates you've earned
- **Goals Completed**: Monthly goals achieved
- **Current Streak**: Your current solving streak

### 📈 Progress Overview
- **Difficulty Breakdown**: Easy, Medium, Hard problems
- Visual progress bars showing completion percentage
- Color-coded by difficulty level

### 🎯 Recent Activity Feed
- Recent problem solves
- Streak achievements
- Goal completions
- Certificate awards
- Timestamps for each activity

### 📚 Category Progress
- Problems solved by category (Arrays, Strings, Trees, etc.)
- Top 6 categories displayed
- Quick stats for each category

### 📅 Daily Challenge Status
- Shows if today's challenge is completed
- Points earned today
- Completion status indicator

### 🎯 Monthly Goals Preview
- Top 3 current goals
- Progress bars for each goal
- Completion percentages

### 🏆 Achievements Grid
- Visual achievement badges
- Locked/unlocked states
- 6 different achievement types:
  - First Solve
  - 7-Day Streak
  - 50 Problems
  - All Easy
  - Speed Demon
  - Master

### 📊 Quick Stats Panel
- Total submissions
- Acceptance rate
- Longest streak
- Total points

## Data Sources

The dashboard pulls real-time data from:
- **Clerk Progress**: User authentication and basic stats
- **Roadmap API**: Problem-solving progress and streaks
- **Daily Progress**: localStorage for daily challenges
- **Monthly Goals**: localStorage for goal tracking
- **Certificates**: localStorage for earned certificates

## Auto-Updates

The dashboard automatically updates when you:
- ✅ Solve a problem
- 🔥 Maintain your streak
- 🎯 Complete a goal
- 🏆 Earn a certificate
- 📈 Improve your stats

## Design Features

- **Modern UI**: Dark theme with gradients
- **Responsive**: Works on all screen sizes
- **Animated**: Smooth transitions and hover effects
- **Color-Coded**: Different colors for different metrics
- **Real-Time**: Live data updates

## Navigation from Dashboard

From the dashboard, you can quickly navigate to:
- Code Editor
- LeetCode Problems
- Learning Hub
- Blogs
- Resume Builder
- AI Tools

## Troubleshooting

### Dashboard Not Loading?
1. Make sure you're signed in
2. Check backend is running: `cd backend && npm start`
3. Verify API_URL in `.env` file
4. Clear browser cache and reload

### No Data Showing?
1. Solve at least one problem to see stats
2. Complete daily challenge to see daily progress
3. Set monthly goals to see goal tracking
4. Earn certificates to see achievements

### Stats Not Updating?
1. Refresh the page
2. Check browser console for errors
3. Verify backend API is responding
4. Check localStorage is enabled

## Quick Actions

### Start Coding
Click any stat card or use the navigation to jump to:
- Problems section
- Code editor
- Learning hub

### View Details
Click on any section to see more detailed information:
- Click category cards to see problems in that category
- Click achievements to see requirements
- Click goals to manage monthly goals

## Backend API Endpoints

The dashboard uses these endpoints:
- `GET /api/roadmap/user/:userId` - Get roadmap data
- Data from localStorage for daily/monthly tracking

## Files

- **Component**: `src/components/Dashboard.jsx`
- **Route**: `/dashboard` in `src/App-ClerkNew.jsx`
- **Hook**: `src/hooks/useClerkProgress.js`
- **Backend**: `backend/routes/roadmap.js`

## Next Steps

1. **Start the app**: `npm run dev`
2. **Sign in** to your account
3. **Click Dashboard** in the navbar
4. **Explore** your coding journey!

The dashboard is fully integrated and ready to use! 🎉

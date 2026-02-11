# How to Use DSA Roadmap Tracker 🗺️

## Quick Start Guide

### Step 1: Open LeetCode Editor
Navigate to the LeetCode Editor page in your application.

### Step 2: Click the "Roadmap" Button
Look for the purple gradient button in the top navigation bar:
```
[Home] [🏆 Roadmap] [Problem List]
```

### Step 3: Explore Your Progress
The roadmap tracker opens in a full-screen modal with 4 tabs:

#### 📅 Calendar Tab
- View your daily coding activity as a heatmap
- See your current streak (consecutive days)
- Check your longest streak ever
- Navigate between months
- Hover over days to see problem counts

**Today's Summary Cards:**
- 🎯 Today's Goal: 3 problems
- ✅ Completed: Your progress today
- 📊 Total: All-time problem count

#### 🗺️ Roadmap Tab
Track your progress across 10 DSA categories:
1. **Arrays** - 50 problems
2. **Strings** - 40 problems
3. **Linked Lists** - 30 problems
4. **Trees** - 45 problems
5. **Graphs** - 35 problems
6. **Dynamic Programming** - 40 problems
7. **Sorting** - 25 problems
8. **Searching** - 20 problems
9. **Stack & Queue** - 30 problems
10. **Heap** - 25 problems

Each category shows:
- Progress bar with percentage
- Problems completed / Total problems
- Color-coded icon

#### ✅ Tasks Tab
Manage your custom learning tasks:

**Add a Task:**
1. Click "Add Task" button
2. Enter task title (e.g., "Solve Two Sum problem")
3. Select category (Arrays, Strings, etc.)
4. Choose difficulty (Easy, Medium, Hard)
5. Set optional deadline
6. Click "Add Task"

**Complete a Task:**
- Click the checkbox next to the task
- Task turns green and gets a checkmark
- Calendar and stats update automatically
- Your streak increases!

**Delete a Task:**
- Click the trash icon on the right
- Task is removed permanently

#### 📊 Statistics Tab
View detailed analytics:

**By Difficulty:**
- Easy: X / 100 problems
- Medium: X / 150 problems
- Hard: X / 80 problems

**By Category:**
- Top 5 categories with problem counts
- Visual breakdown of your focus areas

### Step 4: Solve Problems
When you solve a problem in the LeetCode Editor:
1. Write your code
2. Click "Submit"
3. Get "Accepted" ✅
4. **Automatic tracking happens:**
   - Calendar updates (today +1)
   - Stats update (difficulty + category)
   - Streak recalculates
   - Progress bars update

### Step 5: Close the Tracker
Click the **X** button in the top-right corner or click outside the modal.

## Tips for Maximum Productivity

### 🔥 Maintain Your Streak
- Solve at least 1 problem per day
- Check your calendar daily
- Set reminders for coding time

### 🎯 Set Daily Goals
- Use the Tasks tab to plan your day
- Add 3-5 tasks each morning
- Check them off as you complete

### 📈 Track Progress
- Review your roadmap weekly
- Focus on weak categories
- Celebrate milestones!

### 🏆 Unlock Achievements
Complete problems to earn certificates:
- 10 problems: DSA Beginner
- 25 problems: Problem Solver
- 50 problems: Algorithm Expert
- 100 problems: DSA Master
- 150 problems: DSA Grandmaster

## Keyboard Shortcuts (Future)
- `Ctrl/Cmd + R` - Open Roadmap
- `Esc` - Close Roadmap
- `Ctrl/Cmd + T` - Add Task

## Troubleshooting

### Roadmap button not visible?
- Make sure you're on the LeetCode Editor page
- Check that you're signed in with Clerk

### Data not saving?
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify `VITE_API_URL` environment variable

### Streak not updating?
- Complete at least one task or problem
- Refresh the roadmap tracker
- Check that today's date shows activity in calendar

## Data Privacy
- All data stored locally on the server
- One file per user: `backend/data/roadmap/{userId}.json`
- No data shared with third parties
- Delete your data by removing your user file

## Need Help?
- Check the console for error messages
- Run `node test-roadmap-api.js` to test backend
- Ensure backend server is running: `node backend/server.js`

---

**Happy Coding! 🚀**

Track your progress, maintain your streak, and become a DSA master!

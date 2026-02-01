# Quick Start - LeetCode Backend

## The Issue
Your LeetCode editor needs the backend running on **port 3001** to execute code.

## Solution: Start the Backend

### Option 1: Using the start script
```bash
cd backend
npm start
```

### Option 2: Using the batch file (Windows)
```bash
start-backend.bat
```

### Option 3: Manual start
```bash
cd backend
node server.js
```

## Verify Backend is Running

Open your browser and go to:
```
http://localhost:3001/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "version": "1.0.0",
  "geminiConfigured": true
}
```

## Test LeetCode Routes

### Test Run Endpoint
```bash
curl -X POST http://localhost:3001/api/leetcode/run ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"function twoSum(nums, target) { return [0, 1]; }\",\"language\":\"javascript\",\"testCases\":[{\"input\":\"[2,7,11,15], 9\",\"expected\":\"[0,1]\"}]}"
```

### Test Submit Endpoint
```bash
curl -X POST http://localhost:3001/api/leetcode/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"function twoSum(nums, target) { return [0, 1]; }\",\"language\":\"javascript\",\"problemId\":\"1\"}"
```

## Common Issues

### Issue: "Failed to fetch"
**Cause:** Backend is not running  
**Solution:** Start the backend using one of the methods above

### Issue: "EADDRINUSE: address already in use"
**Cause:** Port 3001 is already in use  
**Solution:** 
1. Find and kill the process using port 3001:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

2. Or change the port in `backend/.env`:
```env
PORT=3002
```

Then update `.env` in root:
```env
VITE_BACKEND_URL=http://localhost:3002
VITE_API_BASE_URL=http://localhost:3002
```

### Issue: "Module not found"
**Cause:** Dependencies not installed  
**Solution:**
```bash
cd backend
npm install
```

## Full Setup (First Time)

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Copy example env file
copy .env.example .env

# Edit .env and add your Gemini API key
GEMINI_API_KEY=your_key_here
PORT=3001
```

3. **Start backend:**
```bash
npm start
```

4. **Start frontend (in another terminal):**
```bash
npm run dev
```

5. **Open browser:**
```
http://localhost:5173
```

## Backend Console Output

When backend starts successfully, you should see:
```
🚀 Codex Backend running on port 3001
📊 Health check: http://localhost:3001/health
🌍 Environment: development
✅ AI Generator routes mounted
✅ Code Explainer routes mounted
✅ Code Completion routes mounted
✅ LeetCode Execution routes mounted
```

## Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/health` | GET | Health check |
| `/api/leetcode/run` | POST | Run code with test cases |
| `/api/leetcode/submit` | POST | Submit solution |
| `/api/ai/generate` | POST | AI code generation |
| `/api/ai/explain-code` | POST | AI code explanation |
| `/api/code-completion` | POST | AI code completion |

## Supported Languages

- ✅ **JavaScript** - Fully working
- ✅ **Python** - Fully working (requires Python installed)
- ✅ **Java** - Fully working (requires JDK installed)
- ✅ **C++** - Fully working (requires g++ installed)
- ✅ **TypeScript** - Works as JavaScript

## Language Requirements

### Python
```bash
# Check if Python is installed
python --version

# Should show: Python 3.x.x
```

### Java
```bash
# Check if Java is installed
java -version
javac -version

# Should show: java version "x.x.x"
```

### C++
```bash
# Check if g++ is installed
g++ --version

# Should show: g++ (GCC) x.x.x
```

## Troubleshooting

### Backend starts but LeetCode editor shows error
1. Check browser console for actual error
2. Verify backend URL in `.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
```
3. Restart frontend dev server

### Code execution fails
1. Check backend console for errors
2. Verify language compiler is installed
3. Check file permissions in temp directory

### Slow execution
- Normal for first run (compilers need to warm up)
- Java/C++ compilation takes 1-2 seconds
- Python/JavaScript execute instantly

## Quick Commands

```bash
# Start everything
npm run start:all

# Start backend only
cd backend && npm start

# Start frontend only
npm run dev

# Check backend health
curl http://localhost:3001/health

# View backend logs
cd backend && npm start

# Stop backend
Ctrl+C
```

## Success Checklist

- [ ] Backend running on port 3001
- [ ] Health check returns OK
- [ ] Frontend can connect to backend
- [ ] LeetCode editor loads
- [ ] Can run JavaScript code
- [ ] Can submit solutions
- [ ] User stats update

## Next Steps

Once backend is running:
1. Open LeetCode editor in browser
2. Write some code
3. Click "Run" to test
4. Click "Submit" to submit solution
5. Check user stats in dropdown

Your LeetCode editor is now fully functional! 🎉

# Codex Deployment Guide

This guide will help you deploy the Codex application to Render.com and troubleshoot common issues.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Git repository (GitHub/GitLab)
- Render.com account

### Automated Deployment

#### Windows:
```bash
deploy.bat
```

#### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Manual Render.com Deployment

### Step 1: Prepare Your Repository
1. Push your code to GitHub or GitLab
2. Ensure all files are committed and pushed

### Step 2: Deploy Backend Service

1. **Create New Web Service** on Render.com
2. **Connect Repository** and select your repo
3. **Configure Service:**
   - **Name:** `codex-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   BCRYPT_ROUNDS=12
   RATE_LIMIT_POINTS=100
   RATE_LIMIT_DURATION=60
   CODE_TIMEOUT=5000
   MAX_CODE_LENGTH=10000
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

5. **Deploy** the service

### Step 3: Deploy Frontend Service

1. **Create New Static Site** on Render.com
2. **Connect Repository** (same repo)
3. **Configure Service:**
   - **Name:** `codex-frontend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=Codex
   VITE_APP_VERSION=1.0.0
   ```

5. **Deploy** the service

### Step 4: Update Backend with Frontend URL

1. Go to your backend service settings
2. Update the `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy the backend service

## 🔧 Troubleshooting Common Issues

### Issue 1: "Output can't see, no test cases render"

**Problem:** Test cases are not displaying or executing properly.

**Solutions:**

1. **Check API Connection:**
   ```javascript
   // In browser console, check if API is accessible
   fetch('https://your-backend-url.onrender.com/health')
     .then(r => r.json())
     .then(console.log)
   ```

2. **Verify Environment Variables:**
   - Frontend: `VITE_API_URL` should point to backend
   - Backend: `FRONTEND_URL` should point to frontend

3. **Check CORS Configuration:**
   ```javascript
   // In backend/server.js, ensure CORS is properly configured
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```

4. **Test Case Component Fix:**
   - Ensure `TestCaseRenderer` component is properly imported
   - Check if problem data includes `testCases` array
   - Verify JavaScript execution sandbox is working

### Issue 2: "Render.com Dashboard Issues"

**Problem:** Services not starting or showing errors in Render dashboard.

**Solutions:**

1. **Check Build Logs:**
   - Go to your service in Render dashboard
   - Click on "Logs" tab
   - Look for build/runtime errors

2. **Common Build Errors:**
   ```bash
   # If npm install fails
   rm -rf node_modules package-lock.json
   npm install
   
   # If build fails due to memory
   # Add to package.json scripts:
   "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
   ```

3. **Backend Health Check:**
   ```bash
   # Test if backend is responding
   curl https://your-backend-url.onrender.com/health
   ```

4. **Frontend Build Issues:**
   ```bash
   # Local test build
   npm run build
   npm run preview
   ```

### Issue 3: "API Requests Failing"

**Problem:** Frontend can't communicate with backend.

**Solutions:**

1. **Check Network Tab:** Open browser dev tools → Network tab
2. **Verify URLs:** Ensure API URLs are correct
3. **CORS Issues:** Check browser console for CORS errors
4. **Environment Variables:** Verify `VITE_API_URL` is set correctly

### Issue 4: "Test Cases Not Executing"

**Problem:** Code execution not working properly.

**Solutions:**

1. **Update TestCaseRenderer Component:**
   ```jsx
   // Add error handling and better logging
   const runTestCases = async () => {
     console.log('Running test cases...', problem.testCases);
     // ... rest of the function
   };
   ```

2. **Check Problem Data Structure:**
   ```javascript
   // Ensure problems have this structure:
   {
     id: 1,
     title: "Problem Title",
     testCases: [
       {
         input: { nums: [2, 7, 11, 15], target: 9 },
         expected: [0, 1]
       }
     ]
   }
   ```

3. **Add Debug Logging:**
   ```jsx
   // In TestCaseRenderer component
   useEffect(() => {
     console.log('Problem data:', problem);
     console.log('Test cases:', problem?.testCases);
   }, [problem]);
   ```

## 📊 Performance Optimization

### Frontend Optimization
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          monaco: ['@monaco-editor/react']
        }
      }
    }
  }
});
```

### Backend Optimization
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use('/api/problems', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

## 🔐 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets

## 📝 Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.onrender.com
JWT_SECRET=your-super-secret-key
BCRYPT_ROUNDS=12
RATE_LIMIT_POINTS=100
RATE_LIMIT_DURATION=60
CODE_TIMEOUT=5000
MAX_CODE_LENGTH=10000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_NAME=Codex
VITE_APP_VERSION=1.0.0
```

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check Render Logs:** Always start with the deployment logs
2. **Test Locally:** Ensure everything works locally first
3. **Browser Console:** Check for JavaScript errors
4. **Network Tab:** Verify API requests are being made correctly
5. **Health Endpoints:** Test `/health` endpoint on backend

## 📞 Support

For additional support:
- Check Render.com documentation
- Review browser console errors
- Test API endpoints manually
- Verify environment variables are set correctly

---

**Last Updated:** December 2024
**Version:** 1.0.0
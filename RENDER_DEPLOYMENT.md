# Deploying Codex Playground to Render.com

This guide will help you deploy your Codex Playground application to Render.com with a MongoDB database.

## Prerequisites

1. GitHub repository with your code
2. Render.com account (free)
3. MongoDB Atlas account (free) - for database hosting

## Step 1: Set up MongoDB Atlas (Free Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project called "Codex Playground"

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "codex-cluster")
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like):
     ```
     mongodb+srv://<username>:<password>@codex-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name at the end: `/codex-playground`

## Step 2: Deploy to Render.com

1. **Connect GitHub Repository**
   - Go to [Render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your Codex Playground code

2. **Configure Environment Variables**
   - After connecting the repo, Render will read your `render.yaml`
   - You'll need to manually set the `MONGODB_URI` environment variable
   - In the Render dashboard, go to your backend service
   - Go to "Environment" tab
   - Add the environment variable:
     - Key: `MONGODB_URI`
     - Value: Your MongoDB Atlas connection string from Step 1

3. **Deploy**
   - Click "Apply" to start the deployment
   - Render will automatically deploy both frontend and backend services
   - Wait for both services to build and deploy successfully

## Step 3: Verify Deployment

1. **Check Backend Health**
   - Go to your backend service URL + `/health`
   - You should see a JSON response with status "OK" and database status

2. **Test Frontend**
   - Visit your frontend URL
   - Try creating an account and logging in
   - Test the VS Code editor functionality

## Environment Variables Reference

### Backend Environment Variables (Auto-configured by render.yaml)
- `NODE_ENV`: production
- `PORT`: 10000
- `FRONTEND_URL`: Auto-linked to frontend service
- `JWT_SECRET`: Auto-generated secure value
- `BCRYPT_ROUNDS`: 12
- `RATE_LIMIT_MAX`: 100
- `RATE_LIMIT_DURATION`: 60
- `CODE_TIMEOUT`: 5000
- `MAX_CODE_LENGTH`: 10000

### Manual Configuration Required
- `MONGODB_URI`: Your MongoDB Atlas connection string

### Frontend Environment Variables (Auto-configured)
- `VITE_API_URL`: Auto-linked to backend service
- `VITE_APP_NAME`: Codex
- `VITE_APP_VERSION`: 1.0.0

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0
   - Verify database user credentials

2. **Backend Build Failed**
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

3. **Frontend Not Loading**
   - Check if VITE_API_URL is correctly set
   - Verify the build command completed successfully
   - Check browser console for errors

### Logs and Monitoring

- **Backend Logs**: Go to your backend service → "Logs" tab
- **Frontend Logs**: Go to your frontend service → "Logs" tab
- **Health Check**: Visit `https://your-backend-url.onrender.com/health`

## Free Tier Limitations

- **Render Free Tier**:
  - Services sleep after 15 minutes of inactivity
  - 750 hours/month of runtime
  - Limited bandwidth and build minutes

- **MongoDB Atlas Free Tier**:
  - 512 MB storage
  - Shared RAM and vCPU
  - No backup/restore

## Scaling Up

When you're ready to scale:

1. **Render**: Upgrade to paid plans for always-on services
2. **MongoDB Atlas**: Upgrade to dedicated clusters for better performance
3. **CDN**: Add Cloudflare or similar for better global performance

## Support

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **GitHub Issues**: Create issues in your repository for app-specific problems

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] GitHub repository connected to Render
- [ ] MONGODB_URI environment variable set in Render
- [ ] Both services deployed successfully
- [ ] Health check endpoint returns OK
- [ ] Frontend loads and connects to backend
- [ ] User registration/login works
- [ ] VS Code editor functions properly

Your Codex Playground should now be live and accessible to users worldwide! 🚀
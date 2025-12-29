#!/bin/bash

# Codex Deployment Script for Render.com
echo "🚀 Starting Codex deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies for frontend
echo "📦 Installing frontend dependencies..."
npm install

# Install dependencies for backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Frontend build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Create production environment file for backend
echo "⚙️ Setting up production environment..."
cat > backend/.env.production << EOL
NODE_ENV=production
PORT=\${PORT:-10000}
FRONTEND_URL=\${FRONTEND_URL:-https://codex-frontend.onrender.com}
JWT_SECRET=\${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
BCRYPT_ROUNDS=12
RATE_LIMIT_POINTS=100
RATE_LIMIT_DURATION=60
CODE_TIMEOUT=5000
MAX_CODE_LENGTH=10000
EOL

# Create Render.com specific files
echo "📄 Creating Render.com configuration..."

# Create build script for Render
cat > build.sh << 'EOL'
#!/bin/bash
echo "Building Codex application..."

# Install frontend dependencies and build
npm install
npm run build

# Install backend dependencies
cd backend
npm install
cd ..

echo "Build completed successfully!"
EOL

chmod +x build.sh

# Create start script for backend
cat > backend/start.sh << 'EOL'
#!/bin/bash
echo "Starting Codex backend server..."

# Use production environment if available
if [ -f ".env.production" ]; then
    export $(cat .env.production | xargs)
fi

# Start the server
node server.js
EOL

chmod +x backend/start.sh

# Update package.json scripts for deployment
echo "📝 Updating package.json for deployment..."

# Create a temporary package.json with deployment scripts
cat > package.json.tmp << 'EOL'
{
  "name": "codex-leetcode-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "start": "npm run build && npm run preview",
    "deploy:build": "./build.sh",
    "deploy:backend": "cd backend && npm start"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
EOL

# Backup original and use deployment version
mv package.json package.json.backup
mv package.json.tmp package.json

echo "🔧 Creating Render.com deployment configuration..."

# Create render.yaml for automatic deployment
cat > render.yaml << 'EOL'
services:
  # Backend API Service
  - type: web
    name: codex-backend
    env: node
    plan: free
    region: oregon
    buildCommand: cd backend && npm install
    startCommand: cd backend && node server.js
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: FRONTEND_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: BCRYPT_ROUNDS
        value: 12
      - key: RATE_LIMIT_POINTS
        value: 100
      - key: RATE_LIMIT_DURATION
        value: 60
      - key: CODE_TIMEOUT
        value: 5000
      - key: MAX_CODE_LENGTH
        value: 10000

  # Frontend Service
  - type: web
    name: codex-frontend
    env: static
    plan: free
    region: oregon
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: false
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=31536000, immutable
      - path: /index.html
        name: Cache-Control
        value: public, max-age=0, must-revalidate
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: codex-backend
          property: url
      - key: VITE_APP_NAME
        value: Codex
      - key: VITE_APP_VERSION
        value: 1.0.0
EOL

echo "📋 Deployment checklist:"
echo "✅ Frontend dependencies installed"
echo "✅ Backend dependencies installed"
echo "✅ Frontend built successfully"
echo "✅ Production environment configured"
echo "✅ Render.com configuration created"
echo "✅ Build and start scripts created"

echo ""
echo "🌐 Next steps for Render.com deployment:"
echo "1. Push your code to GitHub/GitLab"
echo "2. Connect your repository to Render.com"
echo "3. Render will automatically detect the render.yaml file"
echo "4. Your services will be deployed automatically"
echo ""
echo "📝 Manual deployment alternative:"
echo "1. Create a new Web Service on Render.com"
echo "2. Connect your repository"
echo "3. Use these settings:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm run preview"
echo "   - Publish Directory: dist"
echo ""
echo "🔧 Backend deployment:"
echo "1. Create another Web Service for the backend"
echo "2. Root Directory: backend"
echo "3. Build Command: npm install"
echo "4. Start Command: node server.js"
echo ""
echo "🎉 Deployment preparation completed!"

# Restore original package.json
mv package.json.backup package.json

echo "✨ Ready for deployment to Render.com!"
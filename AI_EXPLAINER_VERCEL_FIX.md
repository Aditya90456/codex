# AI Code Explainer - Vercel Deployment Fix

## Problem

The AI Code Explainer requires a backend server to call the Gemini API, but Vercel only hosts the frontend. The backend needs to be deployed separately.

## Solution Options

### Option 1: Deploy Backend to Render (Recommended)

This is the easiest and most reliable solution.

#### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard:** https://render.com
2. **Create New Web Service**
3. **Connect Your Repository**
4. **Configure Service:**
   ```
   Name: codex-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables:**
   ```
   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. **Deploy** and copy the service URL (e.g., `https://codex-backend.onrender.com`)

#### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add Variable:**
   ```
   Name: VITE_BACKEND_URL
   Value: https://codex-backend.onrender.com
   ```
3. **Redeploy** your Vercel app

#### Step 3: Update Backend CORS

Make sure your backend allows requests from Vercel:

```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',
  'https://your-custom-domain.com'
];
```

### Option 2: Use Vercel Serverless Functions

Create a serverless function in your Vercel project.

#### Step 1: Create API Directory

```bash
mkdir -p api
```

#### Step 2: Create Serverless Function

Create `api/explain-code.js`:

```javascript
// api/explain-code.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, problemTitle, language = 'javascript' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert DSA tutor. Analyze this code solution and create a step-by-step animated explanation.

Problem: ${problemTitle}
Language: ${language}
Code:
${code}

Provide a JSON response with this EXACT structure:
{
  "algorithm": "Name of the algorithm/technique used",
  "timeComplexity": "Big O notation",
  "spaceComplexity": "Big O notation",
  "steps": [
    {
      "id": 1,
      "title": "Step title",
      "description": "What happens in this step",
      "explanation": "Why this step is important"
    }
  ],
  "keyInsights": [
    "Important insight 1",
    "Important insight 2",
    "Important insight 3"
  ]
}

Make it educational and clear. Focus on the algorithm logic, not just code syntax. Include 4-6 steps.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Try to parse JSON from response
    let explanation;
    try {
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       responseText.match(/```\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      explanation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return res.json({
        explanation: {
          algorithm: "Algorithm Analysis",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          steps: [
            {
              id: 1,
              title: "Understanding the Problem",
              description: "Analyze the problem requirements and constraints",
              explanation: "First step is to understand what the problem is asking for."
            },
            {
              id: 2,
              title: "Choosing an Approach",
              description: "Select the most efficient algorithm",
              explanation: "Consider different approaches and their trade-offs."
            },
            {
              id: 3,
              title: "Implementation",
              description: "Code the solution step by step",
              explanation: "Implement the chosen algorithm with clean code."
            }
          ],
          keyInsights: [
            "Understanding the problem is crucial",
            "Consider time and space complexity",
            "Test with edge cases"
          ]
        }
      });
    }

    res.json({ explanation });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      error: 'Failed to generate explanation',
      details: error.message
    });
  }
}
```

#### Step 3: Install Dependencies

```bash
npm install @google/generative-ai
```

#### Step 4: Update AICodeExplainer Component

```javascript
// src/components/AI/AICodeExplainer.jsx
const startExplanation = async () => {
  setIsExplaining(true);
  setExplanation(null);
  
  try {
    // Use Vercel serverless function or external backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api';
    const response = await fetch(`${backendUrl}/explain-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        problemTitle: problemTitle,
        language: language
      })
    });
    // ... rest of the code
  }
};
```

#### Step 5: Add Environment Variable to Vercel

```
GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
```

### Option 3: Disable AI Explainer in Production (Temporary)

If you want to deploy quickly without the AI explainer:

```javascript
// src/components/AI/AICodeExplainer.jsx
const AICodeExplainer = ({ code, problemTitle, language = 'javascript' }) => {
  // Check if in production without backend
  const isProduction = import.meta.env.PROD;
  const hasBackend = import.meta.env.VITE_BACKEND_URL;
  
  if (isProduction && !hasBackend) {
    return (
      <div className="p-6 bg-slate-900 rounded-lg border border-slate-700">
        <div className="text-center">
          <Brain className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">AI Code Explainer</h3>
          <p className="text-gray-400">
            AI explanations are currently unavailable in production.
            <br />
            Please run locally to use this feature.
          </p>
        </div>
      </div>
    );
  }
  
  // ... rest of the component
};
```

## Recommended Approach

**Use Option 1 (Render Backend)** because:
- ✅ Most reliable
- ✅ Keeps backend separate from frontend
- ✅ Easy to scale
- ✅ Free tier available
- ✅ No code changes needed

## Quick Setup Guide

### 1. Deploy Backend to Render

```bash
# Your backend is already ready in the 'backend' folder
# Just deploy it to Render with these settings:
```

**Render Settings:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `GEMINI_API_KEY`: Your Gemini API key
  - `PORT`: 3001
  - `NODE_ENV`: production
  - `FRONTEND_URL`: Your Vercel URL

### 2. Update Vercel

**Add Environment Variable:**
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

**Redeploy** (automatic if connected to GitHub)

### 3. Test

Visit your Vercel app and try the AI Code Explainer:
1. Go to `/dsa-ai`
2. Select a problem
3. Write some code
4. Click "Explain My Code"

## Troubleshooting

### Error: "Failed to connect to AI service"

**Check:**
1. Backend is deployed and running on Render
2. `VITE_BACKEND_URL` is set in Vercel
3. Backend CORS allows your Vercel domain
4. Gemini API key is valid

### Error: "CORS policy blocked"

**Fix in backend/server.js:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app', // Add your Vercel URL
  /\.vercel\.app$/ // Allow all Vercel preview deployments
];
```

### Backend is slow on first request

Render free tier sleeps after inactivity. First request takes ~30 seconds to wake up. Consider:
- Upgrading to paid tier
- Using a keep-alive service
- Adding a loading message

## Cost Estimate

- **Vercel:** Free (Hobby plan)
- **Render:** Free (with limitations) or $7/month
- **Gemini API:** Free tier (60 requests/minute)

**Total:** $0-7/month

---

**Status:** Ready to deploy
**Recommended:** Option 1 (Render Backend)
**Time to Setup:** ~10 minutes

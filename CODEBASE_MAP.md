# Codex Codebase Map — For Agentic AI

> **Purpose**: Know every line of code so you can work effectively with agentic AI (Cursor, Copilot, etc.). This map explains what each file does and how data flows.

---

## 1. Application Bootstrap (Entry Point)

### `index.html`
- **Line 17**: `<div id="root"></div>` — React mount point
- **Line 17**: `<script type="module" src="/src/main.jsx"></script>` — Loads main entry

### `src/main.jsx` — **ACTUAL ENTRY POINT**
```
Line 1-2:  React imports (StrictMode, createRoot)
Line 3-4:  Global CSS (index.css, responsive.css)
Line 5:    ⚠️ LOADS App-ClerkNew.jsx (NOT App.jsx!)
Line 6:    ErrorBoundary for crash recovery
Line 7:    turnstile-suppressor (Cloudflare Turnstile)
Line 8-11: Mobile viewport fixes
Line 13-19: React root render with StrictMode + ErrorBoundary wrapper
```

### `vite.config.js`
- **Line 16-27**: Code splitting — React, Monaco, Clerk, UI libs in separate chunks
- **Line 38-39**: Dev server on port 5173, host 0.0.0.0
- **Line 44-47**: CSP disabled for dev

---

## 2. App Structure (Clerk Auth Version)

### `src/App-ClerkNew.jsx` — **MAIN APP (in use)**
```
Line 1-7:   ClerkProvider, Router, Auth imports
Line 9-22:  Component imports (WelcomeScreenModern, CodexEditorModern, etc.)
Line 25-26: Validates Clerk config on load
Line 28-108: AppContent — Router with Routes
  - Public: /, /sign-in, /sign-up, /spotify/callback
  - Protected: /dashboard, /profile, /editor, /web, /dsa-ai, /ai, /react-ai, /leetcode
Line 111-131: App — Shows ClerkSetupGuide if invalid; else ClerkProvider → AuthProvider → AppContent
```

**Route → Component mapping:**
| Route       | Component             | Protected |
|------------|------------------------|-----------|
| `/`        | WelcomeScreenModern    | No        |
| `/sign-in` | SignInPage            | No        |
| `/sign-up` | SignUpPage            | No        |
| `/dashboard` | Dashboard           | Yes       |
| `/profile` | ProfilePage           | Yes       |
| `/editor`  | CodexEditorModern     | Yes       |
| `/web`     | AdvancedWebEditor     | Yes       |
| `/dsa-ai`  | DSAWithAIPage         | Yes       |
| `/ai`      | AIUniversalCreatorModern | Yes    |
| `/react-ai`| ReactCodeAI           | Yes       |
| `/leetcode`| LeetCodeEditor        | Yes       |

---

## 3. Authentication Flow

### `src/contexts/AuthContext.jsx`
- Wraps Clerk's `useUser` and `useAuth`
- Exposes: `user`, `isSignedIn`, `isLoaded`, `signOut`, `userName`, `userEmail`, `userImage`
- 5s timeout if Clerk doesn't load

### `src/lib/clerk.js`
- `clerkConfig`: publishableKey, appearance (theme), routing (sign-in/up URLs)
- `validateClerkConfig()`: Checks `VITE_CLERK_PUBLISHABLE_KEY` exists and starts with `pk_`
- SSO providers: Google, GitHub, LinkedIn, Microsoft

### `src/components/Auth/ProtectedRoute.jsx`
- Guards protected routes; redirects to sign-in if not authenticated

---

## 4. API Layer

### `src/services/api.js` — **SINGLE API CLIENT**
- **Base URL**: `VITE_API_URL` or `http://localhost:3001/api`
- **Auth**: `localStorage.getItem('authToken')` → `Authorization: Bearer`
- **Key methods**:
  - Auth: `login`, `register`, `logout`, `getCurrentUser`
  - Problems: `getProblems`, `getProblem`, `getRandomProblem`
  - Execution: `executeCode`, `executeCustomCode`
  - Submissions: `submitSolution`, `getSubmission`, `getUserSubmissions`
  - Dashboard: `getDashboardStats`, `getActivity`, `getLeaderboard`
  - Clerk sync: `syncUserWithBackend(clerkUser)`
  - Projects: CRUD for projects, databases

---

## 5. Backend Structure

### `backend/server.js` — **EXPRESS SERVER (port 3001)**
```
Line 1-9:   Express, CORS, bodyParser, uuid, vm2, dotenv
Line 12-57: CORS — allows localhost:5173, Vercel, Netlify, Render
Line 61-66: Route imports (ai-generator, code-explainer, code-completion, leetcode, github)
Line 68-71: In-memory: users, problems, submissions
Line 74-139: sampleProblems (Two Sum, Reverse String) — starter code for JS, Python, Java, C++
Line 142-149: Health check GET /health
Line 152-172: Mount routes at /api/ai, /api/code-completion, /api/leetcode, /api/github, /api/spotify, /api/jamendo
Line 176-385: REST: /api/problems, /api/execute, /api/submit, /api/execute/custom
Line 389-413: executeJavaScript() — VM2 sandbox, test cases
Line 415-444: executeCustomJavaScript() — Playground execution
```

### Backend Routes
| Path                  | File                         | Purpose              |
|-----------------------|------------------------------|----------------------|
| `/api/ai/*`           | ai-generator.js, code-explainer.js | AI code gen      |
| `/api/code-completion`| code-completion.js           | Autocomplete         |
| `/api/leetcode`       | leetcode-execute.js          | LeetCode execution   |
| `/api/github`         | github.js                    | GitHub integration   |
| `/api/spotify`        | spotify.js                   | Spotify API          |
| `/api/jamendo`        | jamendo.js                   | Free music API       |

---

## 6. Key Frontend Components

### Editors (Monaco-based)
- **CodexEditorModern.jsx** — Main code editor (Android-style); ⚠️ uses `eval` (line ~159)
- **AdvancedWebEditor.jsx** — Web IDE with templates
- **LeetCodeEditor.jsx** — LeetCode-style problems

### AI Components
- **AIUniversalCreatorModern.jsx** — General AI code generation
- **ReactCodeAI.jsx** — React-specific AI
- **AICodeExplainer.jsx** — Code explanation

### Pages
- **WelcomeScreenModern.jsx** — Landing / welcome
- **DSAWithAIPage.jsx** — DSA + AI features
- **ProfilePage.jsx** — User profile
- **SignInPage.jsx**, **SignUpPage.jsx** — Auth pages

### Data
- **src/data/dsaProblems.js** — DSA problem definitions
- **src/data/dsaSolutions.js** — Solutions
- **src/data/roadmapData.js** — Roadmap content

---

## 7. Environment Variables

### Frontend (`.env`)
```
VITE_API_URL              → Backend URL (default: http://localhost:3001/api)
VITE_CLERK_PUBLISHABLE_KEY → Clerk auth (required, must start with pk_)
```

### Backend (`backend/.env`)
```
PORT              → Server port (default: 3001)
GEMINI_API_KEY    → For AI routes
FRONTEND_URL      → For CORS
(+ Spotify, GitHub, etc. as needed)
```

---

## 8. File Change Quick Reference

| Want to change...           | Edit this file                    |
|----------------------------|------------------------------------|
| Entry point / top-level    | `src/main.jsx`                     |
| Routes or which App loads  | `src/main.jsx` (line 5), `App-ClerkNew.jsx` |
| Auth / Clerk config        | `src/lib/clerk.js`, `AuthContext.jsx` |
| API calls from frontend    | `src/services/api.js`              |
| Backend REST + execution   | `backend/server.js`                |
| AI generation / explainer  | `backend/routes/ai-generator.js`, `code-explainer.js` |
| LeetCode execution         | `backend/routes/leetcode-execute.js` |
| Welcome / landing page     | `src/components/WelcomeScreenModern.jsx` |
| Main editor UI             | `src/components/CodexEditorModern.jsx` |
| DSA problems content       | `src/data/dsaProblems.js`          |

---

## 9. Alternative App Versions (Not in use)

`main.jsx` loads **App-ClerkNew.jsx**. These exist but are unused:
- `App.jsx` — Simpler routes, no Clerk protection
- `App-Production.jsx`, `App-Simple.jsx`, etc. — Other variants

---

## 10. Agentic AI Tips

1. **Always check `main.jsx` line 5** — It defines which App is active.
2. **API base**: Frontend uses `src/services/api.js`; backend is `backend/server.js`.
3. **Protected routes** are wrapped in `<ProtectedRoute>` in `App-ClerkNew.jsx`.
4. **Clerk** is required; if `VITE_CLERK_PUBLISHABLE_KEY` is missing, `ClerkSetupGuide` is shown.
5. **Code execution** is JS-only in `server.js`; uses `vm2` for sandboxing.
6. **Data** — Problems/submissions are in-memory in `server.js`; no DB by default.

---

*Last updated: Codebase scan. Use this map when prompting AI agents for changes.*

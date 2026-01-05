# Codex Backend

Simple, lightweight backend for the Codex Playground.

## Features

- ✅ Problem management (in-memory storage)
- ✅ Code execution (JavaScript only)
- ✅ Submission tracking
- ✅ Custom code playground
- ✅ CORS enabled
- ✅ Sample problems included

## Quick Start

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem

### Code Execution
- `POST /api/execute` - Execute code with test cases
- `POST /api/execute/custom` - Execute custom code (playground)

### Submissions
- `POST /api/submit` - Submit solution
- `GET /api/submissions` - Get all submissions

### Health
- `GET /health` - Health check

## Sample Problems

The backend comes with 2 sample problems:
1. **Two Sum** (Easy)
2. **Reverse String** (Easy)

## Code Execution

Currently supports JavaScript only. Other languages will return a "not implemented" message.

## Storage

Uses in-memory storage for simplicity. Data is lost when the server restarts.

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)
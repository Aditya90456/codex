# Codex LeetCode Backend

A robust backend service for LeetCode-style coding problems with code execution, test case validation, and submission tracking.

## Features

- 🚀 **Problem Management**: CRUD operations for coding problems
- ⚡ **Code Execution**: Safe code execution with VM2 sandbox
- 🧪 **Test Case Validation**: Automatic test case running and validation
- 📊 **Submission Tracking**: Track user submissions and statistics
- 🔒 **Security**: Rate limiting, input validation, and sandboxed execution
- 🎯 **Multi-language Support**: JavaScript (Python, Java, C++ coming soon)
- 📈 **Statistics**: User progress tracking and problem statistics

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Problems

- `GET /api/problems` - Get all problems with pagination and filtering
- `GET /api/problems/:id` - Get specific problem by ID
- `GET /api/problems/:id/stats` - Get problem statistics
- `GET /api/problems/random/pick` - Get random problem

### Code Execution

- `POST /api/execute` - Execute code with test cases
- `POST /api/execute/custom` - Run custom code

### Submissions

- `POST /api/submissions` - Submit solution
- `GET /api/submissions/:id` - Get submission by ID
- `GET /api/submissions/user/:userId` - Get user submissions
- `GET /api/submissions/user/:userId/stats` - Get user statistics

## Example Usage

### Get All Problems

```bash
curl "http://localhost:3001/api/problems?page=1&limit=5&difficulty=Easy"
```

### Execute Code

```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "var twoSum = function(nums, target) { return [0, 1]; };",
    "language": "javascript",
    "problemId": 1
  }'
```

### Submit Solution

```bash
curl -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "code": "var twoSum = function(nums, target) { /* solution */ };",
    "language": "javascript"
  }'
```

## Problem Structure

Each problem includes:

```javascript
{
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  category: "Array",
  description: "Problem description...",
  examples: [...],
  constraints: [...],
  starterCode: {
    javascript: "// starter code",
    python: "# starter code"
  },
  testCases: [
    {
      input: { nums: [2, 7, 11, 15], target: 9 },
      expected: [0, 1]
    }
  ]
}
```

## Security Features

- **Rate Limiting**: 100 requests per minute per IP
- **Code Sandboxing**: VM2 for safe JavaScript execution
- **Input Validation**: Comprehensive request validation
- **Timeout Protection**: 5-second execution timeout
- **Memory Limits**: Controlled memory usage

## Development

### Adding New Problems

1. Add problem to `backend/data/problems.js`
2. Include test cases and starter code
3. Test with the execution endpoint

### Adding Language Support

1. Extend the execution engine in `routes/execute.js`
2. Add language-specific code runners
3. Update problem starter code templates

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper database (MongoDB/PostgreSQL)
3. Set up authentication and user management
4. Configure HTTPS and security headers
5. Set up monitoring and logging

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **VM2** - Code execution sandbox
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiter** - Request limiting

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## License

MIT License - see LICENSE file for details
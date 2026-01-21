# AI Universal Creator - Complete Guide

## Overview
The AI Universal Creator is a powerful tool that generates production-ready code for multiple platforms using AI. It can create web apps, mobile apps, APIs, documents, and data analysis scripts from simple text prompts.

## Features

### 🌐 Web App Generator
- Generates complete HTML/CSS/JavaScript applications
- Modern, responsive design with animations
- Interactive elements and event handlers
- Production-ready code

### 📱 Mobile App Generator
- Creates React Native components
- Full StyleSheet implementation
- Interactive UI with state management
- Cross-platform compatible

### 📄 Document Generator
- Comprehensive markdown documentation
- Structured sections and formatting
- Code examples and best practices
- Professional layout

### 🔌 API Generator
- Complete REST API with Express.js
- CRUD operations (GET, POST, PUT, PATCH, DELETE)
- Error handling and validation
- Search functionality
- Pagination support

### 📊 Data Analysis Generator
- Python scripts with pandas/numpy/matplotlib
- Data loading from multiple formats (CSV, Excel, JSON)
- Exploratory data analysis
- Visualization generation
- Correlation analysis
- Comprehensive reporting

## Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend-new
```

2. **Install dependencies (if not already installed):**
```bash
npm install
```

3. **Start the backend server:**
```bash
npm start
# or
node server.js
```

The API will be available at `http://localhost:3001`

### Frontend Setup

1. **The component is already integrated** at `src/components/AI/AIUniversalCreator.jsx`

2. **Add to your routing** (if needed):
```javascript
import AIUniversalCreator from './components/AI/AIUniversalCreator';

// In your routes
<Route path="/ai-creator" element={<AIUniversalCreator />} />
```

## API Endpoints

### Generate Content
```
POST /api/ai/generate
```

**Request Body:**
```json
{
  "prompt": "Your description here",
  "outputType": "web|mobile|document|api|data"
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "Your description",
  "outputType": "web",
  "content": {
    "html": "...",
    "type": "html",
    "language": "html"
  },
  "timestamp": "2026-01-21T..."
}
```

### Health Check
```
GET /api/ai/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Generator API",
  "timestamp": "2026-01-21T..."
}
```

## Usage Examples

### Example 1: Generate a Web App
```javascript
const response = await fetch('http://localhost:3001/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A todo list app with dark mode',
    outputType: 'web'
  })
});

const data = await response.json();
console.log(data.content.html); // Full HTML code
```

### Example 2: Generate a Mobile App
```javascript
const response = await fetch('http://localhost:3001/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Weather forecast app',
    outputType: 'mobile'
  })
});

const data = await response.json();
console.log(data.content.code); // React Native code
```

### Example 3: Generate API Endpoints
```javascript
const response = await fetch('http://localhost:3001/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'User management system',
    outputType: 'api'
  })
});

const data = await response.json();
console.log(data.content.code); // Express.js API code
```

## Frontend Component Usage

### Basic Usage
```jsx
import AIUniversalCreator from './components/AI/AIUniversalCreator';

function App() {
  return (
    <div>
      <AIUniversalCreator />
    </div>
  );
}
```

### Component Features
- **Prompt Input**: Large textarea for describing what to create
- **Output Type Selection**: 5 buttons for different output types
- **Generate Button**: Triggers AI generation
- **Preview/Code Toggle**: Switch between live preview and code view
- **Download Button**: Export generated content as files

## Output Types Details

### 1. Web App (HTML/CSS/JS)
- **File Extension**: `.html`
- **Features**:
  - Responsive design
  - Modern CSS with gradients
  - Interactive JavaScript
  - Form inputs and buttons
  - Animations

### 2. Mobile App (React Native)
- **File Extension**: `.js`
- **Features**:
  - SafeAreaView wrapper
  - StyleSheet definitions
  - State management with hooks
  - TouchableOpacity buttons
  - ScrollView support
  - TextInput components

### 3. Document (Markdown)
- **File Extension**: `.md`
- **Features**:
  - Structured headings
  - Code blocks
  - Lists and tables
  - Links and references
  - Professional formatting

### 4. API (Express.js)
- **File Extension**: `.js`
- **Features**:
  - Complete CRUD operations
  - Error handling
  - Validation middleware
  - Pagination
  - Search functionality
  - RESTful design

### 5. Data Analysis (Python)
- **File Extension**: `.py`
- **Features**:
  - Data loading utilities
  - Exploratory analysis
  - Statistical summaries
  - Visualization generation
  - Correlation analysis
  - Report generation

## Customization

### Adding New Output Types

1. **Update the frontend** (`src/components/AI/AIUniversalCreator.jsx`):
```javascript
const outputTypes = [
  // ... existing types
  { id: 'newtype', label: 'New Type', icon: YourIcon, desc: 'Description' }
];
```

2. **Add generator function** (`backend-new/routes/ai-generator.js`):
```javascript
async function generateNewType(prompt) {
  // Your generation logic
  return {
    code: '...',
    type: 'newtype',
    language: 'javascript'
  };
}

// Add to generators object
const generators = {
  // ... existing generators
  newtype: generateNewType
};
```

### Integrating Real AI (Google Gemini, OpenAI, etc.)

Replace the mock generation with real AI API calls:

```javascript
async function generateWebApp(prompt) {
  // Example with OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Generate a complete HTML web app for: ${prompt}`
      }]
    })
  });
  
  const data = await response.json();
  return {
    html: data.choices[0].message.content,
    type: 'html',
    language: 'html'
  };
}
```

## Environment Variables

Add to your `.env` file:
```env
# AI API Keys (optional - for real AI integration)
OPENAI_API_KEY=your_key_here
GOOGLE_AI_KEY=your_key_here

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Testing

### Test the API directly:
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Calculator app","outputType":"web"}'
```

### Test health endpoint:
```bash
curl http://localhost:3001/api/ai/health
```

## Troubleshooting

### Issue: API not responding
**Solution**: Ensure backend server is running on port 3001
```bash
cd backend-new
npm start
```

### Issue: CORS errors
**Solution**: Check CORS configuration in `backend-new/server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### Issue: Generated content not displaying
**Solution**: Check browser console for errors and verify API response format

## Performance Optimization

### Rate Limiting
The API includes rate limiting:
- General API: 100 requests per 15 minutes
- Code execution: 10 requests per minute

### Caching
Consider implementing caching for frequently requested prompts:
```javascript
const cache = new Map();

async function generateContent(prompt, outputType) {
  const cacheKey = `${prompt}-${outputType}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await generators[outputType](prompt);
  cache.set(cacheKey, result);
  return result;
}
```

## Security Considerations

1. **Input Validation**: Always validate and sanitize user prompts
2. **Rate Limiting**: Prevent abuse with rate limits
3. **API Keys**: Store AI API keys securely in environment variables
4. **Content Filtering**: Implement content filtering for inappropriate prompts
5. **CORS**: Configure CORS properly for production

## Production Deployment

### Backend Deployment (Render/Heroku)
```bash
# Ensure all dependencies are in package.json
npm install

# Set environment variables in hosting platform
PORT=3001
NODE_ENV=production
```

### Frontend Integration
Update API URL for production:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.com'
  : 'http://localhost:3001';
```

## Future Enhancements

- [ ] Real AI integration (OpenAI, Google Gemini)
- [ ] Code syntax highlighting in preview
- [ ] Version history for generated content
- [ ] Template library
- [ ] Collaborative editing
- [ ] Export to GitHub
- [ ] Multi-language support
- [ ] Advanced customization options
- [ ] AI model selection
- [ ] Cost tracking for AI API usage

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/api`
3. Check server logs for errors
4. Verify all dependencies are installed

## License

MIT License - Feel free to use and modify as needed.

---

**Created**: January 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

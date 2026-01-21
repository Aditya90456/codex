# Google Gemini AI Integration Guide

## Overview
The AI Universal Creator now uses Google's Gemini AI to generate real, production-ready code instead of templates. This provides much better quality and more accurate results.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Add API Key to Environment

**For Backend (backend-new):**

1. Navigate to `backend-new` folder
2. Create or edit `.env` file:
```bash
cd backend-new
```

3. Add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**For Root Project:**

Add to your root `.env` file:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Restart Backend Server

```bash
cd backend-new
npm start
```

## How It Works

### With Gemini AI (Recommended)
When `GEMINI_API_KEY` is configured:
- Uses Google's Gemini Pro model
- Generates real, custom code based on your prompt
- Much better quality and accuracy
- Supports complex requirements

### Fallback Mode
When `GEMINI_API_KEY` is NOT configured:
- Uses template-based generation
- Still functional but less customized
- Good for testing without API key

## API Endpoint

```
POST http://localhost:3001/api/ai/generate
```

**Request:**
```json
{
  "prompt": "A todo list app with dark mode",
  "outputType": "web"
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "A todo list app with dark mode",
  "outputType": "web",
  "content": {
    "html": "<!DOCTYPE html>...",
    "type": "html",
    "language": "html"
  },
  "timestamp": "2026-01-21T...",
  "source": "gemini-ai"
}
```

## Output Types

### 1. Web Apps (`outputType: "web"`)
- Generates complete HTML with CSS and JavaScript
- Modern, responsive design
- Interactive features
- Production-ready

### 2. Mobile Apps (`outputType: "mobile"`)
- React Native components
- Complete with StyleSheet
- State management
- Cross-platform compatible

### 3. Documentation (`outputType: "document"`)
- Comprehensive markdown
- Well-structured sections
- Code examples
- Best practices

### 4. APIs (`outputType: "api"`)
- Express.js REST API
- Full CRUD operations
- Error handling
- Validation middleware

### 5. Data Analysis (`outputType: "data"`)
- Python scripts
- Pandas/NumPy/Matplotlib
- Data loading and cleaning
- Visualization functions

## Gemini AI Configuration

### Model Settings
- **Model**: `gemini-pro`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 8000 (long outputs)

### Customization
Edit `backend-new/routes/ai-generator.js` to adjust:

```javascript
generationConfig: {
  temperature: 0.7,      // 0.0 = deterministic, 1.0 = creative
  maxOutputTokens: 8000, // Maximum length
}
```

## Error Handling

The system has multiple fallback layers:

1. **Primary**: Gemini AI generation
2. **Fallback 1**: Template-based generation
3. **Fallback 2**: Error response with details

## Rate Limits

### Gemini AI Free Tier
- 60 requests per minute
- 1,500 requests per day
- Sufficient for development and testing

### Paid Tier
- Higher limits available
- See [Google AI Pricing](https://ai.google.dev/pricing)

## Testing

### Test with Gemini AI
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Calculator app",
    "outputType": "web"
  }'
```

### Check API Status
```bash
curl http://localhost:3001/api/ai/health
```

## Troubleshooting

### Issue: "Gemini API key not configured"
**Solution**: Add `GEMINI_API_KEY` to your `.env` file

### Issue: "Gemini API error: 401"
**Solution**: Your API key is invalid. Get a new one from Google AI Studio

### Issue: "Gemini API error: 429"
**Solution**: Rate limit exceeded. Wait a minute or upgrade to paid tier

### Issue: Generation takes too long
**Solution**: 
- Reduce `maxOutputTokens` in config
- Simplify your prompt
- Check your internet connection

## Best Practices

### Writing Good Prompts

**Good Prompts:**
- ✅ "A todo list app with dark mode and local storage"
- ✅ "Weather forecast mobile app with current location"
- ✅ "REST API for blog posts with authentication"

**Bad Prompts:**
- ❌ "Make an app" (too vague)
- ❌ "The best website ever" (unclear requirements)
- ❌ "Something cool" (no specific features)

### Prompt Tips
1. Be specific about features
2. Mention styling preferences
3. Include technical requirements
4. Specify data structures if needed

## Security

### API Key Security
- ✅ Store in `.env` file (never commit)
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in production
- ❌ Never hardcode API keys
- ❌ Never commit API keys to Git

### Production Deployment
```env
# Production .env
GEMINI_API_KEY=your_production_key
NODE_ENV=production
```

## Cost Optimization

### Free Tier Tips
1. Cache common generations
2. Implement request throttling
3. Use fallback for simple requests
4. Monitor usage in Google Cloud Console

### Caching Example
```javascript
const cache = new Map();

async function generateWithCache(prompt, outputType) {
  const key = `${prompt}-${outputType}`;
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = await generateContentWithGemini(prompt, outputType);
  cache.set(key, result);
  return result;
}
```

## Monitoring

### Check Generation Source
The API response includes a `source` field:
- `"gemini-ai"` - Generated by Gemini AI
- `"fallback"` - Generated by templates
- `"fallback"` with `warning` - AI failed, used template

### Logging
Backend logs show:
```
✓ Gemini AI generation successful
⚠ Gemini API key not configured, using fallback
✗ Gemini AI Error: [error details]
```

## Advanced Features

### Custom System Prompts
Edit system prompts in `ai-generator.js`:

```javascript
const systemPrompts = {
  web: `Your custom prompt for web apps...`,
  mobile: `Your custom prompt for mobile apps...`,
  // ...
};
```

### Multiple AI Models
You can add support for other models:
- OpenAI GPT-4
- Anthropic Claude
- Cohere
- Local models (Ollama)

## Support

### Resources
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [API Reference](https://ai.google.dev/api)
- [Pricing](https://ai.google.dev/pricing)
- [Community Forum](https://discuss.ai.google.dev/)

### Getting Help
1. Check backend logs for errors
2. Verify API key is correct
3. Test with simple prompts first
4. Check rate limits
5. Review Gemini AI status page

## Changelog

### v1.0.0 (Current)
- ✅ Gemini Pro integration
- ✅ 5 output types supported
- ✅ Automatic fallback system
- ✅ Error handling
- ✅ Rate limit management

### Planned Features
- [ ] Streaming responses
- [ ] Multiple model support
- [ ] Generation history
- [ ] User preferences
- [ ] Cost tracking
- [ ] Advanced caching

---

**Status**: ✅ Production Ready
**Last Updated**: January 2026
**Version**: 1.0.0

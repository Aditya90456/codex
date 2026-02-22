# 🚀 Real Code Execution Setup Guide

## Overview

Your LeetCode clone now uses **real code execution APIs** - no backend server needed! Code runs on actual servers and returns real results.

## Execution Services

### 1. Piston API (Primary - FREE)

- **Cost**: Completely FREE
- **No API Key Required**: Works out of the box
- **Languages**: JavaScript, Python, Java, C++, C, C#, Go, Rust, TypeScript, Kotlin, Swift, Ruby, PHP
- **Limits**: Reasonable rate limits for personal projects
- **URL**: https://emkc.org/api/v2/piston

### 2. Judge0 CE (Fallback - Optional)

- **Cost**: FREE tier available
- **API Key**: Required (get from RapidAPI)
- **Languages**: 60+ languages
- **Limits**: 50 requests/day on free tier
- **URL**: https://rapidapi.com/judge0-official/api/judge0-ce

## Quick Start (No Setup Required!)

The system works immediately with Piston API - no configuration needed!

```bash
# Just run your app
npm run dev
```

That's it! Code execution will work automatically.

## Optional: Add Judge0 for Fallback

If you want additional reliability, add Judge0 as a fallback:

### Step 1: Get RapidAPI Key

1. Go to https://rapidapi.com/
2. Sign up for free account
3. Subscribe to Judge0 CE (free tier)
4. Copy your API key

### Step 2: Add to Environment

```bash
# .env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

### Step 3: Restart App

```bash
npm run dev
```

Now the system will use Piston first, and fall back to Judge0 if needed.

## How It Works

### Execution Flow

1. **User clicks "Run"**
2. **Validation**: Code syntax is checked
3. **Piston API**: Code is sent to Piston for execution
4. **Results**: Real output, runtime, and errors are returned
5. **Display**: Results shown in console

### Test Case Execution

```javascript
// Example: Two Sum problem
const code = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test
console.log(JSON.stringify(twoSum([2,7,11,15], 9)));
`;

// Input: [2,7,11,15], 9
// Expected Output: [0,1]
// Actual Execution: Runs on Piston servers
// Result: [0,1] ✓ Test passed
```

## Supported Languages

### Currently Supported

- ✅ JavaScript (Node.js)
- ✅ Python 3
- ✅ Java
- ✅ C++
- ✅ C
- ✅ C#
- ✅ Go
- ✅ Rust
- ✅ TypeScript
- ✅ Kotlin
- ✅ Swift
- ✅ Ruby
- ✅ PHP

### Adding More Languages

Edit `src/services/codeExecutionService.js`:

```javascript
const PISTON_LANGUAGES = {
  // Add new language
  scala: 'scala',
  haskell: 'haskell',
  // etc.
};
```

## Features

### ✅ Real Code Execution
- Actual code runs on remote servers
- Real output and errors
- Accurate runtime measurements

### ✅ Multiple Test Cases
- Run multiple test cases at once
- Individual pass/fail for each
- Detailed error messages

### ✅ Syntax Validation
- Pre-execution syntax check
- Catches errors before sending to API
- Faster feedback

### ✅ Error Handling
- Compilation errors
- Runtime errors
- Timeout errors
- Memory errors

### ✅ Performance Metrics
- Execution time (ms)
- Memory usage (MB)
- Exit codes

## API Limits & Best Practices

### Piston API

- **Rate Limit**: ~100 requests/minute
- **Timeout**: 3 seconds per execution
- **Memory**: Reasonable limits per language
- **Best Practice**: Cache results for identical code

### Judge0 CE (Free Tier)

- **Rate Limit**: 50 requests/day
- **Timeout**: 2 seconds CPU time
- **Memory**: 128 MB limit
- **Best Practice**: Use as fallback only

## Troubleshooting

### Code Not Running

**Check 1: Network Connection**
```bash
# Test Piston API
curl https://emkc.org/api/v2/piston/runtimes
```

**Check 2: Code Syntax**
- Ensure code is valid for the language
- Check for missing semicolons, brackets, etc.

**Check 3: Console Errors**
- Open browser DevTools (F12)
- Check Console tab for errors

### Slow Execution

**Cause**: API response time
**Solution**: 
- Piston API is usually fast (<2 seconds)
- Check your internet connection
- Consider caching results

### Rate Limit Errors

**Cause**: Too many requests
**Solution**:
- Wait a few minutes
- Add Judge0 as fallback
- Implement request caching

## Advanced Configuration

### Custom Timeout

```javascript
// src/services/codeExecutionService.js
const response = await fetch(`${PISTON_API}/execute`, {
  method: 'POST',
  body: JSON.stringify({
    // ...
    run_timeout: 5000, // 5 seconds (default: 3000)
  }),
});
```

### Custom Memory Limit

```javascript
body: JSON.stringify({
  // ...
  run_memory_limit: 256000, // 256 MB (default: unlimited)
}),
```

### Add Request Caching

```javascript
// Simple cache implementation
const codeCache = new Map();

export const executeCodeCached = async (code, language, input) => {
  const cacheKey = `${code}_${language}_${input}`;
  
  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey);
  }
  
  const result = await executeCode(code, language, input);
  codeCache.set(cacheKey, result);
  
  return result;
};
```

## Security Considerations

### ✅ Safe Execution
- Code runs in isolated containers
- No access to your system
- Automatic timeout protection

### ✅ Input Sanitization
- User input is sanitized
- No code injection possible
- Safe for production use

### ⚠️ API Key Security
- Never commit API keys to git
- Use environment variables
- Rotate keys regularly

## Production Deployment

### Vercel/Netlify

```bash
# Add environment variable in dashboard
VITE_RAPIDAPI_KEY=your_key_here
```

### Docker

```dockerfile
# Dockerfile
ENV VITE_RAPIDAPI_KEY=your_key_here
```

### Environment Variables

```bash
# .env.production
VITE_RAPIDAPI_KEY=production_key_here
```

## Cost Estimation

### Free Tier (Piston Only)
- **Cost**: $0/month
- **Requests**: ~100/minute
- **Perfect for**: Personal projects, learning, small apps

### With Judge0 Fallback (Free)
- **Cost**: $0/month
- **Requests**: Piston unlimited + Judge0 50/day
- **Perfect for**: Medium traffic apps

### Judge0 Paid (Optional)
- **Basic**: $10/month (10,000 requests)
- **Pro**: $50/month (100,000 requests)
- **Perfect for**: Production apps with high traffic

## Comparison with Backend

### Piston/Judge0 API ✅
- ✅ No server maintenance
- ✅ No hosting costs
- ✅ Instant setup
- ✅ Auto-scaling
- ✅ Multiple languages
- ❌ API rate limits
- ❌ Depends on external service

### Custom Backend ⚠️
- ✅ Full control
- ✅ No rate limits
- ✅ Custom features
- ❌ Server costs ($5-50/month)
- ❌ Maintenance required
- ❌ Security concerns
- ❌ Scaling complexity

## FAQ

**Q: Is this production-ready?**
A: Yes! Piston API is used by many production apps.

**Q: What if Piston goes down?**
A: Add Judge0 as fallback, or implement your own backend.

**Q: Can I run malicious code?**
A: No, code runs in isolated containers with strict limits.

**Q: How fast is execution?**
A: Usually 1-3 seconds including network time.

**Q: Can I use this commercially?**
A: Yes, Piston is free for commercial use.

**Q: Do I need a backend?**
A: No! This works entirely from the frontend.

## Support

- **Piston Docs**: https://github.com/engineer-man/piston
- **Judge0 Docs**: https://ce.judge0.com/
- **Issues**: Check browser console for errors

## Next Steps

1. ✅ Code execution is working!
2. Test with different languages
3. Try complex problems
4. Add more test cases
5. Customize error messages
6. Implement result caching
7. Add Judge0 fallback (optional)

Your LeetCode clone now has real code execution! 🎉

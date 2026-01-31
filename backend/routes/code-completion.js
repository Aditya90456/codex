const express = require('express');
const https = require('https');
const router = express.Router();

// Simple fetch replacement for Node.js
function simpleFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const response = {
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        };
        resolve(response);
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

const fetch = globalThis.fetch || simpleFetch;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent';

// AI Code Completion endpoint
router.post('/complete', async (req, res) => {
  try {
    const { 
      code, 
      cursorPosition, 
      language = 'javascript',
      context = '',
      maxSuggestions = 3 
    } = req.body;

    if (!code && !context) {
      return res.status(400).json({ 
        success: false,
        error: 'Code or context is required' 
      });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not configured, using fallback completions');
      const fallbackSuggestions = generateFallbackCompletions(code, language, cursorPosition);
      return res.json({
        success: true,
        suggestions: fallbackSuggestions,
        source: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`🤖 Generating code completions for ${language}...`);
    const suggestions = await generateCompletionsWithGemini(code, cursorPosition, language, context, maxSuggestions);

    res.json({
      success: true,
      suggestions,
      source: 'gemini-ai',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Code Completion Error:', error.message);
    
    // Fallback to simple completions
    try {
      const fallbackSuggestions = generateFallbackCompletions(req.body.code, req.body.language, req.body.cursorPosition);
      return res.json({
        success: true,
        suggestions: fallbackSuggestions,
        source: 'fallback',
        warning: 'AI completion temporarily unavailable',
        timestamp: new Date().toISOString()
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate completions',
        message: error.message 
      });
    }
  }
});

// Generate completions using Gemini AI
async function generateCompletionsWithGemini(code, cursorPosition, language, context, maxSuggestions) {
  const beforeCursor = code.substring(0, cursorPosition);
  const afterCursor = code.substring(cursorPosition);
  
  const lines = beforeCursor.split('\n');
  const currentLine = lines[lines.length - 1];
  const previousLines = lines.slice(Math.max(0, lines.length - 5), lines.length - 1).join('\n');

  const prompt = `You are an expert ${language} code completion AI. Provide intelligent, context-aware code suggestions.

Language: ${language}
Context: ${context || 'General coding'}

Previous code:
\`\`\`${language}
${previousLines}
\`\`\`

Current line (cursor at end): ${currentLine}

Next code:
\`\`\`${language}
${afterCursor.split('\n').slice(0, 3).join('\n')}
\`\`\`

Provide ${maxSuggestions} intelligent code completion suggestions for what should come next. Consider:
- Syntax correctness
- Common patterns in ${language}
- Variable/function naming conventions
- Code context and logic flow
- Best practices

Return ONLY a JSON array of suggestions in this exact format:
[
  {
    "text": "completion text here",
    "description": "brief description",
    "type": "keyword|function|variable|snippet"
  }
]

Return ONLY the JSON array, no markdown, no explanations.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || '[]';
    
    let cleanedText = generatedText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const suggestions = JSON.parse(cleanedText);
    
    return suggestions.slice(0, maxSuggestions).map(s => ({
      text: s.text || '',
      description: s.description || 'Code suggestion',
      type: s.type || 'snippet',
      confidence: 0.9
    }));

  } catch (error) {
    console.error('Gemini completion error:', error);
    throw error;
  }
}

// Fallback completions (simple pattern-based)
function generateFallbackCompletions(code, language, cursorPosition) {
  const beforeCursor = code.substring(0, cursorPosition);
  const currentLine = beforeCursor.split('\n').pop();
  
  const suggestions = [];

  // JavaScript/TypeScript completions
  if (language === 'javascript' || language === 'typescript') {
    if (currentLine.includes('const ') || currentLine.includes('let ') || currentLine.includes('var ')) {
      suggestions.push(
        { text: ' = ', description: 'Assignment', type: 'keyword', confidence: 0.8 },
        { text: ' = []', description: 'Array initialization', type: 'snippet', confidence: 0.7 },
        { text: ' = {}', description: 'Object initialization', type: 'snippet', confidence: 0.7 }
      );
    }
    
    if (currentLine.includes('function ')) {
      suggestions.push(
        { text: '() {\n  \n}', description: 'Function body', type: 'snippet', confidence: 0.9 },
        { text: '(params) {\n  return \n}', description: 'Function with return', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.trim().endsWith('.')) {
      suggestions.push(
        { text: 'map()', description: 'Array map method', type: 'function', confidence: 0.7 },
        { text: 'filter()', description: 'Array filter method', type: 'function', confidence: 0.7 },
        { text: 'forEach()', description: 'Array forEach method', type: 'function', confidence: 0.7 }
      );
    }
  }

  // Python completions
  if (language === 'python') {
    if (currentLine.includes('def ')) {
      suggestions.push(
        { text: '():\n    pass', description: 'Function definition', type: 'snippet', confidence: 0.9 },
        { text: '(self):\n    pass', description: 'Method definition', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('class ')) {
      suggestions.push(
        { text: ':\n    def __init__(self):\n        pass', description: 'Class with constructor', type: 'snippet', confidence: 0.9 }
      );
    }
  }

  // HTML completions
  if (language === 'html') {
    if (currentLine.includes('<')) {
      suggestions.push(
        { text: 'div></div>', description: 'Div element', type: 'snippet', confidence: 0.8 },
        { text: 'span></span>', description: 'Span element', type: 'snippet', confidence: 0.7 },
        { text: 'button></button>', description: 'Button element', type: 'snippet', confidence: 0.7 }
      );
    }
  }

  // Generic completions
  if (suggestions.length === 0) {
    suggestions.push(
      { text: '\n', description: 'New line', type: 'keyword', confidence: 0.5 },
      { text: ' ', description: 'Space', type: 'keyword', confidence: 0.4 }
    );
  }

  return suggestions.slice(0, 3);
}

// Inline completion endpoint (for as-you-type suggestions)
router.post('/inline', async (req, res) => {
  try {
    const { code, cursorPosition, language = 'javascript' } = req.body;

    if (!GEMINI_API_KEY) {
      return res.json({
        success: true,
        completion: '',
        source: 'fallback'
      });
    }

    const beforeCursor = code.substring(0, cursorPosition);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    // Only suggest if line has some content
    if (currentLine.trim().length < 2) {
      return res.json({
        success: true,
        completion: '',
        source: 'none'
      });
    }

    const prompt = `Complete this ${language} code line. Return ONLY the completion text, no explanations:
${currentLine}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 100,
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const completion = data.candidates[0]?.content?.parts[0]?.text?.trim() || '';
      
      res.json({
        success: true,
        completion: completion.replace(currentLine, '').trim(),
        source: 'gemini-ai'
      });
    } else {
      res.json({ success: true, completion: '', source: 'error' });
    }

  } catch (error) {
    console.error('Inline completion error:', error);
    res.json({ success: true, completion: '', source: 'error' });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Code Completion API',
    geminiConfigured: !!GEMINI_API_KEY,
    model: 'gemini-2.0-flash-exp',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

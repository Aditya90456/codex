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

// Use native fetch if available (Node 18+), otherwise use our simple implementation
const fetch = globalThis.fetch || simpleFetch;

// Gemini AI Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Speed-optimized API configuration with working model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// Speed-optimized generation config
const SPEED_OPTIMIZED_CONFIG = {
  temperature: 0.4,        // Lower for faster, more focused responses
  topK: 15,               // Reduced for faster token selection
  topP: 0.75,             // Reduced for faster generation
  maxOutputTokens: 12288, // Reduced for faster generation
  candidateCount: 1       // Single candidate for maximum speed
};

// Speed-optimized chat config
const CHAT_SPEED_CONFIG = {
  temperature: 0.5,       // Balanced for chat responses
  topK: 15,              // Reduced for speed
  topP: 0.75,            // Reduced for speed
  maxOutputTokens: 800,  // Shorter responses for speed
  candidateCount: 1      // Single candidate
};

// Minimal safety settings for speed
const SPEED_SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_ONLY_HIGH"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH", 
    threshold: "BLOCK_ONLY_HIGH"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH"
  }
];

// AI Code Generation endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt, outputType = 'web' } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Prompt is required' 
      });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not configured, using fallback generation');
      const generatedContent = await generateContentFallback(prompt, outputType);
      return res.json({
        success: true,
        prompt,
        outputType,
        content: generatedContent,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }

    // Generate content using Gemini AI with speed optimization
    console.log(`🚀 Fast generating ${outputType} content with Gemini AI (gemini-2.5-flash)...`);
    const generatedContent = await generateContentWithGemini(prompt, outputType);

    res.json({
      success: true,
      prompt,
      outputType,
      content: generatedContent,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ AI Generation Error:', error.message);
    
    // Check if it's a rate limit error
    const isRateLimitError = error.message.includes('429') || error.message.includes('RATE_LIMIT');
    const isQuotaError = error.message.includes('Quota exceeded');
    
    // Fallback to template generation if AI fails
    try {
      const fallbackContent = await generateContentFallback(req.body.prompt, req.body.outputType);
      return res.json({
        success: true,
        prompt: req.body.prompt,
        outputType: req.body.outputType,
        content: fallbackContent,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        warning: isRateLimitError || isQuotaError
          ? '⚠️ Gemini API quota exceeded. Using template generation. Please check your API key quota at https://makersuite.google.com/app/apikey'
          : 'AI generation temporarily unavailable, using template'
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate content',
        message: error.message 
      });
    }
  }
});

// General AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], user = null } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not configured, using fallback chat');
      const response = await generateChatResponseFallback(message, user);
      return res.json({
        success: true,
        message,
        response,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }

    // Generate response using Gemini AI with speed optimization
    console.log(`🚀 Fast generating chat response with Gemini AI (gemini-2.5-flash) for ${user?.name || 'user'}...`);
    const response = await generateChatResponseWithGemini(message, conversationHistory, user);

    res.json({
      success: true,
      message,
      response,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    
    // Check if it's a rate limit error
    const isRateLimitError = error.message.includes('429') || error.message.includes('RATE_LIMIT');
    const isQuotaError = error.message.includes('Quota exceeded');
    
    // Fallback to simple response if AI fails
    try {
      const fallbackResponse = await generateChatResponseFallback(req.body.message, req.body.user);
      return res.json({
        success: true,
        message: req.body.message,
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        warning: isRateLimitError || isQuotaError 
          ? '⚠️ Gemini API quota exceeded. Using fallback responses. Please check your API key quota at https://makersuite.google.com/app/apikey'
          : 'AI chat temporarily unavailable, using fallback'
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate chat response',
        message: error.message 
      });
    }
  }
});

// Speed-optimized content generation using Gemini AI
async function generateContentWithGemini(prompt, outputType) {
  // Shorter, more focused system prompts for speed
  const systemPrompts = {
    web: `Create a complete HTML app for: "${prompt}". Include CSS and JavaScript. Make it responsive and interactive. Return only HTML code.`,

    react: `Create a React component for: "${prompt}". Use modern hooks, inline styles, and make it interactive. Include all imports. Return only JSX code.`,
    
    mobile: `Create a React Native component for: "${prompt}". Use StyleSheet and TouchableOpacity. Return only JavaScript code.`,
    
    document: `Create markdown documentation for: "${prompt}". Include overview, installation, usage, and examples.`,
    
    api: `Create an Express.js API for: "${prompt}". Include CRUD operations and error handling. Return only JavaScript code.`,
    
    data: `Create a Python data analysis script for: "${prompt}". Include pandas, numpy, and matplotlib. Return only Python code.`
  };

  try {
    console.log(`🚀 Speed-optimized ${outputType} generation...`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompts[outputType] || systemPrompts.web
          }]
        }],
        generationConfig: SPEED_OPTIMIZED_CONFIG,
        safetySettings: SPEED_SAFETY_SETTINGS
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini AI');
    }

    const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';

    if (!generatedText) {
      throw new Error('Empty response from Gemini AI');
    }

    // Quick cleanup for speed
    let cleanedCode = generatedText
      .replace(/```[a-z]*\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    // Determine the type and language
    const typeMap = {
      web: { type: 'html', language: 'html' },
      react: { type: 'javascript', language: 'javascript' },
      mobile: { type: 'javascript', language: 'javascript' },
      document: { type: 'markdown', language: 'markdown' },
      api: { type: 'javascript', language: 'javascript' },
      data: { type: 'python', language: 'python' }
    };

    const result = typeMap[outputType] || typeMap.web;

    console.log(`⚡ Fast generated ${cleanedCode.length} characters of ${outputType} content`);

    if (outputType === 'web') {
      return { html: cleanedCode, ...result };
    } else if (outputType === 'document') {
      return { content: cleanedCode, ...result };
    } else if (outputType === 'react') {
      return { code: cleanedCode, ...result };
    } else {
      return { code: cleanedCode, ...result };
    }

  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);
    throw error;
  }
}

// Speed-optimized chat response using Gemini AI
async function generateChatResponseWithGemini(message, conversationHistory = [], user = null) {
  try {
    // Shorter context for faster processing
    const userContext = user ? `User: ${user.name || 'User'} (${user.experienceLevel || 'Beginner'})` : '';

    // Simplified prompt for speed
    let contextPrompt = `You are a helpful AI coding assistant. Be concise and practical.${userContext ? '\n' + userContext : ''}

User: ${message}
Assistant:`;

    // Add only recent history for speed
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-2); // Only last 2 messages for speed
      const historyText = recentHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      contextPrompt = `Recent chat:\n${historyText}\n\n${userContext}\n\nUser: ${message}\nAssistant:`;
    }

    console.log(`🚀 Speed-optimized chat generation...`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }],
        generationConfig: CHAT_SPEED_CONFIG,
        safetySettings: SPEED_SAFETY_SETTINGS
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini AI');
    }

    const generatedText = data.candidates[0]?.content?.parts[0]?.text || 
      'I apologize, but I couldn\'t generate a response. Please try again.';

    console.log(`⚡ Fast generated chat response: ${generatedText.length} characters`);

    return generatedText.trim();

  } catch (error) {
    console.error('❌ Gemini Chat Error:', error.message);
    throw error;
  }
}

// Fallback content generation (templates) - same as before but faster
async function generateContentFallback(prompt, outputType) {
  const generators = {
    web: generateWebAppTemplate,
    react: generateReactAppTemplate,
    mobile: generateMobileAppTemplate,
    document: generateDocumentTemplate,
    api: generateAPITemplate,
    data: generateDataAnalysisTemplate
  };

  const generator = generators[outputType] || generators.web;
  return await generator(prompt);
}

// Fallback chat response - same as before
async function generateChatResponseFallback(message, user = null) {
  const lowerMessage = message.toLowerCase();
  const userName = user?.name ? `, ${user.name}` : '';
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello${userName}! 👋 I'm your AI coding assistant. What can I help you with?`;
  }
  
  if (lowerMessage.includes('thank')) {
    return `You're welcome${userName}! 😊 Happy to help with coding!`;
  }
  
  if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
    return `I'd be happy to help debug${userName}! 🔍 Please share your error message and code.`;
  }
  
  return `Hey! I'm here to help with coding questions, debugging, and best practices. What would you like to work on?`;
}

// Fast template generators (simplified versions)
async function generateWebAppTemplate(prompt) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(prompt)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    h1 { color: #667eea; margin-bottom: 20px; }
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ ${escapeHtml(prompt)}</h1>
    <p>Your fast-generated web application!</p>
    <button onclick="alert('Hello from your app!')">Click Me</button>
  </div>
</body>
</html>`;

  return { html, type: 'html', language: 'html' };
}

async function generateReactAppTemplate(prompt) {
  const code = `import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      textAlign: 'center',
      maxWidth: '400px'
    },
    title: {
      color: '#667eea',
      marginBottom: '20px',
      fontSize: '2em'
    },
    count: {
      fontSize: '3em',
      fontWeight: 'bold',
      color: '#764ba2',
      margin: '20px 0'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ ${escapeHtml(prompt)}</h1>
        <div style={styles.count}>{count}</div>
        <button 
          style={styles.button}
          onClick={() => setCount(count + 1)}
        >
          Click Me!
        </button>
      </div>
    </div>
  );
};

export default App;`;

  return { code, type: 'javascript', language: 'javascript' };
}

async function generateMobileAppTemplate(prompt) {
  const code = `import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>✨ ${escapeHtml(prompt)}</Text>
        <Text style={styles.count}>{count}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
          <Text style={styles.buttonText}>Tap Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#667eea' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  count: { fontSize: 48, fontWeight: 'bold', color: 'white', marginBottom: 30 },
  button: { backgroundColor: '#764ba2', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default App;`;

  return { code, type: 'javascript', language: 'javascript' };
}

async function generateDocumentTemplate(prompt) {
  const content = `# ${prompt}

## Overview
Documentation for ${prompt}

## Installation
\`\`\`bash
npm install ${prompt.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

## Usage
\`\`\`javascript
const app = require('${prompt.toLowerCase().replace(/\s+/g, '-')}');
app.start();
\`\`\`

## Features
- Fast and efficient
- Easy to use
- Well documented

## License
MIT`;

  return { content, type: 'markdown', language: 'markdown' };
}

async function generateAPITemplate(prompt) {
  const code = `const express = require('express');
const router = express.Router();

// GET all items
router.get('/api/items', async (req, res) => {
  try {
    const items = [{ id: 1, name: 'Sample Item' }];
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new item
router.post('/api/items', async (req, res) => {
  try {
    const newItem = { id: Date.now(), ...req.body };
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;`;

  return { code, type: 'javascript', language: 'javascript' };
}

async function generateDataAnalysisTemplate(prompt) {
  const code = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ${prompt} - Data Analysis

def load_data(file_path):
    return pd.read_csv(file_path)

def analyze_data(df):
    print("Shape:", df.shape)
    print("\\nSummary:")
    print(df.describe())
    return df

def visualize_data(df):
    df.hist(figsize=(10, 6))
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    print("Data analysis script ready!")`;

  return { code, type: 'python', language: 'python' };
}

// Helper function
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'AI Generator API (Speed Optimized)',
    geminiConfigured: !!GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    optimizations: 'Speed optimized for faster responses',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
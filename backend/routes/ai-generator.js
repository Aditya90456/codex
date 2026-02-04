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
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

// AI Peer Chat endpoint - Casual coding buddy conversations
router.post('/peer-chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not configured, using fallback peer chat');
      const response = await generatePeerChatFallback(message, context);
      return res.json({
        success: true,
        message,
        response,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }

    // Generate peer chat response using Gemini AI
    console.log(`🚀 Generating peer chat response with Gemini AI...`);
    const response = await generatePeerChatWithGemini(message, context);

    res.json({
      success: true,
      message,
      response,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ AI Peer Chat Error:', error.message);
    
    // Fallback to simple response if AI fails
    try {
      const fallbackResponse = await generatePeerChatFallback(req.body.message, req.body.context);
      return res.json({
        success: true,
        message: req.body.message,
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        warning: 'AI chat temporarily unavailable, using fallback'
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate peer chat response',
        message: error.message 
      });
    }
  }
});

// Peer chat response using Gemini AI - Casual coding buddy style
async function generatePeerChatWithGemini(message, context = {}) {
  try {
    const { currentCode, currentProblem, language, chatMode, conversationHistory } = context;

    // Create a casual, peer-like system prompt
    let systemPrompt = `You are a friendly coding buddy having a casual conversation. You're knowledgeable but approachable, like a peer programmer who's always willing to help.

Personality:
- Talk like a real person, not a formal assistant
- Use casual language and programming slang when appropriate
- Be encouraging and supportive
- Share insights like you're pair programming
- Use emojis occasionally but don't overdo it
- Keep responses conversational and not too long

Current context:
- Language: ${language || 'JavaScript'}
- Chat mode: ${chatMode || 'casual'}`;

    if (currentProblem) {
      systemPrompt += `
- Working on: ${currentProblem.title} (${currentProblem.difficulty})
- Category: ${currentProblem.category}`;
    }

    if (currentCode && currentCode.trim()) {
      systemPrompt += `
- Current code: ${currentCode.substring(0, 500)}${currentCode.length > 500 ? '...' : ''}`;
    }

    // Add conversation history for context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-3); // Last 3 messages
      conversationContext = recentHistory.map(msg => 
        `${msg.type === 'user' ? 'You' : 'Me'}: ${msg.content}`
      ).join('\n');
    }

    const fullPrompt = `${systemPrompt}

${conversationContext ? `Recent conversation:\n${conversationContext}\n` : ''}
You: ${message}
Me:`;

    console.log(`🚀 Peer chat generation with context...`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          ...CHAT_SPEED_CONFIG,
          maxOutputTokens: 600, // Slightly longer for peer chat
          temperature: 0.7 // More creative for casual conversation
        },
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
      'Hey! I\'m having trouble thinking right now. Can you try asking again? 🤔';

    console.log(`⚡ Generated peer chat response: ${generatedText.length} characters`);

    return generatedText.trim();

  } catch (error) {
    console.error('❌ Gemini Peer Chat Error:', error.message);
    throw error;
  }
}

// Fallback peer chat responses - casual and friendly
async function generatePeerChatFallback(message, context = {}) {
  const lowerMessage = message.toLowerCase();
  const { currentProblem, language, chatMode } = context;
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const greetings = [
      "Hey there! 👋 What are we coding today?",
      "Hi! Ready to tackle some algorithms? 🚀",
      "Hello! I'm here to help with whatever you're working on 😊",
      "Hey! What's the coding challenge today?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Thank you responses
  if (lowerMessage.includes('thank')) {
    const thanks = [
      "No problem! Happy to help 😊",
      "You got it! That's what coding buddies are for 🤝",
      "Anytime! Keep crushing those problems 💪",
      "Glad I could help! You're doing great 🌟"
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }
  
  // Debug/error help
  if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('debug')) {
    const debugHelp = [
      "Ah, the classic debugging session! 🐛 What's the error message saying?",
      "Let's squash this bug together! Can you share the error details?",
      "Debugging time! 🔍 What's not working as expected?",
      "Errors are just learning opportunities in disguise! What's going wrong?"
    ];
    return debugHelp[Math.floor(Math.random() * debugHelp.length)];
  }
  
  // Code explanation requests
  if (lowerMessage.includes('explain') || lowerMessage.includes('how does') || lowerMessage.includes('understand')) {
    const explanations = [
      "Sure thing! I love breaking down code concepts 💡 What part needs explaining?",
      "Absolutely! Let's walk through it step by step 🚶‍♂️",
      "Of course! Understanding the 'why' is just as important as the 'how' 🤓",
      "Happy to explain! What specific part is confusing you?"
    ];
    return explanations[Math.floor(Math.random() * explanations.length)];
  }
  
  // Optimization requests
  if (lowerMessage.includes('optimize') || lowerMessage.includes('faster') || lowerMessage.includes('efficient')) {
    const optimizations = [
      "Time to make it faster! ⚡ Let's look at the time complexity first",
      "Optimization mode activated! 🚀 What's the current approach?",
      "Love a good optimization challenge! Let's see what we can improve",
      "Speed it up! 💨 Are we talking time or space complexity here?"
    ];
    return optimizations[Math.floor(Math.random() * optimizations.length)];
  }
  
  // Problem-specific responses
  if (currentProblem) {
    const problemResponses = [
      `Working on "${currentProblem.title}"? That's a solid ${currentProblem.difficulty} problem! What's your approach so far?`,
      `Nice choice with "${currentProblem.title}"! ${currentProblem.category} problems are always fun to solve 🧩`,
      `"${currentProblem.title}" - I remember this one! What part are you stuck on?`,
      `${currentProblem.difficulty} problems like "${currentProblem.title}" are great practice! How's it going?`
    ];
    return problemResponses[Math.floor(Math.random() * problemResponses.length)];
  }
  
  // Language-specific responses
  if (language && (lowerMessage.includes(language) || lowerMessage.includes('language'))) {
    const langResponses = {
      javascript: "JavaScript is awesome! 🟨 Love the flexibility it gives us",
      python: "Python is so clean and readable! 🐍 Great choice for algorithms",
      java: "Java - solid and reliable! ☕ The verbosity pays off in larger projects",
      cpp: "C++ - when you need that extra performance! ⚡ Classic choice for competitive programming",
      typescript: "TypeScript! 💙 All the JavaScript goodness with type safety"
    };
    return langResponses[language] || `${language} is a great language to work with! 👍`;
  }
  
  // General coding conversation
  const generalResponses = [
    "I'm here to help with whatever you're working on! What's on your mind? 🤔",
    "Coding questions, algorithm help, or just want to chat about programming? I'm all ears! 👂",
    "What are we building today? Always excited to help with coding challenges! 🚀",
    "Hit me with your coding questions! Whether it's debugging, algorithms, or just brainstorming 💭",
    "Ready to dive into some code! What can I help you figure out? 🔍"
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// AI LeetCode Assistant endpoint - Intelligent problem-solving assistance
router.post('/leetcode-assistant', async (req, res) => {
  try {
    const { message, problem, code, language, testResults, assistanceMode, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not configured, using fallback assistant');
      const response = await generateLeetCodeAssistanceFallback(message, problem, assistanceMode);
      return res.json({
        success: true,
        message,
        response,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }

    // Generate LeetCode assistance using Gemini AI
    console.log(`🧠 Generating LeetCode assistance (${assistanceMode}) with Gemini AI...`);
    const response = await generateLeetCodeAssistanceWithGemini(message, problem, code, language, testResults, assistanceMode, conversationHistory);

    res.json({
      success: true,
      message,
      response,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ AI LeetCode Assistant Error:', error.message);
    
    // Fallback to simple response if AI fails
    try {
      const fallbackResponse = await generateLeetCodeAssistanceFallback(req.body.message, req.body.problem, req.body.assistanceMode);
      return res.json({
        success: true,
        message: req.body.message,
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        warning: 'AI assistant temporarily unavailable, using fallback'
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate LeetCode assistance',
        message: error.message 
      });
    }
  }
});

// LeetCode assistance using Gemini AI - Intelligent problem-solving help
async function generateLeetCodeAssistanceWithGemini(message, problem, code, language, testResults, assistanceMode, conversationHistory) {
  try {
    // Create specialized system prompt based on assistance mode
    let systemPrompt = `You are an expert LeetCode AI assistant, similar to Kiro. You help programmers solve coding problems with intelligent guidance.

Your personality:
- Expert but approachable, like a senior developer mentor
- Give hints and guidance rather than complete solutions (unless specifically asked)
- Explain concepts clearly with examples
- Encourage learning and understanding
- Use emojis appropriately but not excessively

Current context:
- Problem: ${problem?.title || 'Unknown'} (${problem?.difficulty || 'Unknown'} difficulty)
- Category: ${problem?.category || 'Unknown'}
- Language: ${language || 'JavaScript'}
- Assistance Mode: ${assistanceMode}`;

    // Add problem description if available
    if (problem?.description) {
      systemPrompt += `\n- Problem Description: ${problem.description.substring(0, 500)}...`;
    }

    // Add current code context if available
    if (code && code.trim()) {
      systemPrompt += `\n- Current Code:\n\`\`\`${language}\n${code.substring(0, 1000)}${code.length > 1000 ? '...' : ''}\n\`\`\``;
    }

    // Add test results context if available
    if (testResults) {
      systemPrompt += `\n- Test Results: ${testResults.accepted ? 'All tests passed ✅' : 'Some tests failed ❌'}`;
    }

    // Mode-specific instructions
    const modeInstructions = {
      hint: `
Mode: HINT GIVING
- Give subtle hints that guide toward the solution without giving it away
- Ask leading questions to help them think through the problem
- Suggest which data structures or algorithms might be useful
- Point out key insights about the problem without solving it`,

      solution: `
Mode: APPROACH EXPLANATION  
- Explain different approaches to solve the problem
- Discuss time and space complexity trade-offs
- Provide step-by-step algorithmic thinking
- Give pseudocode or high-level strategy, not complete implementation`,

      debug: `
Mode: CODE DEBUGGING
- Analyze the provided code for logical errors
- Identify potential edge cases that might be failing
- Suggest specific fixes for bugs
- Explain why certain approaches might not work`,

      optimize: `
Mode: OPTIMIZATION GUIDANCE
- Analyze current solution's time and space complexity
- Suggest more efficient approaches
- Explain optimization techniques
- Discuss trade-offs between different optimizations`
    };

    systemPrompt += modeInstructions[assistanceMode] || modeInstructions.hint;

    // Add conversation history for context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-3);
      conversationContext = recentHistory.map(msg => 
        `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
    }

    const fullPrompt = `${systemPrompt}

${conversationContext ? `Recent conversation:\n${conversationContext}\n` : ''}
User: ${message}
Assistant:`;

    console.log(`🧠 LeetCode assistance generation (${assistanceMode})...`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          ...CHAT_SPEED_CONFIG,
          maxOutputTokens: 800,
          temperature: 0.6 // Slightly more creative for teaching
        },
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
      'I\'m having trouble generating a response right now. Can you try asking again?';

    console.log(`⚡ Generated LeetCode assistance: ${generatedText.length} characters`);

    return generatedText.trim();

  } catch (error) {
    console.error('❌ Gemini LeetCode Assistant Error:', error.message);
    throw error;
  }
}

// Fallback LeetCode assistance responses
async function generateLeetCodeAssistanceFallback(message, problem, assistanceMode) {
  const lowerMessage = message.toLowerCase();
  const problemTitle = problem?.title || 'this problem';
  const difficulty = problem?.difficulty || 'Unknown';
  
  // Mode-specific fallback responses
  if (assistanceMode === 'hint') {
    const hints = [
      `🔍 For ${problemTitle}, think about what data structure would help you track information efficiently.`,
      `💡 Consider the time complexity - can you solve this in O(n) time?`,
      `🎯 Look for patterns in the problem. What's the key insight that makes this solvable?`,
      `🤔 Try working through a small example by hand. What steps do you naturally take?`,
      `📊 Think about whether you need to store previous results or if you can solve it in one pass.`
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  }
  
  if (assistanceMode === 'solution') {
    const approaches = [
      `🎯 For ${problemTitle}, here are common approaches:\n\n1. **Brute Force**: Try all possibilities (O(n²) time)\n2. **Optimized**: Use a hash map or two pointers (O(n) time)\n3. **Advanced**: Consider if dynamic programming or greedy approach applies\n\nWhich approach interests you most?`,
      `📋 Let's break down ${problemTitle}:\n\n**Step 1**: Understand the input/output\n**Step 2**: Identify the core operation needed\n**Step 3**: Choose appropriate data structure\n**Step 4**: Implement with edge cases in mind\n\nWhat step would you like help with?`,
      `🧠 For ${difficulty} problems like this, consider:\n\n- What's the simplest solution that works?\n- Can you optimize it with better data structures?\n- Are there any mathematical properties to exploit?\n\nLet me know which direction you'd like to explore!`
    ];
    return approaches[Math.floor(Math.random() * approaches.length)];
  }
  
  if (assistanceMode === 'debug') {
    const debugHelp = [
      `🐛 Let's debug your solution! Common issues in ${difficulty} problems:\n\n- Off-by-one errors in loops\n- Not handling edge cases (empty input, single element)\n- Incorrect boundary conditions\n- Logic errors in conditionals\n\nCan you share what specific error you're seeing?`,
      `🔍 Debugging checklist for ${problemTitle}:\n\n✅ Are you handling all edge cases?\n✅ Is your loop logic correct?\n✅ Are you returning the right data type?\n✅ Did you test with the given examples?\n\nWhat part seems to be failing?`,
      `⚠️ For debugging, try:\n\n1. Add console.log statements to trace execution\n2. Test with simple inputs first\n3. Check if your algorithm matches the expected approach\n4. Verify edge cases\n\nWhat's the current behavior vs expected?`
    ];
    return debugHelp[Math.floor(Math.random() * debugHelp.length)];
  }
  
  if (assistanceMode === 'optimize') {
    const optimizations = [
      `⚡ Optimization strategies for ${problemTitle}:\n\n**Time Complexity**: Can you reduce nested loops?\n**Space Complexity**: Can you solve it in-place?\n**Data Structures**: Would a hash map, set, or heap help?\n**Algorithms**: Consider sorting, two pointers, or sliding window\n\nWhat's your current approach's complexity?`,
      `🚀 To optimize ${difficulty} problems:\n\n1. **Analyze current solution**: What's the bottleneck?\n2. **Consider trade-offs**: Time vs space complexity\n3. **Use efficient data structures**: Hash maps for O(1) lookup\n4. **Apply algorithms**: Binary search, dynamic programming\n\nWhich aspect would you like to improve?`,
      `📈 Optimization techniques:\n\n- **Memoization**: Store computed results\n- **Two Pointers**: Reduce O(n²) to O(n)\n- **Sorting**: Sometimes preprocessing helps\n- **Mathematical**: Look for patterns or formulas\n\nWhat's your current time/space complexity?`
    ];
    return optimizations[Math.floor(Math.random() * optimizations.length)];
  }
  
  // General fallback responses
  const generalResponses = [
    `I'm here to help with ${problemTitle}! What specific aspect would you like assistance with?`,
    `Great question about ${problemTitle}! Can you tell me more about what you're struggling with?`,
    `Let's work through ${problemTitle} together. What approach have you tried so far?`,
    `I'd love to help you solve this ${difficulty} problem! What's your current thinking?`
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'AI Generator API (Speed Optimized)',
    geminiConfigured: !!GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    optimizations: 'Speed optimized for faster responses',
    endpoints: ['generate', 'chat', 'peer-chat', 'leetcode-assistant'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
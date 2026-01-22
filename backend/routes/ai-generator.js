const express = require('express');
const router = express.Router();

// Gemini AI Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// Using gemini-1.5-flash for higher free tier quota (1500 requests/day vs 20)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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

    // Generate content using Gemini AI
    console.log(`🤖 Generating ${outputType} content with Gemini AI...`);
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

    // Generate response using Gemini AI
    console.log(`🤖 Generating chat response with Gemini AI for ${user?.name || 'user'}...`);
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

// Generate content using Gemini AI
async function generateContentWithGemini(prompt, outputType) {
  const systemPrompts = {
    web: `You are an expert web developer. Generate a complete, production-ready HTML file with embedded CSS and JavaScript for: "${prompt}". 

Requirements:
- Modern, responsive design with beautiful gradients and animations
- Clean, semantic HTML5
- Professional CSS with flexbox/grid
- Interactive JavaScript functionality
- Mobile-friendly
- Accessible (ARIA labels where needed)

Return ONLY the complete HTML code without any markdown formatting, explanations, or code blocks. Start directly with <!DOCTYPE html>.`,
    
    mobile: `You are an expert React Native developer. Generate a complete, production-ready React Native component for: "${prompt}".

Requirements:
- All necessary imports (React, React Native components)
- Functional component with hooks
- Complete StyleSheet with modern design
- Interactive functionality
- Proper state management
- Comments for complex logic

Return ONLY the complete JavaScript/React Native code without any markdown formatting or explanations.`,
    
    document: `You are a technical documentation expert. Generate comprehensive markdown documentation for: "${prompt}".

Requirements:
- Clear structure with proper headings
- Overview and introduction
- Installation/setup instructions
- Usage examples with code blocks
- API reference if applicable
- Best practices section
- Troubleshooting guide

Return ONLY the markdown content without any additional formatting or explanations.`,
    
    api: `You are an expert backend developer. Generate a complete Express.js REST API with full CRUD operations for: "${prompt}".

Requirements:
- All HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Proper error handling
- Input validation
- Pagination support
- Search functionality
- RESTful conventions
- Comprehensive comments

Return ONLY the complete JavaScript code without any markdown formatting or explanations.`,
    
    data: `You are a data science expert. Generate a complete Python data analysis script for: "${prompt}".

Requirements:
- Import necessary libraries (pandas, numpy, matplotlib, seaborn)
- Data loading functions
- Data cleaning and preprocessing
- Statistical analysis
- Visualization functions
- Comprehensive comments
- Example usage

Return ONLY the complete Python code without any markdown formatting or explanations.`
  };

  try {
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
        generationConfig: {
          temperature: 0.7, // Balanced for quality and speed
          topK: 40, // Increased for better completion
          topP: 0.95, // Increased for complete responses
          maxOutputTokens: 8192, // Full output for complete code
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
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

    // Clean up the generated code (remove markdown code blocks if present)
    let cleanedCode = generatedText
      .replace(/```html\n?/gi, '')
      .replace(/```javascript\n?/gi, '')
      .replace(/```jsx\n?/gi, '')
      .replace(/```python\n?/gi, '')
      .replace(/```markdown\n?/gi, '')
      .replace(/```js\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    // Determine the type and language
    const typeMap = {
      web: { type: 'html', language: 'html' },
      mobile: { type: 'javascript', language: 'javascript' },
      document: { type: 'markdown', language: 'markdown' },
      api: { type: 'javascript', language: 'javascript' },
      data: { type: 'python', language: 'python' }
    };

    const result = typeMap[outputType] || typeMap.web;

    console.log(`✅ Generated ${cleanedCode.length} characters of ${outputType} content`);

    if (outputType === 'web') {
      return { html: cleanedCode, ...result };
    } else if (outputType === 'document') {
      return { content: cleanedCode, ...result };
    } else {
      return { code: cleanedCode, ...result };
    }

  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);
    throw error;
  }
}

// Generate chat response using Gemini AI
async function generateChatResponseWithGemini(message, conversationHistory = [], user = null) {
  try {
    // Build user context
    const userContext = user ? `\n\nUser Information:
- Name: ${user.name || 'User'}
- Email: ${user.email || 'Not provided'}
- Experience Level: ${user.experienceLevel || 'Beginner'}
- Preferred Language: ${user.preferredLanguage || 'JavaScript'}
- Current Project: ${user.currentProject || 'General learning'}

Personalize your response based on the user's experience level and preferences. Address them by name when appropriate.` : '';

    // Build conversation context
    let contextPrompt = `You are a helpful, friendly AI assistant for Codex Playground, a coding platform. Your role is to:

- Answer programming questions clearly and concisely
- Help debug code and explain errors
- Provide coding best practices and recommendations
- Explain programming concepts in simple terms
- Suggest learning resources
- Be encouraging and supportive
- Personalize responses based on user's skill level and preferences${userContext}

Keep responses conversational, helpful, and under 300 words. Use emojis sparingly for friendliness.

User: ${message}
Assistant:`;

    // Add conversation history if available
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-4); // Last 4 messages for context
      const historyText = recentHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      contextPrompt = `Previous conversation:\n${historyText}\n\n${userContext}\n\nUser: ${message}\nAssistant:`;
    }

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
        generationConfig: {
          temperature: 0.9, // Higher for creative chat
          topK: 40, // Standard sampling
          topP: 0.95, // Standard for complete responses
          maxOutputTokens: 2048, // Adequate for chat
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
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

    console.log(`✅ Generated chat response: ${generatedText.length} characters`);

    return generatedText.trim();

  } catch (error) {
    console.error('❌ Gemini Chat Error:', error.message);
    throw error;
  }
}

// Fallback content generation (templates)
async function generateContentFallback(prompt, outputType) {
  const generators = {
    web: generateWebAppTemplate,
    mobile: generateMobileAppTemplate,
    document: generateDocumentTemplate,
    api: generateAPITemplate,
    data: generateDataAnalysisTemplate
  };

  const generator = generators[outputType] || generators.web;
  return await generator(prompt);
}

// Fallback chat response
async function generateChatResponseFallback(message, user = null) {
  const lowerMessage = message.toLowerCase();
  const userName = user?.name ? `, ${user.name}` : '';
  const userGreeting = user?.name ? `${user.name}` : 'there';
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello${userName}! 👋 Welcome to Codex Playground!\n\nI'm your AI coding assistant. I can help you with programming questions, debugging, code explanations, and more. What would you like to work on today?`;
  }
  
  if (lowerMessage.includes('thank')) {
    return `You're welcome${userName}! 😊 Happy to help. Feel free to ask me anything about coding!`;
  }
  
  if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
    return `I'd be happy to help debug${userName}! 🔍\n\nTo assist you better, please share:\n• The error message\n• The code that's causing the issue\n• What you expected to happen\n\nI'll help you figure it out!`;
  }
  
  if (lowerMessage.includes('learn') || lowerMessage.includes('tutorial')) {
    const skillLevel = user?.experienceLevel || 'beginner';
    const advice = skillLevel === 'beginner' 
      ? `Great question about learning! 📚\n\nAs a beginner, here's my advice:\n• Start with small projects\n• Practice daily with simple exercises\n• Read documentation and tutorials\n• Don't be afraid to make mistakes\n• Join coding communities for support`
      : `Great question about learning! 📚\n\nHere's my advice:\n• Build real-world projects\n• Contribute to open source\n• Learn advanced patterns and architectures\n• Stay updated with latest technologies\n• Mentor others to solidify your knowledge`;
    
    return `${advice}\n\nWhat technology are you interested in learning?`;
  }
  
  if (lowerMessage.includes('who am i') || lowerMessage.includes('my name')) {
    if (user?.name) {
      return `You're ${user.name}! 😊\n\nHere's what I know about you:\n• Experience Level: ${user.experienceLevel || 'Not set'}\n• Preferred Language: ${user.preferredLanguage || 'Not set'}\n• Current Project: ${user.currentProject || 'Not set'}\n\nHow can I help you today?`;
    }
    return `I don't have your profile information yet. You can set up your profile to get personalized responses! 😊`;
  }
  
  return `Hey ${userGreeting}! I'm here to help with your coding journey! 💻\n\nI can assist with:\n• Programming concepts and questions\n• Debugging and troubleshooting\n• Code reviews and best practices\n• Learning resources\n\nWhat specific question can I help you with?`;
}

// Template generators
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      width: 100%;
      animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    h1 { 
      color: #667eea;
      margin-bottom: 20px;
      font-size: 2.5em;
    }
    
    p { color: #555; line-height: 1.8; margin-bottom: 20px; }
    
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 10px;
      font-size: 1.1em;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    button:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ ${escapeHtml(prompt)}</h1>
    <p>This is your AI-generated web application. Customize it to fit your needs!</p>
    <button onclick="alert('Hello from your AI-generated app!')">Click Me</button>
  </div>
</body>
</html>`;

  return { html, type: 'html', language: 'html' };
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
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  count: { fontSize: 64, fontWeight: 'bold', color: 'white', marginBottom: 30 },
  button: { backgroundColor: '#764ba2', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default App;`;

  return { code, type: 'javascript', language: 'javascript' };
}

async function generateDocumentTemplate(prompt) {
  const content = `# ${prompt}

## Overview
This documentation was generated for: **${prompt}**

## Getting Started
Follow these steps to get started with ${prompt}.

### Installation
\`\`\`bash
npm install ${prompt.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

### Usage
\`\`\`javascript
// Example usage
const example = require('${prompt.toLowerCase().replace(/\s+/g, '-')}');
example.run();
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## API Reference
Documentation for the main API methods.

## License
MIT License`;

  return { content, type: 'markdown', language: 'markdown' };
}

async function generateAPITemplate(prompt) {
  const code = `const express = require('express');
const router = express.Router();

// GET - Retrieve all items
router.get('/api/items', async (req, res) => {
  try {
    const items = [{ id: 1, name: 'Item 1' }];
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Create new item
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

# ${prompt} - Data Analysis Script

def load_data(file_path):
    """Load data from CSV file"""
    return pd.read_csv(file_path)

def analyze_data(df):
    """Perform basic data analysis"""
    print("Dataset Shape:", df.shape)
    print("\\nSummary Statistics:")
    print(df.describe())
    return df

def visualize_data(df):
    """Create visualizations"""
    df.hist(figsize=(12, 8))
    plt.tight_layout()
    plt.savefig('analysis.png')
    print("Visualization saved as 'analysis.png'")

if __name__ == "__main__":
    # df = load_data('your_data.csv')
    # analyze_data(df)
    # visualize_data(df)
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
    service: 'AI Generator API',
    geminiConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

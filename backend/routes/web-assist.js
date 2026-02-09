const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// AI Web Development Assistant
router.post('/web-assist', async (req, res) => {
  try {
    const { prompt, code, language, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Enhanced system prompt for web development
    const systemPrompt = `You are an expert web development AI assistant, similar to Kiro AI. You help developers write better HTML, CSS, and JavaScript code.

Your capabilities:
- Explain code clearly and concisely
- Suggest improvements and best practices
- Debug and fix issues
- Generate clean, modern code
- Provide responsive design solutions
- Ensure accessibility compliance
- Optimize performance

Guidelines:
- Be concise but thorough
- Use modern web standards (HTML5, CSS3, ES6+)
- Follow best practices
- Provide working code examples
- Explain your reasoning
- Consider browser compatibility
- Focus on user experience

Current language: ${language}
User request: ${prompt}

${code ? `Current code:\n\`\`\`${language}\n${code}\n\`\`\`` : ''}

Provide a helpful, actionable response:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI web assist error:', error);
    res.status(500).json({
      success: false,
      error: 'AI assistance failed',
      message: error.message
    });
  }
});

// Code completion endpoint
router.post('/complete', async (req, res) => {
  try {
    const { code, language, cursorPosition } = req.body;

    const prompt = `Complete this ${language} code intelligently:

\`\`\`${language}
${code}
\`\`\`

Cursor position: ${cursorPosition}

Provide the next logical code completion. Be concise and context-aware.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const completion = response.text();

    res.json({
      success: true,
      completion: completion.trim(),
      language
    });

  } catch (error) {
    console.error('Code completion error:', error);
    res.status(500).json({
      success: false,
      error: 'Completion failed'
    });
  }
});

// Code explanation endpoint
router.post('/explain', async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `Explain this ${language} code in a clear, educational way:

\`\`\`${language}
${code}
\`\`\`

Break down:
1. What it does
2. How it works
3. Key concepts used
4. Potential improvements

Keep it concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({
      success: true,
      explanation,
      language
    });

  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      success: false,
      error: 'Explanation failed'
    });
  }
});

// Bug detection endpoint
router.post('/debug', async (req, res) => {
  try {
    const { code, language, error } = req.body;

    const prompt = `Debug this ${language} code and find issues:

\`\`\`${language}
${code}
\`\`\`

${error ? `Error message: ${error}` : ''}

Identify:
1. Bugs and errors
2. Potential issues
3. Code smells
4. Suggested fixes

Provide actionable solutions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const debugInfo = response.text();

    res.json({
      success: true,
      debugInfo,
      language
    });

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug failed'
    });
  }
});

// Code improvement endpoint
router.post('/improve', async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `Improve this ${language} code with modern best practices:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Improved version of the code
2. Explanation of changes
3. Performance optimizations
4. Accessibility improvements (if HTML)
5. Modern syntax and patterns

Focus on practical, production-ready improvements.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvements = response.text();

    res.json({
      success: true,
      improvements,
      language
    });

  } catch (error) {
    console.error('Code improvement error:', error);
    res.status(500).json({
      success: false,
      error: 'Improvement failed'
    });
  }
});

// Generate component endpoint
router.post('/generate', async (req, res) => {
  try {
    const { description, language, framework } = req.body;

    const prompt = `Generate ${language} code for: ${description}

${framework ? `Framework: ${framework}` : ''}

Requirements:
- Clean, modern code
- Best practices
- Responsive design (if CSS)
- Accessible (if HTML)
- Well-commented
- Production-ready

Provide complete, working code.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCode = response.text();

    res.json({
      success: true,
      code: generatedCode,
      language
    });

  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Generation failed'
    });
  }
});

// Responsive design suggestions
router.post('/responsive', async (req, res) => {
  try {
    const { css } = req.body;

    const prompt = `Make this CSS responsive and mobile-friendly:

\`\`\`css
${css}
\`\`\`

Provide:
1. Mobile-first responsive CSS
2. Breakpoints for different devices
3. Flexible layouts
4. Touch-friendly interactions
5. Performance optimizations

Use modern CSS techniques (Grid, Flexbox, clamp(), etc.)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responsiveCSS = response.text();

    res.json({
      success: true,
      responsiveCSS
    });

  } catch (error) {
    console.error('Responsive design error:', error);
    res.status(500).json({
      success: false,
      error: 'Responsive design failed'
    });
  }
});

// Accessibility improvements
router.post('/accessibility', async (req, res) => {
  try {
    const { html } = req.body;

    const prompt = `Improve accessibility of this HTML:

\`\`\`html
${html}
\`\`\`

Add:
1. ARIA labels and roles
2. Semantic HTML elements
3. Keyboard navigation support
4. Screen reader compatibility
5. Focus management
6. Alt text for images
7. Proper heading hierarchy

Follow WCAG 2.1 AA standards.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const accessibleHTML = response.text();

    res.json({
      success: true,
      accessibleHTML
    });

  } catch (error) {
    console.error('Accessibility error:', error);
    res.status(500).json({
      success: false,
      error: 'Accessibility improvement failed'
    });
  }
});

module.exports = router;

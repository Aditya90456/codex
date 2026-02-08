const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple in-memory cache for faster responses
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

// Generate AI visualization for problem-solving logic
router.post('/visualize-logic', async (req, res) => {
  try {
    const { problemId, problemTitle, code } = req.body;

    if (!problemTitle) {
      return res.status(400).json({
        success: false,
        error: 'Problem title is required'
      });
    }

    // Check cache first
    const cacheKey = `${problemTitle}-${code?.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('✅ Returning cached visualization');
      return res.json({
        success: true,
        animation: cached.animation,
        cached: true
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1500,
      }
    });

    // Simple, fast prompt
    const prompt = `Create ${problemTitle} visualization. Return ONLY this JSON (no markdown):
{"steps":[{"stepNumber":1,"explanation":"Step description","drawing":[{"type":"rectangle","color":"#3b82f6","startX":50,"startY":100,"endX":110,"endY":150,"lineWidth":2},{"type":"text","color":"#000","startX":70,"startY":130,"text":"2","fontSize":20}]}]}

Make 3-4 steps. Show array boxes, values, indices, arrows. Use: rectangle, circle, arrow, text types.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Clean up the response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let animation;
    try {
      animation = JSON.parse(text);
      
      // Cache the result
      cache.set(cacheKey, {
        animation,
        timestamp: Date.now()
      });
      
      // Clean old cache entries
      if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      
    } catch (parseError) {
      console.log('⚠️  Using simple fallback animation');
      animation = {
        steps: [
          {
            stepNumber: 1,
            explanation: "Initialize array and variables",
            drawing: [
              {type: "rectangle", color: "#e5e7eb", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "rectangle", color: "#e5e7eb", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 140, startY: 130, text: "7", fontSize: 20}
            ]
          },
          {
            stepNumber: 2,
            explanation: "Process first element",
            drawing: [
              {type: "rectangle", color: "#3b82f6", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 2},
              {type: "text", color: "#fff", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "rectangle", color: "#e5e7eb", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 2},
              {type: "text", color: "#000", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "arrow", color: "#ef4444", startX: 80, startY: 160, endX: 80, endY: 180, lineWidth: 2}
            ]
          },
          {
            stepNumber: 3,
            explanation: "Found result!",
            drawing: [
              {type: "rectangle", color: "#10b981", startX: 50, startY: 100, endX: 110, endY: 150, lineWidth: 2},
              {type: "text", color: "#fff", startX: 70, startY: 130, text: "2", fontSize: 20},
              {type: "rectangle", color: "#10b981", startX: 120, startY: 100, endX: 180, endY: 150, lineWidth: 2},
              {type: "text", color: "#fff", startX: 140, startY: 130, text: "7", fontSize: 20},
              {type: "text", color: "#10b981", startX: 50, startY: 200, text: "Answer: [0, 1]", fontSize: 18}
            ]
          }
        ]
      };
    }

    res.json({
      success: true,
      animation: animation
    });

  } catch (error) {
    console.error('AI Visualization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate visualization',
      message: error.message
    });
  }
});

// Generate visualization for specific algorithm
router.post('/visualize-algorithm', async (req, res) => {
  try {
    const { algorithm, input } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Create a step-by-step visual animation for ${algorithm} algorithm.
Input: ${input}

Provide animation steps showing:
- Initial state
- Each iteration/step
- Comparisons and swaps
- Final result

Return JSON with animation steps including coordinates, colors, and explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const animation = JSON.parse(text);

    res.json({
      success: true,
      animation: animation
    });

  } catch (error) {
    console.error('Algorithm visualization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate algorithm visualization'
    });
  }
});

module.exports = router;

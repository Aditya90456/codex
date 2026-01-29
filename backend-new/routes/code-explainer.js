const express = require('express');
const router = express.Router();

// Code explanation endpoint using Gemini AI
router.post('/explain-code', async (req, res) => {
  try {
    const { code, problemTitle, language = 'javascript' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert DSA tutor. Analyze this code solution and create a step-by-step animated explanation.

Problem: ${problemTitle}
Language: ${language}
Code:
${code}

Provide a JSON response with this EXACT structure:
{
  "algorithm": "Name of the algorithm/technique used",
  "timeComplexity": "Big O notation",
  "spaceComplexity": "Big O notation",
  "steps": [
    {
      "id": 1,
      "title": "Step title",
      "description": "What happens in this step",
      "explanation": "Why this step is important"
    }
  ],
  "keyInsights": [
    "Important insight 1",
    "Important insight 2",
    "Important insight 3"
  ]
}

Make it educational and clear. Focus on the algorithm logic, not just code syntax. Include 4-6 steps.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Try to parse JSON from response
    let explanation;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       responseText.match(/```\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      explanation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a structured error response
      return res.json({
        explanation: {
          algorithm: "Algorithm Analysis",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          steps: [
            {
              id: 1,
              title: "Understanding the Problem",
              description: "Analyze the problem requirements and constraints",
              explanation: "First step is to understand what the problem is asking for."
            },
            {
              id: 2,
              title: "Choosing an Approach",
              description: "Select the most efficient algorithm",
              explanation: "Consider different approaches and their trade-offs."
            },
            {
              id: 3,
              title: "Implementation",
              description: "Code the solution step by step",
              explanation: "Implement the chosen algorithm with clean code."
            }
          ],
          keyInsights: [
            "Understanding the problem is crucial",
            "Consider time and space complexity",
            "Test with edge cases"
          ]
        }
      });
    }

    res.json({ explanation });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      error: 'Failed to generate explanation',
      details: error.message
    });
  }
});

module.exports = router;

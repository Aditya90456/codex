const express = require('express');
const router = express.Router();

// AI hint generation endpoint
router.post('/dsa-hint', async (req, res) => {
  try {
    const { problem, description, code } = req.body;

    // Check if Gemini API is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        hint: `💡 Hint for ${problem}: Consider the time complexity. Can you optimize using a hash map or two pointers?`
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a helpful DSA tutor. Give a subtle hint (not the full solution) for this problem:

Problem: ${problem}
Description: ${description}
${code ? `Current code attempt:\n${code}` : ''}

Provide a brief, encouraging hint that guides the student without giving away the answer. Keep it under 100 words.`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text();

    res.json({ hint });
  } catch (error) {
    console.error('AI hint error:', error);
    res.json({
      hint: '💡 Think about the data structure that would give you O(1) lookup time. What have you learned about hash maps?'
    });
  }
});

// Solution explanation endpoint
router.post('/explain-solution', async (req, res) => {
  try {
    const { problem, description } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        explanation: `📚 Optimal approach for ${problem}:\n\n1. Use a hash map to store elements\n2. For each element, check if target - element exists\n3. Time: O(n), Space: O(n)`
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Explain the optimal solution approach for this DSA problem:

Problem: ${problem}
Description: ${description}

Provide:
1. The optimal approach (algorithm/data structure)
2. Time and space complexity
3. Key insights
Keep it clear and educational, under 200 words.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.json({ explanation });
  } catch (error) {
    console.error('Solution explanation error:', error);
    res.json({
      explanation: '📚 The optimal solution typically involves choosing the right data structure. Consider hash maps for O(1) lookups, or two pointers for sorted arrays.'
    });
  }
});

// Code review endpoint
router.post('/review-code', async (req, res) => {
  try {
    const { problem, code } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        review: '✅ Good attempt! Consider edge cases and optimize time complexity.'
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Review this DSA solution code:

Problem: ${problem}
Code:
${code}

Provide brief feedback on:
1. Correctness
2. Time/space complexity
3. One improvement suggestion
Keep it under 150 words and encouraging.`;

    const result = await model.generateContent(prompt);
    const review = result.response.text();

    res.json({ review });
  } catch (error) {
    console.error('Code review error:', error);
    res.json({
      review: '✅ Your code structure looks good! Make sure to handle edge cases and consider if there\'s a more efficient approach.'
    });
  }
});

module.exports = router;

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
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

    // If Gemini returns empty, use fallback
    if (!suggestions || suggestions.length === 0) {
      console.warn('⚠️  Gemini returned no suggestions, using fallback');
      const fallbackSuggestions = generateFallbackCompletions(code, language, cursorPosition);
      return res.json({
        success: true,
        suggestions: fallbackSuggestions,
        source: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

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

  const prompt = `You are an expert code completion AI for ${language}. Generate VALID JSON ONLY.

Language: ${language}
Context: ${context}
Current line: ${currentLine}
Previous context: ${previousLines}

Generate ${maxSuggestions} intelligent code completions as a JSON array.

For ${language}, consider:
- Language-specific syntax and patterns
- Common libraries and frameworks
- Best practices and idioms
- Algorithm patterns for competitive programming
- Method chaining and object properties
- Import/include statements
- Control flow structures
- Data types and structures

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no extra text.

Format (copy exactly):
[{"text":"suggestion1","description":"desc1","type":"snippet"},{"text":"suggestion2","description":"desc2","type":"method"}]

Types: snippet, method, function, keyword, import, class, variable, property, algorithm

Your response:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 10,
          topP: 0.5,
          maxOutputTokens: 512,
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

    let suggestions = [];
    try {
      suggestions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn('JSON parse failed, trying to fix common issues:', parseError.message);
      
      // Try to fix common JSON issues
      try {
        // Remove trailing commas
        cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
        // Fix unescaped quotes in strings
        cleanedText = cleanedText.replace(/: "([^"]*)"([^,}\]]*)/g, (match, p1, p2) => {
          if (p2 && !p2.match(/^\s*[,}\]]/)) {
            return `: "${p1}\\"${p2}`;
          }
          return match;
        });
        suggestions = JSON.parse(cleanedText);
      } catch (fixError) {
        console.warn('Could not fix JSON, returning empty array');
        return [];
      }
    }
    
    if (!Array.isArray(suggestions)) {
      console.warn('Gemini returned non-array response, wrapping in array');
      suggestions = [suggestions];
    }
    
    return suggestions.slice(0, maxSuggestions).map(s => ({
      text: s.text || s.completion || '',
      description: s.description || 'Code suggestion',
      type: s.type || 'snippet',
      confidence: 0.9
    }));

  } catch (error) {
    console.error('Gemini completion error:', error);
    // Return empty array instead of throwing to allow fallback
    return [];
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
        { text: 'forEach()', description: 'Array forEach method', type: 'function', confidence: 0.7 },
        { text: 'reduce()', description: 'Array reduce method', type: 'function', confidence: 0.7 },
        { text: 'find()', description: 'Array find method', type: 'function', confidence: 0.6 },
        { text: 'includes()', description: 'Array includes method', type: 'function', confidence: 0.6 },
        { text: 'push()', description: 'Array push method', type: 'function', confidence: 0.6 },
        { text: 'pop()', description: 'Array pop method', type: 'function', confidence: 0.6 }
      );
    }
    
    if (currentLine.includes('import ')) {
      suggestions.push(
        { text: '{ } from ""', description: 'Named import', type: 'import', confidence: 0.8 },
        { text: 'React from "react"', description: 'React import', type: 'import', confidence: 0.7 },
        { text: '{ useState } from "react"', description: 'React hooks import', type: 'import', confidence: 0.7 }
      );
    }
    
    if (currentLine.includes('class ')) {
      suggestions.push(
        { text: '{\n  constructor() {\n    \n  }\n}', description: 'Class with constructor', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('for ')) {
      suggestions.push(
        { text: '(let i = 0; i < length; i++) {\n  \n}', description: 'For loop', type: 'snippet', confidence: 0.9 },
        { text: '(const item of items) {\n  \n}', description: 'For...of loop', type: 'snippet', confidence: 0.8 },
        { text: '(const key in object) {\n  \n}', description: 'For...in loop', type: 'snippet', confidence: 0.7 }
      );
    }
    
    if (currentLine.includes('if ')) {
      suggestions.push(
        { text: '(condition) {\n  \n}', description: 'If statement', type: 'snippet', confidence: 0.9 },
        { text: '(condition) {\n  \n} else {\n  \n}', description: 'If-else statement', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('try')) {
      suggestions.push(
        { text: ' {\n  \n} catch (error) {\n  \n}', description: 'Try-catch block', type: 'snippet', confidence: 0.9 },
        { text: ' {\n  \n} catch (error) {\n  \n} finally {\n  \n}', description: 'Try-catch-finally', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('async ')) {
      suggestions.push(
        { text: 'function() {\n  \n}', description: 'Async function', type: 'snippet', confidence: 0.9 },
        { text: '() => {\n  \n}', description: 'Async arrow function', type: 'snippet', confidence: 0.8 }
      );
    }
  }

  // Python completions
  if (language === 'python') {
    if (currentLine.includes('def ')) {
      suggestions.push(
        { text: '():\n    pass', description: 'Function definition', type: 'snippet', confidence: 0.9 },
        { text: '(self):\n    pass', description: 'Method definition', type: 'snippet', confidence: 0.8 },
        { text: '(self, *args, **kwargs):\n    pass', description: 'Method with args', type: 'snippet', confidence: 0.7 }
      );
    }
    
    if (currentLine.includes('class ')) {
      suggestions.push(
        { text: ':\n    def __init__(self):\n        pass', description: 'Class with constructor', type: 'snippet', confidence: 0.9 },
        { text: '(object):\n    def __init__(self):\n        pass', description: 'Class inheriting from object', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('if ')) {
      suggestions.push(
        { text: ':\n    pass', description: 'If statement body', type: 'snippet', confidence: 0.9 },
        { text: '__name__ == "__main__":\n    pass', description: 'Main guard', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('for ')) {
      suggestions.push(
        { text: 'i in range():\n    pass', description: 'For loop with range', type: 'snippet', confidence: 0.9 },
        { text: 'item in items:\n    pass', description: 'For loop over items', type: 'snippet', confidence: 0.8 },
        { text: 'i, item in enumerate(items):\n    pass', description: 'For loop with enumerate', type: 'snippet', confidence: 0.7 }
      );
    }
    
    if (currentLine.includes('while ')) {
      suggestions.push(
        { text: 'True:\n    pass', description: 'Infinite loop', type: 'snippet', confidence: 0.8 },
        { text: 'condition:\n    pass', description: 'While loop', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('try')) {
      suggestions.push(
        { text: ':\n    pass\nexcept Exception as e:\n    pass', description: 'Try-except block', type: 'snippet', confidence: 0.9 },
        { text: ':\n    pass\nexcept:\n    pass\nfinally:\n    pass', description: 'Try-except-finally', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('import ')) {
      suggestions.push(
        { text: 'os', description: 'Import os module', type: 'module', confidence: 0.8 },
        { text: 'sys', description: 'Import sys module', type: 'module', confidence: 0.8 },
        { text: 'json', description: 'Import json module', type: 'module', confidence: 0.7 },
        { text: 'datetime', description: 'Import datetime module', type: 'module', confidence: 0.7 },
        { text: 'requests', description: 'Import requests module', type: 'module', confidence: 0.6 },
        { text: 'numpy as np', description: 'Import numpy', type: 'module', confidence: 0.6 },
        { text: 'pandas as pd', description: 'Import pandas', type: 'module', confidence: 0.6 }
      );
    }
    
    if (currentLine.includes('from ')) {
      suggestions.push(
        { text: 'typing import List, Dict, Optional', description: 'Import typing hints', type: 'module', confidence: 0.8 },
        { text: 'collections import defaultdict, Counter', description: 'Import collections', type: 'module', confidence: 0.7 },
        { text: 'itertools import combinations, permutations', description: 'Import itertools', type: 'module', confidence: 0.6 }
      );
    }
    
    // Python built-in functions and methods
    if (currentLine.trim().endsWith('.')) {
      suggestions.push(
        { text: 'append()', description: 'Add item to list', type: 'method', confidence: 0.8 },
        { text: 'extend()', description: 'Extend list with items', type: 'method', confidence: 0.7 },
        { text: 'pop()', description: 'Remove and return item', type: 'method', confidence: 0.7 },
        { text: 'remove()', description: 'Remove first occurrence', type: 'method', confidence: 0.6 },
        { text: 'sort()', description: 'Sort list in place', type: 'method', confidence: 0.6 },
        { text: 'reverse()', description: 'Reverse list in place', type: 'method', confidence: 0.6 },
        { text: 'split()', description: 'Split string', type: 'method', confidence: 0.8 },
        { text: 'join()', description: 'Join strings', type: 'method', confidence: 0.7 },
        { text: 'strip()', description: 'Remove whitespace', type: 'method', confidence: 0.7 },
        { text: 'replace()', description: 'Replace substring', type: 'method', confidence: 0.6 },
        { text: 'keys()', description: 'Dictionary keys', type: 'method', confidence: 0.7 },
        { text: 'values()', description: 'Dictionary values', type: 'method', confidence: 0.7 },
        { text: 'items()', description: 'Dictionary items', type: 'method', confidence: 0.7 }
      );
    }
    
    // Python keywords and common patterns
    if (currentLine.trim() === '' || currentLine.endsWith(' ')) {
      suggestions.push(
        { text: 'print()', description: 'Print to console', type: 'function', confidence: 0.9 },
        { text: 'len()', description: 'Get length', type: 'function', confidence: 0.8 },
        { text: 'range()', description: 'Generate range', type: 'function', confidence: 0.8 },
        { text: 'enumerate()', description: 'Enumerate items', type: 'function', confidence: 0.7 },
        { text: 'zip()', description: 'Zip iterables', type: 'function', confidence: 0.7 },
        { text: 'sorted()', description: 'Return sorted list', type: 'function', confidence: 0.6 },
        { text: 'reversed()', description: 'Return reversed iterator', type: 'function', confidence: 0.6 },
        { text: 'sum()', description: 'Sum of items', type: 'function', confidence: 0.6 },
        { text: 'max()', description: 'Maximum value', type: 'function', confidence: 0.6 },
        { text: 'min()', description: 'Minimum value', type: 'function', confidence: 0.6 }
      );
    }
    
    // Data structure suggestions
    if (currentLine.includes('= ')) {
      suggestions.push(
        { text: '[]', description: 'Empty list', type: 'literal', confidence: 0.8 },
        { text: '{}', description: 'Empty dictionary', type: 'literal', confidence: 0.8 },
        { text: 'set()', description: 'Empty set', type: 'literal', confidence: 0.7 },
        { text: '()', description: 'Empty tuple', type: 'literal', confidence: 0.6 },
        { text: 'None', description: 'None value', type: 'literal', confidence: 0.7 },
        { text: 'True', description: 'Boolean True', type: 'literal', confidence: 0.6 },
        { text: 'False', description: 'Boolean False', type: 'literal', confidence: 0.6 }
      );
    }
    
    // LeetCode/DSA specific patterns
    if (currentLine.includes('def ') && (currentLine.includes('Solution') || currentLine.includes('solve'))) {
      suggestions.push(
        { text: 'twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass', description: 'Two Sum function', type: 'snippet', confidence: 0.9 },
        { text: 'reverseString(self, s: List[str]) -> None:\n    pass', description: 'Reverse String function', type: 'snippet', confidence: 0.8 },
        { text: 'isPalindrome(self, s: str) -> bool:\n    pass', description: 'Palindrome check function', type: 'snippet', confidence: 0.8 }
      );
    }
    
    // Common algorithm patterns
    if (currentLine.includes('# ') || currentLine.includes('"""')) {
      suggestions.push(
        { text: 'Two pointers approach', description: 'Algorithm comment', type: 'comment', confidence: 0.7 },
        { text: 'Binary search approach', description: 'Algorithm comment', type: 'comment', confidence: 0.7 },
        { text: 'Dynamic programming approach', description: 'Algorithm comment', type: 'comment', confidence: 0.6 },
        { text: 'Sliding window approach', description: 'Algorithm comment', type: 'comment', confidence: 0.6 }
      );
    }
  }

  // Java completions
  if (language === 'java') {
    if (currentLine.includes('public class ')) {
      suggestions.push(
        { text: '{\n    \n}', description: 'Class body', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('public ') && currentLine.includes('(')) {
      suggestions.push(
        { text: '{\n    \n}', description: 'Method body', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('for ')) {
      suggestions.push(
        { text: '(int i = 0; i < length; i++) {\n    \n}', description: 'For loop', type: 'snippet', confidence: 0.9 },
        { text: '(Type item : items) {\n    \n}', description: 'Enhanced for loop', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.includes('if ')) {
      suggestions.push(
        { text: '(condition) {\n    \n}', description: 'If statement', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('try')) {
      suggestions.push(
        { text: ' {\n    \n} catch (Exception e) {\n    \n}', description: 'Try-catch block', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('import ')) {
      suggestions.push(
        { text: 'java.util.*;', description: 'Import util package', type: 'import', confidence: 0.8 },
        { text: 'java.io.*;', description: 'Import io package', type: 'import', confidence: 0.7 },
        { text: 'java.util.List;', description: 'Import List', type: 'import', confidence: 0.7 },
        { text: 'java.util.ArrayList;', description: 'Import ArrayList', type: 'import', confidence: 0.7 }
      );
    }
    
    if (currentLine.trim().endsWith('.')) {
      suggestions.push(
        { text: 'add()', description: 'Add to collection', type: 'method', confidence: 0.8 },
        { text: 'get()', description: 'Get from collection', type: 'method', confidence: 0.8 },
        { text: 'size()', description: 'Get size', type: 'method', confidence: 0.7 },
        { text: 'isEmpty()', description: 'Check if empty', type: 'method', confidence: 0.7 },
        { text: 'contains()', description: 'Check if contains', type: 'method', confidence: 0.6 },
        { text: 'length()', description: 'String length', type: 'method', confidence: 0.8 },
        { text: 'charAt()', description: 'Get character at index', type: 'method', confidence: 0.7 },
        { text: 'substring()', description: 'Get substring', type: 'method', confidence: 0.7 }
      );
    }
  }

  // C++ completions
  if (language === 'cpp') {
    if (currentLine.includes('#include ')) {
      suggestions.push(
        { text: '<iostream>', description: 'Include iostream', type: 'include', confidence: 0.9 },
        { text: '<vector>', description: 'Include vector', type: 'include', confidence: 0.8 },
        { text: '<string>', description: 'Include string', type: 'include', confidence: 0.8 },
        { text: '<algorithm>', description: 'Include algorithm', type: 'include', confidence: 0.7 },
        { text: '<map>', description: 'Include map', type: 'include', confidence: 0.7 },
        { text: '<set>', description: 'Include set', type: 'include', confidence: 0.6 }
      );
    }
    
    if (currentLine.includes('int ') || currentLine.includes('void ')) {
      suggestions.push(
        { text: '() {\n    \n}', description: 'Function body', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('class ')) {
      suggestions.push(
        { text: '{\npublic:\n    \nprivate:\n    \n};', description: 'Class definition', type: 'snippet', confidence: 0.9 }
      );
    }
    
    if (currentLine.includes('for ')) {
      suggestions.push(
        { text: '(int i = 0; i < n; i++) {\n    \n}', description: 'For loop', type: 'snippet', confidence: 0.9 },
        { text: '(auto& item : container) {\n    \n}', description: 'Range-based for loop', type: 'snippet', confidence: 0.8 }
      );
    }
    
    if (currentLine.trim().endsWith('.')) {
      suggestions.push(
        { text: 'push_back()', description: 'Add to vector', type: 'method', confidence: 0.8 },
        { text: 'size()', description: 'Get size', type: 'method', confidence: 0.8 },
        { text: 'empty()', description: 'Check if empty', type: 'method', confidence: 0.7 },
        { text: 'clear()', description: 'Clear container', type: 'method', confidence: 0.7 },
        { text: 'begin()', description: 'Get begin iterator', type: 'method', confidence: 0.6 },
        { text: 'end()', description: 'Get end iterator', type: 'method', confidence: 0.6 }
      );
    }
  }

  // HTML completions
  if (language === 'html') {
    if (currentLine.includes('<')) {
      suggestions.push(
        { text: 'div></div>', description: 'Div element', type: 'snippet', confidence: 0.8 },
        { text: 'span></span>', description: 'Span element', type: 'snippet', confidence: 0.7 },
        { text: 'p></p>', description: 'Paragraph element', type: 'snippet', confidence: 0.7 },
        { text: 'a href=""></a>', description: 'Anchor element', type: 'snippet', confidence: 0.7 },
        { text: 'img src="" alt="">', description: 'Image element', type: 'snippet', confidence: 0.6 },
        { text: 'button></button>', description: 'Button element', type: 'snippet', confidence: 0.6 }
      );
    }
  }

  // CSS completions
  if (language === 'css') {
    if (currentLine.includes('{') || currentLine.trim().endsWith(':')) {
      suggestions.push(
        { text: 'color: ', description: 'Text color', type: 'property', confidence: 0.8 },
        { text: 'background: ', description: 'Background', type: 'property', confidence: 0.8 },
        { text: 'font-size: ', description: 'Font size', type: 'property', confidence: 0.7 },
        { text: 'margin: ', description: 'Margin', type: 'property', confidence: 0.7 },
        { text: 'padding: ', description: 'Padding', type: 'property', confidence: 0.7 },
        { text: 'border: ', description: 'Border', type: 'property', confidence: 0.6 },
        { text: 'width: ', description: 'Width', type: 'property', confidence: 0.6 },
        { text: 'height: ', description: 'Height', type: 'property', confidence: 0.6 }
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
    model: 'gemini-2.5-flash',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

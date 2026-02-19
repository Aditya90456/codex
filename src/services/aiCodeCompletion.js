// AI Code Completion Service - Similar to Codemate/Copilot
// Install: npm install @google/generative-ai

let GoogleGenerativeAI;
try {
  const module = await import('@google/generative-ai');
  GoogleGenerativeAI = module.GoogleGenerativeAI;
} catch (error) {
  console.warn('Google Generative AI not installed. Run: npm install @google/generative-ai');
}

class AICodeCompletionService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.debounceTimer = null;
    this.debounceDelay = 500; // ms
    this.isAvailable = !!GoogleGenerativeAI;
  }

  initialize(apiKey) {
    if (!this.isAvailable) {
      console.warn('AI Code Completion: Google Generative AI package not installed');
      return false;
    }
    
    if (!apiKey) {
      console.warn('AI Code Completion: No API key provided');
      return false;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.2, // Lower temperature for more deterministic code
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40,
        }
      });
      return true;
    } catch (error) {
      console.error('AI Code Completion initialization error:', error);
      return false;
    }
  }

  // Get cache key from context
  getCacheKey(code, cursorPosition, language) {
    const contextWindow = 200; // characters before cursor
    const start = Math.max(0, cursorPosition - contextWindow);
    const context = code.substring(start, cursorPosition);
    return `${language}:${context}`;
  }

  // Check cache for completion
  getFromCache(key) {
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      // Cache valid for 5 minutes
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.completion;
      }
      this.cache.delete(key);
    }
    return null;
  }

  // Add to cache
  addToCache(key, completion) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      completion,
      timestamp: Date.now()
    });
  }

  // Extract context around cursor
  extractContext(code, cursorPosition, language) {
    const lines = code.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    // Find current line
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPosition) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }

    // Get context: 10 lines before, current line, 2 lines after
    const startLine = Math.max(0, currentLine - 10);
    const endLine = Math.min(lines.length, currentLine + 3);
    const contextLines = lines.slice(startLine, endLine);
    
    return {
      beforeCursor: code.substring(0, cursorPosition),
      afterCursor: code.substring(cursorPosition, cursorPosition + 200),
      currentLine: lines[currentLine] || '',
      contextLines: contextLines.join('\n'),
      lineNumber: currentLine
    };
  }

  // Generate completion prompt
  generatePrompt(context, language, problemContext) {
    const { beforeCursor, afterCursor, currentLine, contextLines } = context;
    
    // Get the last few characters to understand what user is typing
    const recentCode = beforeCursor.slice(-100);
    
    return `You are an expert ${language} code completion assistant. Complete the code naturally and concisely.

Language: ${language}
${problemContext ? `Problem: ${problemContext.title}\nDescription: ${problemContext.description?.substring(0, 200)}...` : ''}

Code Context:
\`\`\`${language}
${contextLines}
\`\`\`

Recent Code:
${recentCode}

Current Line: ${currentLine}

Instructions:
1. Provide ONLY the completion text (no explanations)
2. Complete the current statement or suggest the next logical line
3. Match the existing code style and indentation
4. Keep completions short (1-3 lines max)
5. For function calls, include likely parameters
6. For loops/conditions, complete the structure
7. Do NOT repeat code that's already written
8. Start completion from cursor position

Completion:`;
  }

  // Get inline completion suggestions
  async getCompletion(code, cursorPosition, language, problemContext = null) {
    if (!this.model) {
      return null;
    }

    try {
      // Check cache first
      const cacheKey = this.getCacheKey(code, cursorPosition, language);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Extract context
      const context = this.extractContext(code, cursorPosition, language);
      
      // Don't suggest if cursor is in middle of a word
      const charBefore = code[cursorPosition - 1];
      const charAfter = code[cursorPosition];
      if (charBefore && charAfter && /\w/.test(charBefore) && /\w/.test(charAfter)) {
        return null;
      }

      // Generate prompt
      const prompt = this.generatePrompt(context, language, problemContext);

      // Get AI completion
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let completion = response.text().trim();

      // Clean up completion
      completion = this.cleanCompletion(completion, context);

      // Cache result
      if (completion) {
        this.addToCache(cacheKey, completion);
      }

      return completion;
    } catch (error) {
      console.error('AI Code Completion error:', error);
      return null;
    }
  }

  // Clean and format completion
  cleanCompletion(completion, context) {
    if (!completion) return null;

    // Remove markdown code blocks
    completion = completion.replace(/```[\w]*\n?/g, '');
    completion = completion.replace(/```/g, '');
    
    // Remove explanations (text after //)
    const lines = completion.split('\n');
    const codeLines = [];
    for (const line of lines) {
      // Skip lines that are just comments or explanations
      if (line.trim().startsWith('//') && !context.currentLine.includes('//')) {
        continue;
      }
      codeLines.push(line);
    }
    completion = codeLines.join('\n');

    // Trim excessive whitespace
    completion = completion.trim();
    
    // Limit to 3 lines
    const limitedLines = completion.split('\n').slice(0, 3);
    completion = limitedLines.join('\n');

    return completion || null;
  }

  // Get multi-line suggestions (for empty lines or after specific keywords)
  async getMultiLineSuggestion(code, cursorPosition, language, problemContext = null) {
    if (!this.model) return null;

    const context = this.extractContext(code, cursorPosition, language);
    const lastLine = context.currentLine.trim();

    // Trigger multi-line for function declarations, loops, conditions
    const multiLineTriggers = [
      /^(function|const|let|var)\s+\w+\s*=\s*\(.*\)\s*=>\s*\{?\s*$/,
      /^(function|def|func)\s+\w+\s*\(.*\)\s*\{?\s*$/,
      /^(if|while|for|foreach)\s*\(.*\)\s*\{?\s*$/,
      /^(class|interface|struct)\s+\w+.*\{?\s*$/,
    ];

    const shouldTriggerMultiLine = multiLineTriggers.some(regex => regex.test(lastLine));
    
    if (shouldTriggerMultiLine) {
      return await this.getCompletion(code, cursorPosition, language, problemContext);
    }

    return null;
  }

  // Debounced completion request
  async getCompletionDebounced(code, cursorPosition, language, problemContext, callback) {
    clearTimeout(this.debounceTimer);
    
    return new Promise((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        const completion = await this.getCompletion(code, cursorPosition, language, problemContext);
        if (callback) callback(completion);
        resolve(completion);
      }, this.debounceDelay);
    });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Update settings
  updateSettings(settings) {
    if (settings.debounceDelay !== undefined) {
      this.debounceDelay = settings.debounceDelay;
    }
    if (settings.maxCacheSize !== undefined) {
      this.maxCacheSize = settings.maxCacheSize;
    }
  }
}

// Singleton instance
const aiCodeCompletionService = new AICodeCompletionService();

export default aiCodeCompletionService;

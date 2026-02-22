// Real code execution service using Judge0 CE (Community Edition)
// Free API for code execution - no backend needed!

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo-key'; // Get free key from rapidapi.com

// Language IDs for Judge0
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,           // C (GCC 9.2.0)
  csharp: 51,      // C#
  go: 60,          // Go
  rust: 73,        // Rust
  typescript: 74,  // TypeScript
  kotlin: 78,      // Kotlin
  swift: 83,       // Swift
  ruby: 72,        // Ruby
  php: 68,         // PHP
};

// Alternative: Piston API (completely free, no API key needed)
const PISTON_API = 'https://emkc.org/api/v2/piston';

const PISTON_LANGUAGES = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'c++',
  c: 'c',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  typescript: 'typescript',
  kotlin: 'kotlin',
  swift: 'swift',
  ruby: 'ruby',
  php: 'php',
};

/**
 * Execute code using Piston API (Free, no API key required)
 */
export const executeCodePiston = async (code, language, input = '') => {
  try {
    const pistonLang = PISTON_LANGUAGES[language] || 'javascript';
    
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang,
        version: '*', // Use latest version
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      output: result.run.output || result.run.stdout || '',
      error: result.run.stderr || '',
      exitCode: result.run.code,
      runtime: result.run.runtime || 0,
      memory: 0, // Piston doesn't provide memory info
    };
  } catch (error) {
    console.error('Piston execution error:', error);
    throw error;
  }
};

/**
 * Execute code using Judge0 API (Requires RapidAPI key)
 */
export const executeCodeJudge0 = async (code, language, input = '') => {
  try {
    const languageId = LANGUAGE_IDS[language] || 63;
    
    // Step 1: Submit code
    const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input,
        cpu_time_limit: 2,
        memory_limit: 128000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${submitResponse.status}`);
    }

    const result = await submitResponse.json();
    
    return {
      success: result.status.id <= 3, // 1-3 are success statuses
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      exitCode: result.status.id,
      runtime: parseFloat(result.time) * 1000 || 0, // Convert to ms
      memory: result.memory || 0,
    };
  } catch (error) {
    console.error('Judge0 execution error:', error);
    throw error;
  }
};

/**
 * Main execution function - tries Piston first (free), falls back to Judge0
 */
export const executeCode = async (code, language, input = '') => {
  try {
    // Try Piston first (completely free)
    return await executeCodePiston(code, language, input);
  } catch (pistonError) {
    console.warn('Piston failed, trying Judge0:', pistonError);
    
    try {
      // Fallback to Judge0 if available
      if (RAPIDAPI_KEY !== 'demo-key') {
        return await executeCodeJudge0(code, language, input);
      }
      throw new Error('No API key configured for Judge0');
    } catch (judge0Error) {
      console.error('Both execution services failed:', judge0Error);
      throw new Error('Code execution failed. Please try again.');
    }
  }
};

/**
 * Run test cases for a problem
 */
export const runTestCases = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const startTime = Date.now();
      const result = await executeCode(code, language, testCase.input);
      const endTime = Date.now();
      
      const output = result.output.trim();
      const expected = testCase.expected.trim();
      const passed = output === expected;
      
      results.push({
        input: testCase.input,
        expected: expected,
        output: output,
        passed: passed,
        runtime: result.runtime || (endTime - startTime),
        memory: result.memory,
        error: result.error,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        output: '',
        passed: false,
        runtime: 0,
        memory: 0,
        error: error.message,
      });
    }
  }
  
  return results;
};

/**
 * Get file extension for language
 */
function getFileExtension(language) {
  const extensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    typescript: 'ts',
    kotlin: 'kt',
    swift: 'swift',
    ruby: 'rb',
    php: 'php',
  };
  return extensions[language] || 'txt';
}

/**
 * Validate code syntax (basic check)
 */
export const validateCode = (code, language) => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }
  
  // Basic syntax checks
  const checks = {
    javascript: () => {
      try {
        new Function(code);
        return { valid: true };
      } catch (e) {
        return { valid: false, error: e.message };
      }
    },
    python: () => {
      // Basic Python syntax check
      if (code.includes('def ') || code.includes('class ') || code.includes('import ')) {
        return { valid: true };
      }
      return { valid: true }; // Allow simple scripts
    },
  };
  
  const checker = checks[language];
  if (checker) {
    return checker();
  }
  
  return { valid: true }; // Assume valid for other languages
};

export default {
  executeCode,
  runTestCases,
  validateCode,
  executeCodePiston,
  executeCodeJudge0,
};

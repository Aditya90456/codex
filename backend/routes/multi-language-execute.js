const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const { VM } = require('vm2');

const execAsync = promisify(exec);

// Temporary directory for code execution
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
}

// Execute code in multiple languages
router.post('/execute', async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    await ensureTempDir();

    let result;
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        result = await executeJavaScript(code, input);
        break;
      case 'typescript':
      case 'ts':
        result = await executeTypeScript(code, input);
        break;
      case 'python':
      case 'python3':
      case 'py':
        result = await executePython(code, input);
        break;
      case 'java':
        result = await executeJava(code, input);
        break;
      case 'cpp':
      case 'c++':
        result = await executeCpp(code, input);
        break;
      case 'c':
        result = await executeC(code, input);
        break;
      case 'csharp':
      case 'cs':
      case 'c#':
        result = await executeCSharp(code, input);
        break;
      case 'go':
      case 'golang':
        result = await executeGo(code, input);
        break;
      case 'rust':
      case 'rs':
        result = await executeRust(code, input);
        break;
      case 'ruby':
      case 'rb':
        result = await executeRuby(code, input);
        break;
      case 'php':
        result = await executePHP(code, input);
        break;
      case 'swift':
        result = await executeSwift(code, input);
        break;
      case 'kotlin':
      case 'kt':
        result = await executeKotlin(code, input);
        break;
      case 'scala':
        result = await executeScala(code, input);
        break;
      case 'r':
        result = await executeR(code, input);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported language: ${language}`,
          supportedLanguages: [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C',
            'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R'
          ]
        });
    }

    res.json({
      success: true,
      ...result,
      language
    });

  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Code execution failed',
      message: error.message
    });
  }
});

// JavaScript execution (VM2 - safe sandbox)
async function executeJavaScript(code, input) {
  const startTime = Date.now();
  
  try {
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: (...args) => args.join(' ')
        },
        input: input
      }
    });

    const output = vm.run(code);
    const runtime = Date.now() - startTime;

    return {
      output: output !== undefined ? String(output) : '',
      runtime,
      status: 'success',
      error: null
    };
  } catch (error) {
    return {
      output: '',
      runtime: Date.now() - startTime,
      status: 'error',
      error: error.message
    };
  }
}

// TypeScript execution (compile to JS then run)
async function executeTypeScript(code, input) {
  const filename = `temp_${Date.now()}.ts`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    // Compile TypeScript
    const { stdout: jsCode } = await execAsync(`npx ts-node ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: jsCode.trim(),
      runtime: 0,
      status: 'success',
      error: null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Python execution
async function executePython(code, input) {
  const filename = `temp_${Date.now()}.py`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`python ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Java execution
async function executeJava(code, input) {
  const className = code.match(/public\s+class\s+(\w+)/)?.[1] || 'Main';
  const filename = `${className}.java`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    // Compile
    await execAsync(`javac ${filepath}`, { timeout: 5000 });
    
    // Run
    const { stdout, stderr } = await execAsync(`java -cp ${TEMP_DIR} ${className}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    // Cleanup
    await fs.unlink(filepath);
    try { await fs.unlink(path.join(TEMP_DIR, `${className}.class`)); } catch {}
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// C++ execution
async function executeCpp(code, input) {
  const filename = `temp_${Date.now()}.cpp`;
  const filepath = path.join(TEMP_DIR, filename);
  const exepath = path.join(TEMP_DIR, `temp_${Date.now()}.exe`);
  
  try {
    await fs.writeFile(filepath, code);
    
    // Compile
    await execAsync(`g++ ${filepath} -o ${exepath}`, { timeout: 5000 });
    
    // Run
    const { stdout, stderr } = await execAsync(exepath, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    // Cleanup
    await fs.unlink(filepath);
    try { await fs.unlink(exepath); } catch {}
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    try { await fs.unlink(exepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// C execution
async function executeC(code, input) {
  const filename = `temp_${Date.now()}.c`;
  const filepath = path.join(TEMP_DIR, filename);
  const exepath = path.join(TEMP_DIR, `temp_${Date.now()}.exe`);
  
  try {
    await fs.writeFile(filepath, code);
    
    await execAsync(`gcc ${filepath} -o ${exepath}`, { timeout: 5000 });
    
    const { stdout, stderr } = await execAsync(exepath, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    try { await fs.unlink(exepath); } catch {}
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    try { await fs.unlink(exepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// C# execution
async function executeCSharp(code, input) {
  const filename = `temp_${Date.now()}.cs`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`csc /out:${TEMP_DIR}/temp.exe ${filepath} && ${TEMP_DIR}/temp.exe`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Go execution
async function executeGo(code, input) {
  const filename = `temp_${Date.now()}.go`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`go run ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Rust execution
async function executeRust(code, input) {
  const filename = `temp_${Date.now()}.rs`;
  const filepath = path.join(TEMP_DIR, filename);
  const exepath = path.join(TEMP_DIR, `temp_${Date.now()}`);
  
  try {
    await fs.writeFile(filepath, code);
    
    await execAsync(`rustc ${filepath} -o ${exepath}`, { timeout: 5000 });
    
    const { stdout, stderr } = await execAsync(exepath, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    try { await fs.unlink(exepath); } catch {}
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    try { await fs.unlink(exepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Ruby execution
async function executeRuby(code, input) {
  const filename = `temp_${Date.now()}.rb`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`ruby ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// PHP execution
async function executePHP(code, input) {
  const filename = `temp_${Date.now()}.php`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`php ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Swift execution
async function executeSwift(code, input) {
  const filename = `temp_${Date.now()}.swift`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`swift ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Kotlin execution
async function executeKotlin(code, input) {
  const filename = `temp_${Date.now()}.kt`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`kotlinc ${filepath} -include-runtime -d ${TEMP_DIR}/temp.jar && java -jar ${TEMP_DIR}/temp.jar`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Scala execution
async function executeScala(code, input) {
  const filename = `temp_${Date.now()}.scala`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`scala ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// R execution
async function executeR(code, input) {
  const filename = `temp_${Date.now()}.R`;
  const filepath = path.join(TEMP_DIR, filename);
  
  try {
    await fs.writeFile(filepath, code);
    
    const { stdout, stderr } = await execAsync(`Rscript ${filepath}`, {
      timeout: 5000,
      env: { ...process.env, INPUT: input }
    });

    await fs.unlink(filepath);
    
    return {
      output: stdout.trim() || stderr.trim(),
      runtime: 0,
      status: stderr ? 'error' : 'success',
      error: stderr || null
    };
  } catch (error) {
    try { await fs.unlink(filepath); } catch {}
    return {
      output: '',
      runtime: 0,
      status: 'error',
      error: error.message
    };
  }
}

// Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { id: 'javascript', name: 'JavaScript', extension: 'js', available: true },
      { id: 'typescript', name: 'TypeScript', extension: 'ts', available: true },
      { id: 'python', name: 'Python', extension: 'py', available: true },
      { id: 'java', name: 'Java', extension: 'java', available: true },
      { id: 'cpp', name: 'C++', extension: 'cpp', available: true },
      { id: 'c', name: 'C', extension: 'c', available: true },
      { id: 'csharp', name: 'C#', extension: 'cs', available: true },
      { id: 'go', name: 'Go', extension: 'go', available: true },
      { id: 'rust', name: 'Rust', extension: 'rs', available: true },
      { id: 'ruby', name: 'Ruby', extension: 'rb', available: true },
      { id: 'php', name: 'PHP', extension: 'php', available: true },
      { id: 'swift', name: 'Swift', extension: 'swift', available: true },
      { id: 'kotlin', name: 'Kotlin', extension: 'kt', available: true },
      { id: 'scala', name: 'Scala', extension: 'scala', available: true },
      { id: 'r', name: 'R', extension: 'R', available: true }
    ]
  });
});

module.exports = router;
             
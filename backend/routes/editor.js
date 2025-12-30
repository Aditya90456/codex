const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (use database in production)
let workspaces = [];
let files = [];
let executions = [];

// Language configurations and templates
const languageConfigs = {
  javascript: {
    name: 'JavaScript',
    extensions: ['.js', '.jsx', '.mjs'],
    executable: true,
    compiler: null,
    runner: 'node',
    template: (name) => `// ${name} - JavaScript Project
console.log("Welcome to ${name}!");

// Modern JavaScript features
const data = [1, 2, 3, 4, 5];
const doubled = data.map(x => x * 2);
const sum = data.reduce((a, b) => a + b, 0);

console.log('Data:', data);
console.log('Doubled:', doubled);
console.log('Sum:', sum);

// Async/await example
async function fetchData() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Data loaded!'), 1000);
    });
}

fetchData().then(console.log);`
  },
  
  python: {
    name: 'Python',
    extensions: ['.py', '.pyw'],
    executable: true,
    compiler: null,
    runner: 'python3',
    template: (name) => `# ${name} - Python Project
print(f"Welcome to ${name}!")

# Modern Python features
import asyncio
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class Project:
    name: str
    language: str
    created_at: str

# List comprehensions and functional programming
data = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in data]
sum_data = sum(data)

print(f'Data: {data}')
print(f'Doubled: {doubled}')
print(f'Sum: {sum_data}')

# Class example
class Calculator:
    def __init__(self, name):
        self.name = name
    
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

calc = Calculator('${name} Calculator')
print(f'{calc.name}: 5 + 3 = {calc.add(5, 3)}')

# Async example
async def fetch_data():
    await asyncio.sleep(0.1)
    return "Data loaded!"

if __name__ == "__main__":
    print("Project initialized successfully!")`
  },
  
  java: {
    name: 'Java',
    extensions: ['.java'],
    executable: true,
    compiler: 'javac',
    runner: 'java',
    template: (name) => `// ${name} - Java Project
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ${name}!");
        
        // Modern Java features (Java 8+)
        List<Integer> data = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> doubled = data.stream()
            .map(x -> x * 2)
            .collect(Collectors.toList());
        
        int sum = data.stream()
            .mapToInt(Integer::intValue)
            .sum();
        
        System.out.println("Data: " + data);
        System.out.println("Doubled: " + doubled);
        System.out.println("Sum: " + sum);
        
        // Object-oriented programming
        Calculator calc = new Calculator("${name} Calculator");
        System.out.println(calc.getName() + ": 5 + 3 = " + calc.add(5, 3));
        
        // CompletableFuture example
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return "Data loaded!";
        });
        
        future.thenAccept(System.out::println);
        
        System.out.println("Project initialized successfully!");
    }
}

class Calculator {
    private String name;
    
    public Calculator(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    public int add(int a, int b) { return a + b; }
    public int multiply(int a, int b) { return a * b; }
}`
  },
  
  cpp: {
    name: 'C++',
    extensions: ['.cpp', '.cc', '.cxx', '.c++'],
    executable: true,
    compiler: 'g++',
    runner: './main',
    template: (name) => `// ${name} - C++ Project
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <future>
#include <chrono>

class Calculator {
private:
    std::string name;
    
public:
    Calculator(const std::string& name) : name(name) {}
    
    std::string getName() const { return name; }
    int add(int a, int b) const { return a + b; }
    int multiply(int a, int b) const { return a * b; }
};

int main() {
    std::cout << "Welcome to ${name}!" << std::endl;
    
    // Modern C++ features (C++11+)
    std::vector<int> data = {1, 2, 3, 4, 5};
    std::vector<int> doubled;
    
    // STL algorithms
    std::transform(data.begin(), data.end(), 
                  std::back_inserter(doubled), 
                  [](int x) { return x * 2; });
    
    int sum = std::accumulate(data.begin(), data.end(), 0);
    
    std::cout << "Data: ";
    for (const auto& x : data) std::cout << x << " ";
    std::cout << std::endl;
    
    std::cout << "Doubled: ";
    for (const auto& x : doubled) std::cout << x << " ";
    std::cout << std::endl;
    
    std::cout << "Sum: " << sum << std::endl;
    
    // Smart pointers and RAII
    auto calc = std::make_unique<Calculator>("${name} Calculator");
    std::cout << calc->getName() << ": 5 + 3 = " << calc->add(5, 3) << std::endl;
    
    // Async example
    auto future = std::async(std::launch::async, []() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        return std::string("Data loaded!");
    });
    
    std::cout << future.get() << std::endl;
    std::cout << "Project initialized successfully!" << std::endl;
    
    return 0;
}`
  },
  
  csharp: {
    name: 'C#',
    extensions: ['.cs'],
    executable: true,
    compiler: 'csc',
    runner: 'dotnet run',
    template: (name) => `// ${name} - C# Project
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ${name.replace(/\s+/g, '')}
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Welcome to ${name}!");
            
            // Modern C# features
            var data = new List<int> { 1, 2, 3, 4, 5 };
            var doubled = data.Select(x => x * 2).ToList();
            var sum = data.Sum();
            
            Console.WriteLine($"Data: [{string.Join(", ", data)}]");
            Console.WriteLine($"Doubled: [{string.Join(", ", doubled)}]");
            Console.WriteLine($"Sum: {sum}");
            
            // Object-oriented programming
            var calc = new Calculator("${name} Calculator");
            Console.WriteLine($"{calc.Name}: 5 + 3 = {calc.Add(5, 3)}");
            
            // Async/await
            var result = await FetchDataAsync();
            Console.WriteLine(result);
            
            Console.WriteLine("Project initialized successfully!");
        }
        
        static async Task<string> FetchDataAsync()
        {
            await Task.Delay(100);
            return "Data loaded!";
        }
    }
    
    public class Calculator
    {
        public string Name { get; }
        
        public Calculator(string name) => Name = name;
        
        public int Add(int a, int b) => a + b;
        public int Multiply(int a, int b) => a * b;
    }
}`
  },
  
  go: {
    name: 'Go',
    extensions: ['.go'],
    executable: true,
    compiler: null,
    runner: 'go run',
    template: (name) => `// ${name} - Go Project
package main

import (
    "fmt"
    "time"
    "sync"
)

type Calculator struct {
    Name string
}

func NewCalculator(name string) *Calculator {
    return &Calculator{Name: name}
}

func (c *Calculator) Add(a, b int) int {
    return a + b
}

func (c *Calculator) Multiply(a, b int) int {
    return a * b
}

func main() {
    fmt.Println("Welcome to ${name}!")
    
    // Slices and range
    data := []int{1, 2, 3, 4, 5}
    var doubled []int
    sum := 0
    
    for _, x := range data {
        doubled = append(doubled, x*2)
        sum += x
    }
    
    fmt.Printf("Data: %v\\n", data)
    fmt.Printf("Doubled: %v\\n", doubled)
    fmt.Printf("Sum: %d\\n", sum)
    
    // Struct and methods
    calc := NewCalculator("${name} Calculator")
    fmt.Printf("%s: 5 + 3 = %d\\n", calc.Name, calc.Add(5, 3))
    
    // Goroutines and channels
    ch := make(chan string, 1)
    var wg sync.WaitGroup
    
    wg.Add(1)
    go func() {
        defer wg.Done()
        time.Sleep(100 * time.Millisecond)
        ch <- "Data loaded!"
    }()
    
    wg.Wait()
    close(ch)
    
    for msg := range ch {
        fmt.Println(msg)
    }
    
    fmt.Println("Project initialized successfully!")
}`
  },
  
  rust: {
    name: 'Rust',
    extensions: ['.rs'],
    executable: true,
    compiler: 'rustc',
    runner: './main',
    template: (name) => `// ${name} - Rust Project
use std::collections::HashMap;

#[derive(Debug)]
struct Calculator {
    name: String,
}

impl Calculator {
    fn new(name: String) -> Self {
        Calculator { name }
    }
    
    fn add(&self, a: i32, b: i32) -> i32 {
        a + b
    }
    
    fn multiply(&self, a: i32, b: i32) -> i32 {
        a * b
    }
}

fn main() {
    println!("Welcome to ${name}!");
    
    // Vectors and iterators
    let data = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = data.iter().map(|x| x * 2).collect();
    let sum: i32 = data.iter().sum();
    
    println!("Data: {:?}", data);
    println!("Doubled: {:?}", doubled);
    println!("Sum: {}", sum);
    
    // Ownership and borrowing
    let calc = Calculator::new("${name} Calculator".to_string());
    println!("{}: 5 + 3 = {}", calc.name, calc.add(5, 3));
    
    // HashMap example
    let mut projects = HashMap::new();
    projects.insert("name", "${name}");
    projects.insert("language", "Rust");
    
    if let Some(project_name) = projects.get("name") {
        println!("Project: {}", project_name);
    }
    
    println!("Project initialized successfully!");
}`
  },
  
  typescript: {
    name: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    executable: true,
    compiler: 'tsc',
    runner: 'node',
    template: (name) => `// ${name} - TypeScript Project
interface ProjectConfig {
    name: string;
    language: string;
    version: string;
}

interface Calculator {
    name: string;
    add(a: number, b: number): number;
    multiply(a: number, b: number): number;
}

class BasicCalculator implements Calculator {
    constructor(public name: string) {}
    
    add(a: number, b: number): number {
        return a + b;
    }
    
    multiply(a: number, b: number): number {
        return a * b;
    }
}

// Generic function
function processArray<T>(arr: T[], processor: (item: T) => T): T[] {
    return arr.map(processor);
}

async function main(): Promise<void> {
    console.log("Welcome to ${name}!");
    
    // Type-safe arrays and operations
    const data: number[] = [1, 2, 3, 4, 5];
    const doubled = processArray(data, x => x * 2);
    const sum = data.reduce((a, b) => a + b, 0);
    
    console.log('Data:', data);
    console.log('Doubled:', doubled);
    console.log('Sum:', sum);
    
    // Object with interface
    const config: ProjectConfig = {
        name: '${name}',
        language: 'TypeScript',
        version: '1.0.0'
    };
    
    console.log('Config:', config);
    
    // Class usage
    const calc = new BasicCalculator('${name} Calculator');
    console.log(\`\${calc.name}: 5 + 3 = \${calc.add(5, 3)}\`);
    
    // Async/await
    const result = await fetchData();
    console.log('Async result:', result);
    
    console.log('Project initialized successfully!');
}

async function fetchData(): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => resolve('Data loaded!'), 100);
    });
}

main().catch(console.error);`
  }
};

// Workspace Management Routes

// Get all workspaces for user
router.get('/workspaces', auth, async (req, res) => {
  try {
    const userWorkspaces = workspaces.filter(w => w.userId === req.user.id);
    res.json({
      success: true,
      workspaces: userWorkspaces
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new workspace
router.post('/workspaces', auth, async (req, res) => {
  try {
    const { name, language, template } = req.body;
    
    if (!name || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and language are required' 
      });
    }
    
    const config = languageConfigs[language];
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Unsupported language' 
      });
    }
    
    const workspace = {
      id: uuidv4(),
      name,
      language,
      template: template || 'basic',
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      settings: {
        theme: 'dark',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        autoSave: true
      }
    };
    
    // Create main file
    const mainFile = {
      id: uuidv4(),
      workspaceId: workspace.id,
      name: `main${config.extensions[0]}`,
      path: `main${config.extensions[0]}`,
      content: config.template(name),
      language: language,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    workspaces.push(workspace);
    files.push(mainFile);
    
    res.status(201).json({
      success: true,
      workspace,
      mainFile
    });
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get workspace details
router.get('/workspaces/:id', auth, async (req, res) => {
  try {
    const workspace = workspaces.find(w => 
      w.id === req.params.id && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        message: 'Workspace not found' 
      });
    }
    
    const workspaceFiles = files.filter(f => f.workspaceId === workspace.id);
    
    res.json({
      success: true,
      workspace,
      files: workspaceFiles
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update workspace
router.put('/workspaces/:id', auth, async (req, res) => {
  try {
    const workspaceIndex = workspaces.findIndex(w => 
      w.id === req.params.id && w.userId === req.user.id
    );
    
    if (workspaceIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Workspace not found' 
      });
    }
    
    const { name, settings } = req.body;
    
    workspaces[workspaceIndex] = {
      ...workspaces[workspaceIndex],
      name: name || workspaces[workspaceIndex].name,
      settings: { ...workspaces[workspaceIndex].settings, ...settings },
      lastModified: new Date().toISOString()
    };
    
    res.json({
      success: true,
      workspace: workspaces[workspaceIndex]
    });
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete workspace
router.delete('/workspaces/:id', auth, async (req, res) => {
  try {
    const workspaceIndex = workspaces.findIndex(w => 
      w.id === req.params.id && w.userId === req.user.id
    );
    
    if (workspaceIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Workspace not found' 
      });
    }
    
    // Remove workspace and associated files
    const workspaceId = workspaces[workspaceIndex].id;
    workspaces.splice(workspaceIndex, 1);
    files = files.filter(f => f.workspaceId !== workspaceId);
    
    res.json({
      success: true,
      message: 'Workspace deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// File Management Routes

// Get files in workspace
router.get('/workspaces/:id/files', auth, async (req, res) => {
  try {
    const workspace = workspaces.find(w => 
      w.id === req.params.id && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        message: 'Workspace not found' 
      });
    }
    
    const workspaceFiles = files.filter(f => f.workspaceId === workspace.id);
    
    res.json({
      success: true,
      files: workspaceFiles
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new file
router.post('/workspaces/:id/files', auth, async (req, res) => {
  try {
    const { name, content = '', language } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'File name is required' 
      });
    }
    
    const workspace = workspaces.find(w => 
      w.id === req.params.id && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        message: 'Workspace not found' 
      });
    }
    
    // Check if file already exists
    const existingFile = files.find(f => 
      f.workspaceId === workspace.id && f.name === name
    );
    
    if (existingFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'File already exists' 
      });
    }
    
    const file = {
      id: uuidv4(),
      workspaceId: workspace.id,
      name,
      path: name,
      content,
      language: language || detectLanguageFromExtension(name),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    files.push(file);
    
    res.status(201).json({
      success: true,
      file
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get file content
router.get('/files/:id', auth, async (req, res) => {
  try {
    const file = files.find(f => f.id === req.params.id);
    
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    // Check if user owns the workspace
    const workspace = workspaces.find(w => 
      w.id === file.workspaceId && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    res.json({
      success: true,
      file
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update file content
router.put('/files/:id', auth, async (req, res) => {
  try {
    const { content, name } = req.body;
    
    const fileIndex = files.findIndex(f => f.id === req.params.id);
    
    if (fileIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    // Check if user owns the workspace
    const workspace = workspaces.find(w => 
      w.id === files[fileIndex].workspaceId && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    files[fileIndex] = {
      ...files[fileIndex],
      content: content !== undefined ? content : files[fileIndex].content,
      name: name || files[fileIndex].name,
      language: name ? detectLanguageFromExtension(name) : files[fileIndex].language,
      lastModified: new Date().toISOString()
    };
    
    res.json({
      success: true,
      file: files[fileIndex]
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete file
router.delete('/files/:id', auth, async (req, res) => {
  try {
    const fileIndex = files.findIndex(f => f.id === req.params.id);
    
    if (fileIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    // Check if user owns the workspace
    const workspace = workspaces.find(w => 
      w.id === files[fileIndex].workspaceId && w.userId === req.user.id
    );
    
    if (!workspace) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    files.splice(fileIndex, 1);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Code Execution Routes

// Execute code
router.post('/execute', auth, async (req, res) => {
  try {
    const { fileId, language, code, input = '' } = req.body;
    
    if (!code && !fileId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code or file ID is required' 
      });
    }
    
    let sourceCode = code;
    let execLanguage = language;
    
    // If fileId provided, get code from file
    if (fileId) {
      const file = files.find(f => f.id === fileId);
      if (!file) {
        return res.status(404).json({ 
          success: false, 
          message: 'File not found' 
        });
      }
      
      // Check workspace ownership
      const workspace = workspaces.find(w => 
        w.id === file.workspaceId && w.userId === req.user.id
      );
      
      if (!workspace) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied' 
        });
      }
      
      sourceCode = file.content;
      execLanguage = file.language;
    }
    
    const execution = {
      id: uuidv4(),
      userId: req.user.id,
      fileId: fileId || null,
      language: execLanguage,
      code: sourceCode,
      input,
      status: 'running',
      startTime: new Date().toISOString(),
      output: '',
      error: '',
      executionTime: 0
    };
    
    executions.push(execution);
    
    // Simulate code execution (in production, use Docker containers)
    const result = await simulateExecution(execLanguage, sourceCode, input);
    
    // Update execution record
    const execIndex = executions.findIndex(e => e.id === execution.id);
    if (execIndex !== -1) {
      executions[execIndex] = {
        ...executions[execIndex],
        ...result,
        endTime: new Date().toISOString(),
        executionTime: Date.now() - new Date(execution.startTime).getTime()
      };
    }
    
    res.json({
      success: true,
      execution: executions[execIndex]
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get execution history
router.get('/executions', auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const userExecutions = executions
      .filter(e => e.userId === req.user.id)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      executions: userExecutions,
      total: executions.filter(e => e.userId === req.user.id).length
    });
  } catch (error) {
    console.error('Error fetching executions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Language and Template Routes

// Get supported languages
router.get('/languages', (req, res) => {
  try {
    const languages = Object.entries(languageConfigs).map(([id, config]) => ({
      id,
      name: config.name,
      extensions: config.extensions,
      executable: config.executable,
      hasCompiler: !!config.compiler,
      runner: config.runner
    }));
    
    res.json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get language template
router.get('/languages/:id/template', (req, res) => {
  try {
    const config = languageConfigs[req.params.id];
    
    if (!config) {
      return res.status(404).json({ 
        success: false, 
        message: 'Language not supported' 
      });
    }
    
    const { name = 'MyProject' } = req.query;
    
    res.json({
      success: true,
      template: config.template(name),
      language: config.name,
      extensions: config.extensions
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Utility Functions

function detectLanguageFromExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  for (const [langId, config] of Object.entries(languageConfigs)) {
    if (config.extensions.includes(ext)) {
      return langId;
    }
  }
  
  return 'plaintext';
}

async function simulateExecution(language, code, input) {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  try {
    if (language === 'javascript') {
      // Simple JavaScript execution simulation
      const outputs = [];
      const originalLog = console.log;
      
      console.log = (...args) => {
        outputs.push(args.join(' '));
        originalLog(...args);
      };
      
      // Execute in isolated context (simplified)
      const func = new Function('input', code + '\nreturn typeof result !== "undefined" ? result : undefined;');
      const result = func(input);
      
      console.log = originalLog;
      
      return {
        status: 'completed',
        output: outputs.join('\n') + (result !== undefined ? `\nResult: ${result}` : ''),
        error: '',
        exitCode: 0
      };
    } else {
      // For other languages, return mock execution info
      return {
        status: 'completed',
        output: `Mock execution for ${language}\nCode compiled and executed successfully.\nInput: ${input}\nOutput: Hello from ${language}!`,
        error: '',
        exitCode: 0
      };
    }
  } catch (error) {
    return {
      status: 'error',
      output: '',
      error: error.message,
      exitCode: 1
    };
  }
}

module.exports = router;
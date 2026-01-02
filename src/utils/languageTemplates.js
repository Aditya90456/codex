// Simple Hello World templates for all programming languages

export const languageConfigs = {
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    extension: '.js',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - JavaScript
console.log("Hello, World!");
console.log("Welcome to JavaScript programming!");

// Variables and basic operations
const message = "JavaScript is awesome!";
const year = 2025;
console.log(\`Message: \${message}\`);
console.log(\`Year: \${year}\`);`
  },
  
  python: {
    name: 'Python',
    icon: '🐍',
    extension: '.py',
    executable: true,
    template: (projectName = 'Hello World') => `# ${projectName} - Python
print("Hello, World!")
print("Welcome to Python programming!")

# Variables and basic operations
message = "Python is awesome!"
year = 2025
print(f"Message: {message}")
print(f"Year: {year}")`
  },
  
  java: {
    name: 'Java',
    icon: '☕',
    extension: '.java',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to Java programming!");
        
        // Variables and basic operations
        String message = "Java is awesome!";
        int year = 2025;
        System.out.println("Message: " + message);
        System.out.println("Year: " + year);
    }
}`
  },
  
  cpp: {
    name: 'C++',
    icon: '⚡',
    extension: '.cpp',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - C++
#include <iostream>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << "Welcome to C++ programming!" << std::endl;
    
    // Variables and basic operations
    std::string message = "C++ is awesome!";
    int year = 2025;
    std::cout << "Message: " << message << std::endl;
    std::cout << "Year: " << year << std::endl;
    
    return 0;
}`
  },

  c: {
    name: 'C',
    icon: '🔧',
    extension: '.c',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - C
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to C programming!\\n");
    
    // Variables and basic operations
    char message[] = "C is awesome!";
    int year = 2025;
    printf("Message: %s\\n", message);
    printf("Year: %d\\n", year);
    
    return 0;
}`
  },

  csharp: {
    name: 'C#',
    icon: '💜',
    extension: '.cs',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - C#
using System;

class HelloWorld 
{
    static void Main() 
    {
        Console.WriteLine("Hello, World!");
        Console.WriteLine("Welcome to C# programming!");
        
        // Variables and basic operations
        string message = "C# is awesome!";
        int year = 2025;
        Console.WriteLine($"Message: {message}");
        Console.WriteLine($"Year: {year}");
    }
}`
  },

  go: {
    name: 'Go',
    icon: '🐹',
    extension: '.go',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - Go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Welcome to Go programming!")
    
    // Variables and basic operations
    message := "Go is awesome!"
    year := 2025
    fmt.Printf("Message: %s\\n", message)
    fmt.Printf("Year: %d\\n", year)
}`
  },

  rust: {
    name: 'Rust',
    icon: '🦀',
    extension: '.rs',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - Rust
fn main() {
    println!("Hello, World!");
    println!("Welcome to Rust programming!");
    
    // Variables and basic operations
    let message = "Rust is awesome!";
    let year = 2025;
    println!("Message: {}", message);
    println!("Year: {}", year);
}`
  },

  php: {
    name: 'PHP',
    icon: '🐘',
    extension: '.php',
    executable: true,
    template: (projectName = 'Hello World') => `<?php
// ${projectName} - PHP
echo "Hello, World!\\n";
echo "Welcome to PHP programming!\\n";

// Variables and basic operations
$message = "PHP is awesome!";
$year = 2025;
echo "Message: " . $message . "\\n";
echo "Year: " . $year . "\\n";
?>`
  },

  ruby: {
    name: 'Ruby',
    icon: '💎',
    extension: '.rb',
    executable: true,
    template: (projectName = 'Hello World') => `# ${projectName} - Ruby
puts "Hello, World!"
puts "Welcome to Ruby programming!"

# Variables and basic operations
message = "Ruby is awesome!"
year = 2025
puts "Message: #{message}"
puts "Year: #{year}"`
  },

  swift: {
    name: 'Swift',
    icon: '🦉',
    extension: '.swift',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - Swift
print("Hello, World!")
print("Welcome to Swift programming!")

// Variables and basic operations
let message = "Swift is awesome!"
let year = 2025
print("Message: \\(message)")
print("Year: \\(year)")`
  },

  kotlin: {
    name: 'Kotlin',
    icon: '🟣',
    extension: '.kt',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - Kotlin
fun main() {
    println("Hello, World!")
    println("Welcome to Kotlin programming!")
    
    // Variables and basic operations
    val message = "Kotlin is awesome!"
    val year = 2025
    println("Message: $message")
    println("Year: $year")
}`
  },

  typescript: {
    name: 'TypeScript',
    icon: '🔷',
    extension: '.ts',
    executable: true,
    template: (projectName = 'Hello World') => `// ${projectName} - TypeScript
console.log("Hello, World!");
console.log("Welcome to TypeScript programming!");

// Variables with types
const message: string = "TypeScript is awesome!";
const year: number = 2025;
console.log(\`Message: \${message}\`);
console.log(\`Year: \${year}\`);

// Function with types
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("TypeScript"));`
  }
};

// Generate project templates from language configs
export function generateProjectTemplates() {
  return Object.entries(languageConfigs).map(([id, config]) => ({
    id,
    name: `${config.name} Project`,
    description: `Create a new ${config.name} project with Hello World template`,
    icon: config.icon,
    language: id,
    files: {
      [`main${config.extension}`]: {
        type: 'file',
        content: config.template()
      }
    }
  }));
}

// Get language by file extension
export function getLanguageByExtension(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  for (const [id, config] of Object.entries(languageConfigs)) {
    if (config.extension === `.${ext}`) {
      return id;
    }
  }
  
  return 'plaintext';
}

// Get all supported languages
export function getSupportedLanguages() {
  return Object.entries(languageConfigs).map(([id, config]) => ({
    id,
    name: config.name,
    icon: config.icon,
    extension: config.extension,
    executable: config.executable
  }));
}
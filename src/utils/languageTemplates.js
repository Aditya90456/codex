// Dynamic language templates for VS Code Editor
// Generates content for every programming language

export const languageConfigs = {
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    extension: '.js',
    executable: true,
    template: (projectName = 'MyProject') => `// ${projectName} - JavaScript Project
// Modern JavaScript with ES6+ features

console.log("Welcome to ${projectName}!");

// Example: Array methods and modern syntax
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

console.log('Original numbers:', numbers);
console.log('Doubled:', doubled);
console.log('Even numbers:', evens);

// Example: Async/await
async function fetchData() {
    console.log('Fetching data...');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ message: 'Data loaded successfully!', timestamp: new Date() });
        }, 1000);
    });
}

// Example: Classes and objects
class Calculator {
    constructor(name) {
        this.name = name;
    }
    
    add(a, b) {
        return a + b;
    }
    
    multiply(a, b) {
        return a * b;
    }
}

const calc = new Calculator('${projectName} Calculator');
console.log(\`\${calc.name}: 5 + 3 = \${calc.add(5, 3)}\`);

// Run async function
fetchData().then(data => console.log(data));`
  },
  
  python: {
    name: 'Python',
    icon: '🐍',
    extension: '.py',
    executable: false,
    template: (projectName = 'MyProject') => `# ${projectName} - Python Project
# Modern Python with best practices

import datetime
import json
from typing import List, Dict, Optional

def main():
    """Main function for ${projectName}"""
    print(f"Welcome to ${projectName}!")
    
    # Example: List comprehensions and modern Python
    numbers = [1, 2, 3, 4, 5]
    doubled = [n * 2 for n in numbers]
    evens = [n for n in numbers if n % 2 == 0]
    
    print(f"Original numbers: {numbers}")
    print(f"Doubled: {doubled}")
    print(f"Even numbers: {evens}")
    
    # Example: Dictionary operations
    data = {
        'project': '${projectName}',
        'language': 'Python',
        'created': datetime.datetime.now().isoformat(),
        'features': ['OOP', 'Functional', 'Dynamic']
    }
    
    print(f"Project data: {json.dumps(data, indent=2)}")
    
    # Example: Class definition
    calc = Calculator('${projectName} Calculator')
    print(f"{calc.name}: 5 + 3 = {calc.add(5, 3)}")

class Calculator:
    """A simple calculator class"""
    
    def __init__(self, name: str):
        self.name = name
    
    def add(self, a: float, b: float) -> float:
        return a + b
    
    def multiply(self, a: float, b: float) -> float:
        return a * b

if __name__ == "__main__":
    main()`
  },
  
  java: {
    name: 'Java',
    icon: '☕',
    extension: '.java',
    executable: false,
    template: (projectName = 'MyProject') => `// ${projectName} - Java Project
// Modern Java with best practices

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ${projectName}!");
        
        // Example: Collections and Streams
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> doubled = numbers.stream()
            .map(n -> n * 2)
            .collect(Collectors.toList());
        
        List<Integer> evens = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
        
        System.out.println("Original: " + numbers);
        System.out.println("Doubled: " + doubled);
        System.out.println("Evens: " + evens);
        
        // Example: Object-oriented programming
        Calculator calc = new Calculator("${projectName} Calculator");
        System.out.println(calc.getName() + ": 5 + 3 = " + calc.add(5, 3));
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
    icon: '⚡',
    extension: '.cpp',
    executable: false,
    template: (projectName = 'MyProject') => `// ${projectName} - C++ Project
// Modern C++ with best practices

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>

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
    std::cout << "Welcome to ${projectName}!" << std::endl;
    
    // Example: STL containers and algorithms
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::vector<int> doubled;
    std::vector<int> evens;
    
    // Transform (double each number)
    std::transform(numbers.begin(), numbers.end(), 
                  std::back_inserter(doubled), 
                  [](int n) { return n * 2; });
    
    // Filter (even numbers only)
    std::copy_if(numbers.begin(), numbers.end(),
                std::back_inserter(evens),
                [](int n) { return n % 2 == 0; });
    
    std::cout << "Original: ";
    for (const auto& n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    std::cout << "Doubled: ";
    for (const auto& n : doubled) std::cout << n << " ";
    std::cout << std::endl;
    
    // Example: Smart pointers and RAII
    auto calc = std::make_unique<Calculator>("${projectName} Calculator");
    std::cout << calc->getName() << ": 5 + 3 = " << calc->add(5, 3) << std::endl;
    
    return 0;
}`
  }
};

// Generate project templates from language configs
export function generateProjectTemplates() {
  return Object.entries(languageConfigs).map(([id, config]) => ({
    id,
    name: `${config.name} Project`,
    description: `Create a new ${config.name} project with modern best practices`,
    icon: config.icon,
    language: id,
    files: {
      [`main${config.extension}`]: {
        type: 'file',
        content: config.template()
      },
      'README.md': {
        type: 'file',
        content: generateReadme(config.name, id)
      }
    }
  }));
}

function generateReadme(languageName, languageId) {
  return `# ${languageName} Project

A modern ${languageName} project with best practices and examples.

## Features

- Modern ${languageName} syntax and features
- Example algorithms and data structures
- Best practices and coding standards
- Ready-to-run code examples

## Getting Started

1. Open the main${languageConfigs[languageId].extension} file
2. Run the code using your preferred ${languageName} environment
3. Modify and experiment with the examples

## Examples Included

- Basic syntax and data types
- Object-oriented programming
- Modern language features
- Algorithm implementations

Happy coding with ${languageName}! 🚀
`;
}
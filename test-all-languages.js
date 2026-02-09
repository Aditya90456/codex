const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/execute';

// Test code samples for each language
const testCases = {
  javascript: {
    code: `console.log("Hello from JavaScript!");
const sum = (a, b) => a + b;
console.log("2 + 3 =", sum(2, 3));`,
    expected: 'Hello from JavaScript'
  },
  
  typescript: {
    code: `console.log("Hello from TypeScript!");
const multiply = (a: number, b: number): number => a * b;
console.log("4 * 5 =", multiply(4, 5));`,
    expected: 'Hello from TypeScript'
  },
  
  python: {
    code: `print("Hello from Python!")
def add(a, b):
    return a + b
print("10 + 20 =", add(10, 20))`,
    expected: 'Hello from Python'
  },
  
  java: {
    code: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("5 + 7 = " + add(5, 7));
    }
    
    public static int add(int a, int b) {
        return a + b;
    }
}`,
    expected: 'Hello from Java'
  },
  
  cpp: {
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    int sum = 15 + 25;
    cout << "15 + 25 = " << sum << endl;
    return 0;
}`,
    expected: 'Hello from C++'
  },
  
  c: {
    code: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    int sum = 8 + 12;
    printf("8 + 12 = %d\\n", sum);
    return 0;
}`,
    expected: 'Hello from C'
  },
  
  csharp: {
    code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        Console.WriteLine("6 + 9 = " + Add(6, 9));
    }
    
    static int Add(int a, int b) {
        return a + b;
    }
}`,
    expected: 'Hello from C#'
  },
  
  go: {
    code: `package main
import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    sum := 11 + 14
    fmt.Printf("11 + 14 = %d\\n", sum)
}`,
    expected: 'Hello from Go'
  },
  
  rust: {
    code: `fn main() {
    println!("Hello from Rust!");
    let sum = 7 + 8;
    println!("7 + 8 = {}", sum);
}`,
    expected: 'Hello from Rust'
  },
  
  ruby: {
    code: `puts "Hello from Ruby!"
def add(a, b)
  a + b
end
puts "3 + 4 = #{add(3, 4)}"`,
    expected: 'Hello from Ruby'
  },
  
  php: {
    code: `<?php
echo "Hello from PHP!\\n";
function add($a, $b) {
    return $a + $b;
}
echo "9 + 11 = " . add(9, 11) . "\\n";
?>`,
    expected: 'Hello from PHP'
  },
  
  swift: {
    code: `print("Hello from Swift!")
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}
print("5 + 6 = \\(add(5, 6))")`,
    expected: 'Hello from Swift'
  },
  
  kotlin: {
    code: `fun main() {
    println("Hello from Kotlin!")
    val sum = add(12, 13)
    println("12 + 13 = $sum")
}

fun add(a: Int, b: Int): Int {
    return a + b
}`,
    expected: 'Hello from Kotlin'
  },
  
  scala: {
    code: `object Main extends App {
    println("Hello from Scala!")
    def add(a: Int, b: Int): Int = a + b
    println(s"14 + 16 = ${add(14, 16)}")
}`,
    expected: 'Hello from Scala'
  },
  
  r: {
    code: `cat("Hello from R!\\n")
add <- function(a, b) {
  return(a + b)
}
cat("17 + 19 =", add(17, 19), "\\n")`,
    expected: 'Hello from R'
  }
};

async function testLanguage(language, testCase) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing ${language.toUpperCase()}`);
  console.log('='.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCase.code,
        language: language,
        input: ''
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Status: SUCCESS');
      console.log(`⏱️  Runtime: ${result.runtime}ms`);
      console.log(`📤 Output:\n${result.output || '(no output)'}`);
      
      if (result.error) {
        console.log(`⚠️  Error: ${result.error}`);
        return { language, status: 'error', error: result.error };
      }
      
      if (result.output && result.output.includes(testCase.expected)) {
        console.log('✅ Output verification: PASSED');
        return { language, status: 'passed', runtime: result.runtime };
      } else {
        console.log('⚠️  Output verification: FAILED (output doesn\'t match expected)');
        return { language, status: 'warning', message: 'Output mismatch' };
      }
    } else {
      console.log('❌ Status: FAILED');
      console.log(`Error: ${result.error || 'Unknown error'}`);
      return { language, status: 'failed', error: result.error };
    }
  } catch (error) {
    console.log('❌ Status: NETWORK ERROR');
    console.log(`Error: ${error.message}`);
    return { language, status: 'network_error', error: error.message };
  }
}

async function testAllLanguages() {
  console.log('\n🚀 MULTI-LANGUAGE CODE EXECUTION TEST SUITE');
  console.log('Testing 15 programming languages...\n');
  
  const results = [];
  
  for (const [language, testCase] of Object.entries(testCases)) {
    const result = await testLanguage(language, testCase);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const errors = results.filter(r => r.status === 'error').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const networkErrors = results.filter(r => r.status === 'network_error').length;
  
  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`⚠️  Errors: ${errors}/${results.length}`);
  console.log(`⚠️  Warnings: ${warnings}/${results.length}`);
  console.log(`🌐 Network Errors: ${networkErrors}/${results.length}`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const icon = result.status === 'passed' ? '✅' : 
                 result.status === 'failed' ? '❌' : 
                 result.status === 'error' ? '⚠️' : 
                 result.status === 'warning' ? '⚠️' : '🌐';
    console.log(`${icon} ${result.language.padEnd(15)} - ${result.status.toUpperCase()}`);
    if (result.error) {
      console.log(`   └─ ${result.error.substring(0, 80)}...`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (passed === results.length) {
    console.log('🎉 ALL TESTS PASSED! All 15 languages are working perfectly!');
  } else if (networkErrors > 0) {
    console.log('⚠️  NETWORK ERROR: Make sure backend server is running on port 3001');
    console.log('   Run: cd backend && node server.js');
  } else {
    console.log(`⚠️  ${passed}/${results.length} languages working. Some languages may need compiler installation.`);
  }
  
  console.log('='.repeat(60) + '\n');
}

// Check if backend is running first
async function checkBackend() {
  try {
    const response = await fetch('http://localhost:3001/health');
    const result = await response.json();
    console.log('✅ Backend server is running');
    console.log(`   Version: ${result.version}`);
    console.log(`   Status: ${result.status}\n`);
    return true;
  } catch (error) {
    console.log('❌ Backend server is NOT running!');
    console.log('   Please start the backend server first:');
    console.log('   cd backend && node server.js\n');
    return false;
  }
}

// Run tests
(async () => {
  const backendRunning = await checkBackend();
  if (backendRunning) {
    await testAllLanguages();
  }
})();

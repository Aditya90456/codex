# 🚀 Quick Start: Multi-Language Code Execution

## 🎯 TL;DR
You can now write and run code in **15+ programming languages** directly in your browser!

---

## 🏃 Quick Start (3 Steps)

### Step 1: Start Backend
```bash
cd backend
node server.js
```

### Step 2: Start Frontend
```bash
npm run dev
```

### Step 3: Use Editor
1. Go to http://localhost:5173/codex-editor
2. Select language from dropdown
3. Write code
4. Click "Run Code" ▶️
5. See output in console panel

---

## 📝 Example Code for Each Language

### JavaScript 🟨
```javascript
console.log("Hello from JavaScript!");
const sum = (a, b) => a + b;
console.log("2 + 3 =", sum(2, 3));
```

### Python 🐍
```python
print("Hello from Python!")
def add(a, b):
    return a + b
print("10 + 20 =", add(10, 20))
```

### Java ☕
```java
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
```

### C++ ⚡
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}
```

### C 🔵
```c
#include <stdio.h>

int main() {
    printf("Hello from C!\n");
    return 0;
}
```

### C# 💜
```csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
    }
}
```

### Go 🔷
```go
package main
import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}
```

### Rust 🦀
```rust
fn main() {
    println!("Hello from Rust!");
}
```

### Ruby 💎
```ruby
puts "Hello from Ruby!"
```

### PHP 🐘
```php
<?php
echo "Hello from PHP!\n";
?>
```

### Swift 🍎
```swift
print("Hello from Swift!")
```

### Kotlin 🟣
```kotlin
fun main() {
    println("Hello from Kotlin!")
}
```

### Scala 🔴
```scala
object Main extends App {
    println("Hello from Scala!")
}
```

### R 📊
```r
cat("Hello from R!\n")
```

---

## 🧪 Test All Languages

### Windows
```bash
test-languages-quick.bat
```

### Mac/Linux
```bash
node test-all-languages.js
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Run Code |
| `Ctrl + S` | Save File |
| `Ctrl + K` | Command Palette |
| `Ctrl + C` | Copy Code |
| `Ctrl + `` | Toggle Console |
| `F11` | Fullscreen |
| `Esc` | Close Modals |

---

## 🎨 UI Features

- **Language Selector** - 15+ languages with icons
- **Monaco Editor** - VS Code-like editing experience
- **Live Console** - Real-time output display
- **Theme Switcher** - Dark, Light, High Contrast
- **File Management** - Save, Load, Export
- **Error Display** - Color-coded error messages
- **Execution Time** - Performance metrics

---

## ❓ Troubleshooting

### Backend Not Running
```
Error: Backend Error: fetch failed
Fix: cd backend && node server.js
```

### Language Not Working
```
Error: Compiler not found
Fix: Install required compiler
  - Python: python.org
  - Java: oracle.com/java
  - C++: Install MinGW or GCC
```

### Timeout Error
```
Error: Time Limit Exceeded
Fix: Optimize code or remove infinite loops
```

---

## 📚 More Info

- Full Documentation: `MULTI_LANGUAGE_COMPLETE.md`
- Integration Details: `INTEGRATION_SUMMARY.md`
- Test Suite: `test-all-languages.js`

---

## 🎉 That's It!

You're ready to code in 15+ languages! Happy coding! 🚀

**Need Help?** Check the documentation files or run the test suite.

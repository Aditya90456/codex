/**
 * Multi-Language Auto-Suggestions System
 * Provides intelligent code completions for all supported programming languages
 */

export class MultiLanguageAutoSuggestions {
  constructor() {
    this.languageConfigs = {
      javascript: this.getJavaScriptConfig(),
      typescript: this.getTypeScriptConfig(),
      python: this.getPythonConfig(),
      java: this.getJavaConfig(),
      cpp: this.getCppConfig(),
      c: this.getCConfig(),
      csharp: this.getCSharpConfig(),
      go: this.getGoConfig(),
      rust: this.getRustConfig(),
      php: this.getPhpConfig(),
      ruby: this.getRubyConfig(),
      swift: this.getSwiftConfig(),
      kotlin: this.getKotlinConfig(),
      html: this.getHtmlConfig(),
      css: this.getCssConfig(),
      sql: this.getSqlConfig(),
      bash: this.getBashConfig(),
      powershell: this.getPowerShellConfig()
    };
  }

  /**
   * Get suggestions for any language
   */
  getSuggestions(code, cursorPosition, language, maxSuggestions = 10) {
    const config = this.languageConfigs[language.toLowerCase()];
    if (!config) {
      return this.getGenericSuggestions(code, cursorPosition);
    }

    const beforeCursor = code.substring(0, cursorPosition);
    const afterCursor = code.substring(cursorPosition);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const previousLines = lines.slice(Math.max(0, lines.length - 5), lines.length - 1);
    
    const suggestions = [];

    // Language-specific patterns
    suggestions.push(...this.getPatternSuggestions(currentLine, config));
    suggestions.push(...this.getKeywordSuggestions(currentLine, config));
    suggestions.push(...this.getFunctionSuggestions(currentLine, config));
    suggestions.push(...this.getStructureSuggestions(currentLine, config));
    suggestions.push(...this.getImportSuggestions(currentLine, config));
    suggestions.push(...this.getCommentSuggestions(currentLine, config));
    suggestions.push(...this.getDataTypeSuggestions(currentLine, config));
    suggestions.push(...this.getAlgorithmSuggestions(currentLine, config, language));

    // Sort by confidence and return top suggestions
    return suggestions
      .filter(s => s.text && s.text.trim().length > 0)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  }

  // JavaScript Configuration
  getJavaScriptConfig() {
    return {
      keywords: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'import', 'export', 'default'],
      builtins: ['console', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'Math', 'JSON', 'Promise', 'setTimeout', 'setInterval', 'fetch'],
      patterns: {
        function: ['function name() {\n  \n}', '() => {\n  \n}', 'async function name() {\n  \n}'],
        class: ['class Name {\n  constructor() {\n    \n  }\n}'],
        loop: ['for (let i = 0; i < length; i++) {\n  \n}', 'for (const item of items) {\n  \n}', 'while (condition) {\n  \n}'],
        conditional: ['if (condition) {\n  \n}', 'if (condition) {\n  \n} else {\n  \n}'],
        trycatch: ['try {\n  \n} catch (error) {\n  \n}'],
        import: ['import { } from "";', 'import name from "";', 'const name = require("");']
      },
      methods: {
        array: ['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'map', 'filter', 'reduce', 'forEach', 'find', 'findIndex', 'includes', 'indexOf', 'join', 'sort', 'reverse'],
        string: ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'slice', 'substring', 'substr', 'toLowerCase', 'toUpperCase', 'trim', 'split', 'replace', 'match', 'search'],
        object: ['keys', 'values', 'entries', 'assign', 'create', 'defineProperty', 'hasOwnProperty']
      },
      fileExtensions: ['.js', '.jsx', '.mjs'],
      commentStyle: '//'
    };
  }

  // TypeScript Configuration
  getTypeScriptConfig() {
    const jsConfig = this.getJavaScriptConfig();
    return {
      ...jsConfig,
      keywords: [...jsConfig.keywords, 'interface', 'type', 'enum', 'namespace', 'declare', 'abstract', 'implements', 'extends', 'public', 'private', 'protected', 'readonly'],
      patterns: {
        ...jsConfig.patterns,
        interface: ['interface Name {\n  \n}'],
        type: ['type Name = '],
        enum: ['enum Name {\n  \n}'],
        generic: ['<T>'],
        typeAnnotation: [': string', ': number', ': boolean', ': any', ': void', ': Promise<T>']
      },
      fileExtensions: ['.ts', '.tsx'],
      types: ['string', 'number', 'boolean', 'any', 'void', 'null', 'undefined', 'object', 'Array', 'Promise', 'Date']
    };
  }

  // Python Configuration
  getPythonConfig() {
    return {
      keywords: ['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'],
      builtins: ['abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'],
      patterns: {
        function: ['def name():\n    pass', 'def name(self):\n    pass', 'def name(*args, **kwargs):\n    pass'],
        class: ['class Name:\n    def __init__(self):\n        pass', 'class Name(object):\n    def __init__(self):\n        pass'],
        loop: ['for i in range(n):\n    pass', 'for item in items:\n    pass', 'while condition:\n    pass'],
        conditional: ['if condition:\n    pass', 'if condition:\n    pass\nelse:\n    pass'],
        trycatch: ['try:\n    pass\nexcept Exception as e:\n    pass'],
        import: ['import module', 'from module import name', 'import module as alias']
      },
      methods: {
        list: ['append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse', 'copy'],
        dict: ['keys', 'values', 'items', 'get', 'pop', 'popitem', 'clear', 'update', 'copy', 'setdefault'],
        str: ['upper', 'lower', 'strip', 'lstrip', 'rstrip', 'split', 'join', 'replace', 'find', 'startswith', 'endswith', 'isdigit', 'isalpha', 'format']
      },
      fileExtensions: ['.py', '.pyw'],
      commentStyle: '#'
    };
  }

  // Java Configuration
  getJavaConfig() {
    return {
      keywords: ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'],
      builtins: ['System', 'String', 'Integer', 'Double', 'Boolean', 'Character', 'Long', 'Float', 'Short', 'Byte', 'Object', 'Class', 'Thread', 'Runnable', 'Exception', 'RuntimeException'],
      patterns: {
        class: ['public class Name {\n    \n}', 'public class Name extends Parent {\n    \n}'],
        method: ['public void methodName() {\n    \n}', 'public static void main(String[] args) {\n    \n}'],
        constructor: ['public Name() {\n    \n}'],
        loop: ['for (int i = 0; i < length; i++) {\n    \n}', 'for (Type item : items) {\n    \n}', 'while (condition) {\n    \n}'],
        conditional: ['if (condition) {\n    \n}', 'if (condition) {\n    \n} else {\n    \n}'],
        trycatch: ['try {\n    \n} catch (Exception e) {\n    \n}'],
        import: ['import java.util.*;', 'import java.io.*;']
      },
      methods: {
        string: ['length', 'charAt', 'substring', 'indexOf', 'lastIndexOf', 'toLowerCase', 'toUpperCase', 'trim', 'split', 'replace', 'contains', 'startsWith', 'endsWith'],
        arraylist: ['add', 'remove', 'get', 'set', 'size', 'isEmpty', 'clear', 'contains', 'indexOf', 'toArray']
      },
      fileExtensions: ['.java'],
      commentStyle: '//'
    };
  }

  // C++ Configuration
  getCppConfig() {
    return {
      keywords: ['alignas', 'alignof', 'and', 'and_eq', 'asm', 'atomic_cancel', 'atomic_commit', 'atomic_noexcept', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public', 'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'],
      builtins: ['std', 'cout', 'cin', 'endl', 'string', 'vector', 'map', 'set', 'unordered_map', 'unordered_set', 'queue', 'stack', 'priority_queue', 'deque', 'list', 'array'],
      patterns: {
        include: ['#include <iostream>', '#include <vector>', '#include <string>', '#include <algorithm>'],
        function: ['int functionName() {\n    \n}', 'void functionName() {\n    \n}', 'template<typename T>\nT functionName() {\n    \n}'],
        class: ['class Name {\npublic:\n    Name();\n    ~Name();\nprivate:\n    \n};'],
        loop: ['for (int i = 0; i < n; i++) {\n    \n}', 'for (auto& item : container) {\n    \n}', 'while (condition) {\n    \n}'],
        conditional: ['if (condition) {\n    \n}', 'if (condition) {\n    \n} else {\n    \n}'],
        trycatch: ['try {\n    \n} catch (const std::exception& e) {\n    \n}'],
        namespace: ['namespace Name {\n    \n}', 'using namespace std;']
      },
      methods: {
        vector: ['push_back', 'pop_back', 'size', 'empty', 'clear', 'begin', 'end', 'front', 'back', 'at', 'insert', 'erase'],
        string: ['length', 'size', 'empty', 'clear', 'substr', 'find', 'replace', 'append', 'insert', 'erase', 'c_str']
      },
      fileExtensions: ['.cpp', '.cc', '.cxx', '.c++', '.hpp', '.h'],
      commentStyle: '//'
    };
  }

  // C Configuration
  getCConfig() {
    return {
      keywords: ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline', 'int', 'long', 'register', 'restrict', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while', '_Alignas', '_Alignof', '_Atomic', '_Static_assert', '_Noreturn', '_Thread_local', '_Generic'],
      builtins: ['printf', 'scanf', 'malloc', 'free', 'strlen', 'strcpy', 'strcmp', 'strcat', 'memcpy', 'memset', 'fopen', 'fclose', 'fread', 'fwrite'],
      patterns: {
        include: ['#include <stdio.h>', '#include <stdlib.h>', '#include <string.h>', '#include <math.h>'],
        function: ['int functionName() {\n    \n}', 'void functionName() {\n    \n}'],
        struct: ['struct Name {\n    \n};', 'typedef struct {\n    \n} Name;'],
        loop: ['for (int i = 0; i < n; i++) {\n    \n}', 'while (condition) {\n    \n}'],
        conditional: ['if (condition) {\n    \n}', 'if (condition) {\n    \n} else {\n    \n}'],
        main: ['int main() {\n    \n    return 0;\n}', 'int main(int argc, char *argv[]) {\n    \n    return 0;\n}']
      },
      fileExtensions: ['.c', '.h'],
      commentStyle: '//'
    };
  }

  // C# Configuration
  getCSharpConfig() {
    return {
      keywords: ['abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while'],
      builtins: ['Console', 'String', 'Int32', 'Double', 'Boolean', 'DateTime', 'List', 'Dictionary', 'Array', 'Object', 'Exception'],
      patterns: {
        class: ['public class Name {\n    \n}', 'public class Name : BaseClass {\n    \n}'],
        method: ['public void MethodName() {\n    \n}', 'public static void Main(string[] args) {\n    \n}'],
        property: ['public string PropertyName { get; set; }'],
        loop: ['for (int i = 0; i < length; i++) {\n    \n}', 'foreach (var item in items) {\n    \n}', 'while (condition) {\n    \n}'],
        conditional: ['if (condition) {\n    \n}', 'if (condition) {\n    \n} else {\n    \n}'],
        trycatch: ['try {\n    \n} catch (Exception ex) {\n    \n}'],
        using: ['using System;', 'using System.Collections.Generic;', 'using System.Linq;']
      },
      fileExtensions: ['.cs'],
      commentStyle: '//'
    };
  }

  // Go Configuration
  getGoConfig() {
    return {
      keywords: ['break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var'],
      builtins: ['append', 'cap', 'close', 'complex', 'copy', 'delete', 'imag', 'len', 'make', 'new', 'panic', 'print', 'println', 'real', 'recover'],
      patterns: {
        package: ['package main'],
        import: ['import "fmt"', 'import (\n    "fmt"\n    "os"\n)'],
        function: ['func functionName() {\n    \n}', 'func main() {\n    \n}'],
        struct: ['type Name struct {\n    \n}'],
        interface: ['type Name interface {\n    \n}'],
        loop: ['for i := 0; i < n; i++ {\n    \n}', 'for _, item := range items {\n    \n}', 'for condition {\n    \n}'],
        conditional: ['if condition {\n    \n}', 'if condition {\n    \n} else {\n    \n}'],
        goroutine: ['go functionName()']
      },
      fileExtensions: ['.go'],
      commentStyle: '//'
    };
  }

  // Additional language configurations...
  getRustConfig() {
    return {
      keywords: ['as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern', 'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while'],
      patterns: {
        function: ['fn function_name() {\n    \n}', 'fn main() {\n    \n}'],
        struct: ['struct Name {\n    \n}'],
        enum: ['enum Name {\n    \n}'],
        impl: ['impl Name {\n    \n}'],
        match: ['match value {\n    _ => {},\n}']
      },
      fileExtensions: ['.rs'],
      commentStyle: '//'
    };
  }

  getPhpConfig() {
    return {
      keywords: ['abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 'clone', 'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 'final', 'finally', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'namespace', 'new', 'or', 'print', 'private', 'protected', 'public', 'require', 'require_once', 'return', 'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield'],
      patterns: {
        function: ['function functionName() {\n    \n}', 'public function methodName() {\n    \n}'],
        class: ['class Name {\n    \n}'],
        loop: ['for ($i = 0; $i < $n; $i++) {\n    \n}', 'foreach ($array as $item) {\n    \n}'],
        conditional: ['if ($condition) {\n    \n}']
      },
      fileExtensions: ['.php'],
      commentStyle: '//'
    };
  }

  getRubyConfig() {
    return {
      keywords: ['alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'defined?', 'do', 'else', 'elsif', 'end', 'ensure', 'false', 'for', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry', 'return', 'self', 'super', 'then', 'true', 'undef', 'unless', 'until', 'when', 'while', 'yield'],
      patterns: {
        method: ['def method_name\n  \nend'],
        class: ['class Name\n  \nend'],
        loop: ['for item in items\n  \nend', 'items.each do |item|\n  \nend'],
        conditional: ['if condition\n  \nend']
      },
      fileExtensions: ['.rb'],
      commentStyle: '#'
    };
  }

  getSwiftConfig() {
    return {
      keywords: ['associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate', 'func', 'import', 'init', 'inout', 'internal', 'let', 'open', 'operator', 'private', 'protocol', 'public', 'static', 'struct', 'subscript', 'typealias', 'var', 'break', 'case', 'continue', 'default', 'defer', 'do', 'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat', 'return', 'switch', 'where', 'while'],
      patterns: {
        function: ['func functionName() {\n    \n}'],
        class: ['class Name {\n    \n}'],
        struct: ['struct Name {\n    \n}'],
        loop: ['for item in items {\n    \n}', 'while condition {\n    \n}'],
        conditional: ['if condition {\n    \n}']
      },
      fileExtensions: ['.swift'],
      commentStyle: '//'
    };
  }

  getKotlinConfig() {
    return {
      keywords: ['as', 'as?', 'break', 'class', 'continue', 'do', 'else', 'false', 'for', 'fun', 'if', 'in', '!in', 'interface', 'is', '!is', 'null', 'object', 'package', 'return', 'super', 'this', 'throw', 'true', 'try', 'typealias', 'typeof', 'val', 'var', 'when', 'while'],
      patterns: {
        function: ['fun functionName() {\n    \n}'],
        class: ['class Name {\n    \n}'],
        loop: ['for (item in items) {\n    \n}', 'while (condition) {\n    \n}'],
        conditional: ['if (condition) {\n    \n}']
      },
      fileExtensions: ['.kt', '.kts'],
      commentStyle: '//'
    };
  }

  getHtmlConfig() {
    return {
      keywords: [],
      patterns: {
        doctype: ['<!DOCTYPE html>'],
        html: ['<html>\n  <head>\n    <title></title>\n  </head>\n  <body>\n    \n  </body>\n</html>'],
        div: ['<div></div>', '<div class=""></div>', '<div id=""></div>'],
        span: ['<span></span>'],
        p: ['<p></p>'],
        a: ['<a href=""></a>'],
        img: ['<img src="" alt="">'],
        form: ['<form>\n  \n</form>'],
        input: ['<input type="text">', '<input type="submit" value="">']
      },
      fileExtensions: ['.html', '.htm'],
      commentStyle: '<!--'
    };
  }

  getCssConfig() {
    return {
      keywords: [],
      patterns: {
        selector: ['.class {\n  \n}', '#id {\n  \n}', 'element {\n  \n}'],
        media: ['@media (max-width: 768px) {\n  \n}'],
        keyframes: ['@keyframes animationName {\n  0% {\n    \n  }\n  100% {\n    \n  }\n}']
      },
      properties: ['color', 'background', 'font-size', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'z-index', 'opacity', 'transform', 'transition'],
      fileExtensions: ['.css', '.scss', '.sass', '.less'],
      commentStyle: '/*'
    };
  }

  getSqlConfig() {
    return {
      keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
      patterns: {
        select: ['SELECT * FROM table_name;', 'SELECT column1, column2 FROM table_name WHERE condition;'],
        insert: ['INSERT INTO table_name (column1, column2) VALUES (value1, value2);'],
        update: ['UPDATE table_name SET column1 = value1 WHERE condition;'],
        delete: ['DELETE FROM table_name WHERE condition;'],
        create: ['CREATE TABLE table_name (\n  id INT PRIMARY KEY,\n  name VARCHAR(255)\n);']
      },
      fileExtensions: ['.sql'],
      commentStyle: '--'
    };
  }

  getBashConfig() {
    return {
      keywords: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'break', 'continue'],
      patterns: {
        shebang: ['#!/bin/bash'],
        function: ['function_name() {\n  \n}'],
        if: ['if [ condition ]; then\n  \nfi'],
        for: ['for item in list; do\n  \ndone'],
        while: ['while [ condition ]; do\n  \ndone']
      },
      fileExtensions: ['.sh', '.bash'],
      commentStyle: '#'
    };
  }

  getPowerShellConfig() {
    return {
      keywords: ['if', 'else', 'elseif', 'switch', 'for', 'foreach', 'while', 'do', 'until', 'function', 'param', 'return', 'break', 'continue', 'try', 'catch', 'finally', 'throw'],
      patterns: {
        function: ['function FunctionName {\n  \n}'],
        if: ['if ($condition) {\n  \n}'],
        foreach: ['foreach ($item in $items) {\n  \n}'],
        trycatch: ['try {\n  \n} catch {\n  \n}']
      },
      fileExtensions: ['.ps1', '.psm1'],
      commentStyle: '#'
    };
  }

  // Helper methods for pattern matching
  getPatternSuggestions(currentLine, config) {
    const suggestions = [];
    const line = currentLine.trim().toLowerCase();

    Object.entries(config.patterns || {}).forEach(([key, patterns]) => {
      patterns.forEach(pattern => {
        if (this.shouldSuggestPattern(line, key, pattern)) {
          suggestions.push({
            text: pattern,
            description: `${key} pattern`,
            type: 'pattern',
            confidence: 0.8
          });
        }
      });
    });

    return suggestions;
  }

  getKeywordSuggestions(currentLine, config) {
    const suggestions = [];
    const line = currentLine.trim();

    (config.keywords || []).forEach(keyword => {
      if (keyword.toLowerCase().startsWith(line.toLowerCase()) && line.length > 0) {
        suggestions.push({
          text: keyword,
          description: `Keyword: ${keyword}`,
          type: 'keyword',
          confidence: 0.7
        });
      }
    });

    return suggestions;
  }

  getFunctionSuggestions(currentLine, config) {
    const suggestions = [];
    
    (config.builtins || []).forEach(builtin => {
      if (currentLine.includes(builtin) || currentLine.trim() === '') {
        suggestions.push({
          text: builtin,
          description: `Built-in: ${builtin}`,
          type: 'builtin',
          confidence: 0.6
        });
      }
    });

    return suggestions;
  }

  getStructureSuggestions(currentLine, config) {
    const suggestions = [];
    
    if (currentLine.includes('.') && config.methods) {
      Object.entries(config.methods).forEach(([type, methods]) => {
        methods.forEach(method => {
          suggestions.push({
            text: method,
            description: `${type} method: ${method}`,
            type: 'method',
            confidence: 0.7
          });
        });
      });
    }

    return suggestions;
  }

  getImportSuggestions(currentLine, config) {
    const suggestions = [];
    
    if (currentLine.includes('import') || currentLine.includes('include') || currentLine.includes('using')) {
      (config.patterns?.import || []).forEach(pattern => {
        suggestions.push({
          text: pattern,
          description: 'Import statement',
          type: 'import',
          confidence: 0.8
        });
      });
    }

    return suggestions;
  }

  getCommentSuggestions(currentLine, config) {
    const suggestions = [];
    
    if (currentLine.trim() === '' || currentLine.includes(config.commentStyle)) {
      suggestions.push({
        text: `${config.commentStyle} TODO: `,
        description: 'TODO comment',
        type: 'comment',
        confidence: 0.5
      });
    }

    return suggestions;
  }

  getDataTypeSuggestions(currentLine, config) {
    const suggestions = [];
    
    (config.types || []).forEach(type => {
      if (currentLine.includes(':') || currentLine.includes('=')) {
        suggestions.push({
          text: type,
          description: `Data type: ${type}`,
          type: 'type',
          confidence: 0.6
        });
      }
    });

    return suggestions;
  }

  getAlgorithmSuggestions(currentLine, config, language) {
    const suggestions = [];
    
    // Common algorithm patterns for competitive programming
    const algorithms = {
      'two pointers': this.getTwoPointersPattern(language),
      'binary search': this.getBinarySearchPattern(language),
      'sliding window': this.getSlidingWindowPattern(language),
      'dfs': this.getDFSPattern(language),
      'bfs': this.getBFSPattern(language)
    };

    if (currentLine.includes('//') || currentLine.includes('#') || currentLine.trim() === '') {
      Object.entries(algorithms).forEach(([name, pattern]) => {
        if (pattern) {
          suggestions.push({
            text: pattern,
            description: `${name} algorithm`,
            type: 'algorithm',
            confidence: 0.7
          });
        }
      });
    }

    return suggestions;
  }

  // Algorithm pattern generators
  getTwoPointersPattern(language) {
    const patterns = {
      javascript: 'let left = 0, right = arr.length - 1;\nwhile (left < right) {\n  // Process\n  left++;\n  right--;\n}',
      python: 'left, right = 0, len(arr) - 1\nwhile left < right:\n    # Process\n    left += 1\n    right -= 1',
      java: 'int left = 0, right = arr.length - 1;\nwhile (left < right) {\n    // Process\n    left++;\n    right--;\n}',
      cpp: 'int left = 0, right = arr.size() - 1;\nwhile (left < right) {\n    // Process\n    left++;\n    right--;\n}'
    };
    return patterns[language] || patterns.javascript;
  }

  getBinarySearchPattern(language) {
    const patterns = {
      javascript: 'let left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  else if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;',
      python: 'left, right = 0, len(arr) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target:\n        return mid\n    elif arr[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\nreturn -1',
      java: 'int left = 0, right = arr.length - 1;\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n}\nreturn -1;',
      cpp: 'int left = 0, right = arr.size() - 1;\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n}\nreturn -1;'
    };
    return patterns[language] || patterns.javascript;
  }

  getSlidingWindowPattern(language) {
    const patterns = {
      javascript: 'let left = 0;\nfor (let right = 0; right < arr.length; right++) {\n  // Expand window\n  while (/* shrink condition */) {\n    // Shrink window\n    left++;\n  }\n  // Process window\n}',
      python: 'left = 0\nfor right in range(len(arr)):\n    # Expand window\n    while # shrink condition:\n        # Shrink window\n        left += 1\n    # Process window',
      java: 'int left = 0;\nfor (int right = 0; right < arr.length; right++) {\n    // Expand window\n    while (/* shrink condition */) {\n        // Shrink window\n        left++;\n    }\n    // Process window\n}',
      cpp: 'int left = 0;\nfor (int right = 0; right < arr.size(); right++) {\n    // Expand window\n    while (/* shrink condition */) {\n        // Shrink window\n        left++;\n    }\n    // Process window\n}'
    };
    return patterns[language] || patterns.javascript;
  }

  getDFSPattern(language) {
    const patterns = {
      javascript: 'function dfs(node, visited) {\n  if (visited.has(node)) return;\n  visited.add(node);\n  // Process node\n  for (const neighbor of graph[node]) {\n    dfs(neighbor, visited);\n  }\n}',
      python: 'def dfs(node, visited):\n    if node in visited:\n        return\n    visited.add(node)\n    # Process node\n    for neighbor in graph[node]:\n        dfs(neighbor, visited)',
      java: 'void dfs(int node, Set<Integer> visited) {\n    if (visited.contains(node)) return;\n    visited.add(node);\n    // Process node\n    for (int neighbor : graph.get(node)) {\n        dfs(neighbor, visited);\n    }\n}',
      cpp: 'void dfs(int node, unordered_set<int>& visited) {\n    if (visited.count(node)) return;\n    visited.insert(node);\n    // Process node\n    for (int neighbor : graph[node]) {\n        dfs(neighbor, visited);\n    }\n}'
    };
    return patterns[language] || patterns.javascript;
  }

  getBFSPattern(language) {
    const patterns = {
      javascript: 'const queue = [start];\nconst visited = new Set([start]);\nwhile (queue.length > 0) {\n  const node = queue.shift();\n  // Process node\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      visited.add(neighbor);\n      queue.push(neighbor);\n    }\n  }\n}',
      python: 'from collections import deque\nqueue = deque([start])\nvisited = set([start])\nwhile queue:\n    node = queue.popleft()\n    # Process node\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            queue.append(neighbor)',
      java: 'Queue<Integer> queue = new LinkedList<>();\nSet<Integer> visited = new HashSet<>();\nqueue.offer(start);\nvisited.add(start);\nwhile (!queue.isEmpty()) {\n    int node = queue.poll();\n    // Process node\n    for (int neighbor : graph.get(node)) {\n        if (!visited.contains(neighbor)) {\n            visited.add(neighbor);\n            queue.offer(neighbor);\n        }\n    }\n}',
      cpp: 'queue<int> q;\nunordered_set<int> visited;\nq.push(start);\nvisited.insert(start);\nwhile (!q.empty()) {\n    int node = q.front();\n    q.pop();\n    // Process node\n    for (int neighbor : graph[node]) {\n        if (!visited.count(neighbor)) {\n            visited.insert(neighbor);\n            q.push(neighbor);\n        }\n    }\n}'
    };
    return patterns[language] || patterns.javascript;
  }

  shouldSuggestPattern(line, key, pattern) {
    const triggers = {
      function: ['func', 'def', 'function', 'method'],
      class: ['class', 'struct'],
      loop: ['for', 'while', 'loop'],
      conditional: ['if', 'else', 'switch', 'case'],
      trycatch: ['try', 'catch', 'except'],
      import: ['import', 'include', 'using', 'from']
    };

    const keyTriggers = triggers[key] || [];
    return keyTriggers.some(trigger => line.includes(trigger)) || line === '';
  }

  getGenericSuggestions(code, cursorPosition) {
    return [
      { text: '\n', description: 'New line', type: 'generic', confidence: 0.3 },
      { text: ' ', description: 'Space', type: 'generic', confidence: 0.2 }
    ];
  }
}

// Export singleton instance
export const multiLanguageSuggestions = new MultiLanguageAutoSuggestions();
export default multiLanguageSuggestions;
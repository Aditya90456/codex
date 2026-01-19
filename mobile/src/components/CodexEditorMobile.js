import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CodexEditorMobile() {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'logo-javascript', color: '#f7df1e' },
    { id: 'python', name: 'Python', icon: 'logo-python', color: '#3776ab' },
    { id: 'java', name: 'Java', icon: 'logo-java', color: '#007396' },
    { id: 'cpp', name: 'C++', icon: 'code', color: '#00599c' },
  ];

  const templates = {
    javascript: '// JavaScript\nconsole.log("Hello, World!");',
    python: '# Python\nprint("Hello, World!")',
    java: '// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '// C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
    setShowLanguages(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('Hello, World!\n\nExecution completed successfully.');
      setIsRunning(false);
    }, 1500);
  };

  const handleClear = () => {
    setCode(templates[language]);
    setOutput('');
  };

  const currentLanguage = languages.find(l => l.id === language);

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguages(!showLanguages)}
        >
          <Ionicons name={currentLanguage.icon} size={20} color={currentLanguage.color} />
          <Text style={styles.languageText}>{currentLanguage.name}</Text>
          <Ionicons name="chevron-down" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.toolbarActions}>
          <TouchableOpacity style={styles.toolbarButton} onPress={handleClear}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.runButton, isRunning && styles.runButtonDisabled]}
            onPress={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="play" size={18} color="#fff" />
                <Text style={styles.runButtonText}>Run</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector */}
      {showLanguages && (
        <View style={styles.languageSelector}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.languageOption,
                language === lang.id && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageChange(lang.id)}
            >
              <Ionicons name={lang.icon} size={24} color={lang.color} />
              <Text style={styles.languageOptionText}>{lang.name}</Text>
              {language === lang.id && (
                <Ionicons name="checkmark" size={20} color="#10b981" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Code Editor */}
      <View style={styles.editorContainer}>
        <View style={styles.editorHeader}>
          <Ionicons name="document-text" size={16} color="#94a3b8" />
          <Text style={styles.editorHeaderText}>main.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'js'}</Text>
        </View>
        <ScrollView style={styles.editorScroll}>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="Write your code here..."
            placeholderTextColor="#475569"
          />
        </ScrollView>
      </View>

      {/* Output Console */}
      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <Ionicons name="terminal" size={16} color="#94a3b8" />
          <Text style={styles.consoleHeaderText}>Output</Text>
        </View>
        <ScrollView style={styles.consoleScroll}>
          <Text style={styles.consoleText}>
            {output || 'Run your code to see output here...'}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  languageSelector: {
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  languageOptionActive: {
    backgroundColor: '#334155',
  },
  languageOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  editorHeaderText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  editorScroll: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#e2e8f0',
    padding: 16,
    minHeight: 300,
  },
  consoleContainer: {
    height: 200,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  consoleHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  consoleScroll: {
    flex: 1,
  },
  consoleText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#10b981',
    padding: 16,
  },
});

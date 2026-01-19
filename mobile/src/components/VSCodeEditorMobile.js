import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VSCodeEditorMobile() {
  const [files, setFiles] = useState([
    { id: 1, name: 'index.js', content: 'console.log("Hello");', icon: 'logo-javascript', color: '#f7df1e' },
    { id: 2, name: 'styles.css', content: 'body { margin: 0; }', icon: 'color-palette', color: '#2965f1' },
    { id: 3, name: 'README.md', content: '# My Project', icon: 'document-text', color: '#94a3b8' },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [output, setOutput] = useState('');

  const handleFileSelect = (file) => {
    setActiveFile(file);
    setShowSidebar(false);
  };

  const handleCodeChange = (text) => {
    const updatedFiles = files.map(f =>
      f.id === activeFile.id ? { ...f, content: text } : f
    );
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: text });
  };

  const handleRun = () => {
    setOutput(`> Running ${activeFile.name}\n\nHello\n\n✓ Execution completed`);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.sidebarToggle}
          onPress={() => setShowSidebar(!showSidebar)}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{activeFile.name}</Text>
        <TouchableOpacity style={styles.runButton} onPress={handleRun}>
          <Ionicons name="play" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Sidebar */}
        {showSidebar && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>EXPLORER</Text>
            </View>
            <FlatList
              data={files}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.fileItem,
                    activeFile.id === item.id && styles.fileItemActive,
                  ]}
                  onPress={() => handleFileSelect(item)}
                >
                  <Ionicons name={item.icon} size={18} color={item.color} />
                  <Text style={styles.fileName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Editor Area */}
        <View style={styles.editorArea}>
          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <View style={styles.tab}>
              <Ionicons name={activeFile.icon} size={16} color={activeFile.color} />
              <Text style={styles.tabText}>{activeFile.name}</Text>
            </View>
          </View>

          {/* Code Editor */}
          <ScrollView style={styles.editorScroll}>
            <View style={styles.lineNumbers}>
              {activeFile.content.split('\n').map((_, index) => (
                <Text key={index} style={styles.lineNumber}>
                  {index + 1}
                </Text>
              ))}
            </View>
            <TextInput
              style={styles.codeInput}
              value={activeFile.content}
              onChangeText={handleCodeChange}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </ScrollView>

          {/* Terminal */}
          {output && (
            <View style={styles.terminal}>
              <View style={styles.terminalHeader}>
                <Ionicons name="terminal" size={14} color="#94a3b8" />
                <Text style={styles.terminalTitle}>TERMINAL</Text>
                <TouchableOpacity onPress={() => setOutput('')}>
                  <Ionicons name="close" size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.terminalContent}>
                <Text style={styles.terminalText}>{output}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Ionicons name="git-branch" size={14} color="#fff" />
          <Text style={styles.statusText}>main</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.statusText}>UTF-8</Text>
          <Text style={styles.statusText}>JavaScript</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d30',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  sidebarToggle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  runButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e639c',
    borderRadius: 6,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#252526',
    borderRightWidth: 1,
    borderRightColor: '#3e3e42',
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cccccc',
    letterSpacing: 0.5,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  fileItemActive: {
    backgroundColor: '#37373d',
  },
  fileName: {
    fontSize: 13,
    color: '#cccccc',
  },
  editorArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#1e1e1e',
  },
  tabText: {
    fontSize: 13,
    color: '#fff',
  },
  editorScroll: {
    flex: 1,
  },
  lineNumbers: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#1e1e1e',
    width: 40,
  },
  lineNumber: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#858585',
    textAlign: 'right',
    lineHeight: 20,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#d4d4d4',
    paddingVertical: 16,
    paddingLeft: 50,
    paddingRight: 16,
    lineHeight: 20,
  },
  terminal: {
    height: 150,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2d2d30',
    gap: 8,
  },
  terminalTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#cccccc',
  },
  terminalContent: {
    flex: 1,
  },
  terminalText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#cccccc',
    padding: 12,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007acc',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
  },
});

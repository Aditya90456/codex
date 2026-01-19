import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CodexEditorMobile from '../components/CodexEditorMobile';
import VSCodeEditorMobile from '../components/VSCodeEditorMobile';
import AndroidEditorMobile from '../components/AndroidEditorMobile';
import WebEditorMobile from '../components/WebEditorMobile';

export default function EditorScreen() {
  const [selectedEditor, setSelectedEditor] = useState(null);

  const editors = [
    {
      id: 'codex',
      name: 'Codex Editor',
      description: 'Modern code editor with syntax highlighting',
      icon: 'code-slash',
      color: '#3b82f6',
      component: CodexEditorMobile,
    },
    {
      id: 'vscode',
      name: 'VS Code Style',
      description: 'VS Code inspired interface',
      icon: 'terminal',
      color: '#0ea5e9',
      component: VSCodeEditorMobile,
    },
    {
      id: 'android',
      name: 'Android Studio',
      description: 'Android app development',
      icon: 'logo-android',
      color: '#22c55e',
      component: AndroidEditorMobile,
    },
    {
      id: 'web',
      name: 'Web Editor',
      description: 'HTML, CSS, JavaScript playground',
      icon: 'globe',
      color: '#f59e0b',
      component: WebEditorMobile,
    },
  ];

  const handleEditorSelect = (editor) => {
    setSelectedEditor(editor);
  };

  const handleCloseEditor = () => {
    setSelectedEditor(null);
  };

  if (selectedEditor) {
    const EditorComponent = selectedEditor.component;
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={handleCloseEditor} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.editorTitle}>{selectedEditor.name}</Text>
          <View style={{ width: 40 }} />
        </View>
        <EditorComponent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Editor</Text>
          <Text style={styles.subtitle}>Select an editor to start coding</Text>
        </View>

        <View style={styles.editorsGrid}>
          {editors.map((editor) => (
            <TouchableOpacity
              key={editor.id}
              style={styles.editorCard}
              onPress={() => handleEditorSelect(editor)}
            >
              <View style={[styles.editorIconContainer, { backgroundColor: editor.color }]}>
                <Ionicons name={editor.icon} size={40} color="#fff" />
              </View>
              <Text style={styles.editorName}>{editor.name}</Text>
              <Text style={styles.editorDescription}>{editor.description}</Text>
              <View style={styles.launchButton}>
                <Text style={styles.launchButtonText}>Launch</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#f59e0b" />
            <Text style={styles.tipText}>Swipe to switch between files</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="save" size={20} color="#10b981" />
            <Text style={styles.tipText}>Auto-save is enabled by default</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="play" size={20} color="#3b82f6" />
            <Text style={styles.tipText}>Tap Run to execute your code</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  editorsGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  editorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  editorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  editorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  editorDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  launchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  launchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  tipsContainer: {
    padding: 24,
    paddingTop: 32,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
  },
});

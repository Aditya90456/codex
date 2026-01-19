import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function WebEditorMobile() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to Web Editor</p>
</body>
</html>`);
  const [css, setCss] = useState(`body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

p {
    font-size: 1.2em;
}`);
  const [js, setJs] = useState(`console.log('Hello from JavaScript!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded!');
});`);
  const [activeTab, setActiveTab] = useState('html');
  const [showPreview, setShowPreview] = useState(false);

  const tabs = [
    { id: 'html', name: 'HTML', icon: 'logo-html5', color: '#e34c26' },
    { id: 'css', name: 'CSS', icon: 'logo-css3', color: '#264de4' },
    { id: 'js', name: 'JavaScript', icon: 'logo-javascript', color: '#f7df1e' },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'html': return html;
      case 'css': return css;
      case 'js': return js;
      default: return '';
    }
  };

  const setContent = (text) => {
    switch (activeTab) {
      case 'html': setHtml(text); break;
      case 'css': setCss(text); break;
      case 'js': setJs(text); break;
    }
  };

  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html.replace(/<html>|<\/html>|<head>.*?<\/head>|<body>|<\/body>/gi, '')}
        <script>${js}</script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <Ionicons name="globe" size={24} color="#f59e0b" />
          <Text style={styles.toolbarTitle}>Web Editor</Text>
        </View>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => setShowPreview(!showPreview)}
        >
          <Ionicons name={showPreview ? 'code' : 'eye'} size={18} color="#fff" />
          <Text style={styles.previewButtonText}>
            {showPreview ? 'Code' : 'Preview'}
          </Text>
        </TouchableOpacity>
      </View>

      {showPreview ? (
        /* Preview */
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Ionicons name="desktop" size={16} color="#94a3b8" />
            <Text style={styles.previewTitle}>Live Preview</Text>
          </View>
          <WebView
            originWhitelist={['*']}
            source={{ html: generatePreviewHTML() }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      ) : (
        /* Editor */
        <>
          {/* File Tabs */}
          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons name={tab.icon} size={18} color={tab.color} />
                <Text style={styles.tabText}>{tab.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Code Editor */}
          <ScrollView style={styles.editorContainer}>
            <TextInput
              style={styles.codeInput}
              value={getContent()}
              onChangeText={setContent}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
              placeholderTextColor="#475569"
            />
          </ScrollView>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="save" size={18} color="#10b981" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="download" size={18} color="#3b82f6" />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social" size={18} color="#8b5cf6" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle" size={14} color="#10b981" />
          <Text style={styles.statusText}>No errors</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>
            {activeTab.toUpperCase()} • {getContent().split('\n').length} lines
          </Text>
        </View>
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
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  editorContainer: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#e2e8f0',
    padding: 16,
    minHeight: 400,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#94a3b8',
  },
});

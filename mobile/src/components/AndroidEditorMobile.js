import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AndroidEditorMobile() {
  const [code, setCode] = useState(`package com.example.myapp;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        TextView textView = findViewById(R.id.textView);
        textView.setText("Hello, Android!");
    }
}`);
  const [xml, setXml] = useState(`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical">
    
    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textSize="24sp" />
        
</LinearLayout>`);
  const [activeTab, setActiveTab] = useState('java');
  const [buildOutput, setBuildOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleBuild = () => {
    setBuildOutput('Building APK...\n\n✓ Compiling Java sources\n✓ Processing resources\n✓ Generating DEX files\n✓ Packaging APK\n\nBUILD SUCCESSFUL in 2s');
  };

  const handleRun = () => {
    setShowPreview(true);
    setBuildOutput('Installing APK...\n\n✓ APK installed\n✓ Launching app\n\nApp running on emulator');
  };

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <Ionicons name="logo-android" size={24} color="#3ddc84" />
          <Text style={styles.toolbarTitle}>Android Studio</Text>
        </View>
        <View style={styles.toolbarActions}>
          <TouchableOpacity style={styles.toolbarButton} onPress={handleBuild}>
            <Ionicons name="hammer" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.runButton} onPress={handleRun}>
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.runButtonText}>Run</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* File Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'java' && styles.tabActive]}
          onPress={() => setActiveTab('java')}
        >
          <Ionicons name="logo-java" size={16} color="#007396" />
          <Text style={styles.tabText}>MainActivity.java</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'xml' && styles.tabActive]}
          onPress={() => setActiveTab('xml')}
        >
          <Ionicons name="code" size={16} color="#e34c26" />
          <Text style={styles.tabText}>activity_main.xml</Text>
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView style={styles.editorContainer}>
        <TextInput
          style={styles.codeInput}
          value={activeTab === 'java' ? code : xml}
          onChangeText={activeTab === 'java' ? setCode : setXml}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </ScrollView>

      {/* Preview/Output */}
      {showPreview ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Ionicons name="phone-portrait" size={16} color="#94a3b8" />
            <Text style={styles.previewTitle}>Preview - Pixel 6</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneScreen}>
              <Text style={styles.previewText}>Hello, Android!</Text>
            </View>
          </View>
        </View>
      ) : buildOutput ? (
        <View style={styles.buildOutput}>
          <View style={styles.buildHeader}>
            <Ionicons name="terminal" size={16} color="#94a3b8" />
            <Text style={styles.buildTitle}>Build Output</Text>
            <TouchableOpacity onPress={() => setBuildOutput('')}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.buildScroll}>
            <Text style={styles.buildText}>{buildOutput}</Text>
          </ScrollView>
        </View>
      ) : null}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3ddc84" />
          <Text style={styles.bottomBarText}>No errors</Text>
        </View>
        <View style={styles.bottomBarItem}>
          <Ionicons name="logo-android" size={16} color="#94a3b8" />
          <Text style={styles.bottomBarText}>API 33</Text>
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d30',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
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
    backgroundColor: '#3e3e42',
    borderRadius: 6,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3ddc84',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  runButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 2,
    borderBottomColor: '#3ddc84',
  },
  tabText: {
    fontSize: 13,
    color: '#cccccc',
  },
  editorContainer: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#d4d4d4',
    padding: 16,
    minHeight: 400,
  },
  previewContainer: {
    height: 300,
    backgroundColor: '#252526',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2d2d30',
    gap: 8,
  },
  previewTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#cccccc',
  },
  phoneFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneScreen: {
    width: 180,
    height: 240,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  previewText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  buildOutput: {
    height: 200,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  buildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2d2d30',
    gap: 8,
  },
  buildTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#cccccc',
  },
  buildScroll: {
    flex: 1,
  },
  buildText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#3ddc84',
    padding: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
  },
  bottomBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomBarText: {
    fontSize: 11,
    color: '#cccccc',
  },
});

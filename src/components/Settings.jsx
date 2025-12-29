import { useState } from 'react';
import {
  X,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Bell,
  Code,
  Palette,
  Keyboard,
  Globe
} from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    autoSave: true,
    soundEnabled: true,
    notifications: true,
    minimap: true,
    lineNumbers: true,
    wordWrap: true,
    tabSize: 2,
    language: 'en',
    keyBindings: 'default',
  });

  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('codex-settings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      autoSave: true,
      soundEnabled: true,
      notifications: true,
      minimap: true,
      lineNumbers: true,
      wordWrap: true,
      tabSize: 2,
      language: 'en',
      keyBindings: 'default',
    };
    setSettings(defaultSettings);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'general', label: 'General', icon: Globe },
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const fontFamilies = [
    'JetBrains Mono',
    'Fira Code',
    'Monaco',
    'Consolas',
    'Source Code Pro',
    'Ubuntu Mono',
  ];

  const keyBindingOptions = [
    { value: 'default', label: 'Default' },
    { value: 'vim', label: 'Vim' },
    { value: 'emacs', label: 'Emacs' },
    { value: 'sublime', label: 'Sublime Text' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 border-r border-gray-700">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Appearance</h3>
                  
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => handleSettingChange('theme', theme.value)}
                          className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                            settings.theme === theme.value
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <theme.icon size={18} />
                          <span className="text-white">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size: {settings.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Editor</h3>
                  
                  {/* Tab Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tab Size</label>
                    <select
                      value={settings.tabSize}
                      onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>

                  {/* Editor Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Auto Save</label>
                        <p className="text-xs text-gray-400">Automatically save changes</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Minimap</label>
                        <p className="text-xs text-gray-400">Show code minimap</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('minimap', !settings.minimap)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.minimap ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.minimap ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Line Numbers</label>
                        <p className="text-xs text-gray-400">Show line numbers</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('lineNumbers', !settings.lineNumbers)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.lineNumbers ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.lineNumbers ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Word Wrap</label>
                        <p className="text-xs text-gray-400">Wrap long lines</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('wordWrap', !settings.wordWrap)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.wordWrap ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.wordWrap ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Enable Notifications</label>
                        <p className="text-xs text-gray-400">Receive notifications for important events</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', !settings.notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Sound Effects</label>
                        <p className="text-xs text-gray-400">Play sounds for notifications</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'keyboard' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Keyboard</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Key Bindings</label>
                    <select
                      value={settings.keyBindings}
                      onChange={(e) => handleSettingChange('keyBindings', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      {keyBindingOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-3">Keyboard Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Run Code</span>
                        <span className="text-gray-400">Ctrl + Enter</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Save File</span>
                        <span className="text-gray-400">Ctrl + S</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Go to Line</span>
                        <span className="text-gray-400">Ctrl + G</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Find</span>
                        <span className="text-gray-400">Ctrl + F</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">General</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset to Defaults</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
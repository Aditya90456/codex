import { useState } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { 
  Palette, X, Check, Sparkles, Sun, Moon, Zap, 
  Type, Monitor, Eye, Download, Upload, RotateCcw
} from 'lucide-react';

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const { theme, currentTheme, changeTheme, setCustomTheme, fontSize, changeFontSize, fontFamily, changeFontFamily } = useTheme();
  const [activeTab, setActiveTab] = useState('presets');
  const [customPrimary, setCustomPrimary] = useState('#3b82f6');
  const [customSecondary, setCustomSecondary] = useState('#8b5cf6');
  const [customAccent, setCustomAccent] = useState('#06b6d4');

  if (!isOpen) return null;

  const fontSizes = [
    { value: 'small', label: 'Small', size: 'text-sm' },
    { value: 'medium', label: 'Medium', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'xlarge', label: 'Extra Large', size: 'text-xl' }
  ];

  const fontFamilies = [
    { value: 'mono', label: 'Monospace', font: 'font-mono' },
    { value: 'sans', label: 'Sans Serif', font: 'font-sans' },
    { value: 'serif', label: 'Serif', font: 'font-serif' }
  ];

  const applyCustomTheme = () => {
    const customTheme = {
      name: 'Custom',
      primary: `from-[${customPrimary}] to-[${customSecondary}]`,
      secondary: `from-[${customSecondary}] to-[${customAccent}]`,
      accent: `from-[${customAccent}] to-[${customPrimary}]`,
      background: 'from-gray-950 via-gray-900 to-gray-950',
      card: 'from-gray-800 to-gray-900',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      editorTheme: 'vs-dark'
    };
    setCustomTheme(customTheme);
  };

  const exportTheme = () => {
    const themeData = {
      theme: currentTheme,
      fontSize,
      fontFamily,
      customColors: currentTheme === 'custom' ? theme : null
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-theme.json';
    a.click();
  };

  const importTheme = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result);
          if (themeData.theme) changeTheme(themeData.theme);
          if (themeData.fontSize) changeFontSize(themeData.fontSize);
          if (themeData.fontFamily) changeFontFamily(themeData.fontFamily);
          if (themeData.customColors) setCustomTheme(themeData.customColors);
        } catch (error) {
          alert('Invalid theme file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Theme Customizer</h2>
              <p className="text-sm opacity-90">Personalize your coding experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Preset Themes
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-5 h-5 inline mr-2" />
            Custom Colors
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'typography'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Type className="w-5 h-5 inline mr-2" />
            Typography
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          {/* Preset Themes */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(themes).map(([key, themeData]) => (
                <div
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
                    currentTheme === key
                      ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {/* Theme Preview */}
                  <div className={`h-32 bg-gradient-to-br ${themeData.background} p-4`}>
                    <div className={`h-full bg-gradient-to-r ${themeData.card} rounded-lg p-3 border ${themeData.border}`}>
                      <div className={`w-full h-2 bg-gradient-to-r ${themeData.primary} rounded mb-2`}></div>
                      <div className={`w-3/4 h-2 bg-gradient-to-r ${themeData.secondary} rounded mb-2`}></div>
                      <div className={`w-1/2 h-2 bg-gradient-to-r ${themeData.accent} rounded`}></div>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{themeData.name}</h3>
                      {currentTheme === key && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    {key === 'light' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Sun className="w-3 h-3" />
                        <span>Light Mode</span>
                      </div>
                    )}
                    {key !== 'light' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Moon className="w-3 h-3" />
                        <span>Dark Mode</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Colors */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Create Your Custom Theme</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </label>
                  <div className="bg-gray-950 rounded-xl p-6">
                    <div 
                      className="h-20 rounded-lg mb-3"
                      style={{ background: `linear-gradient(to right, ${customPrimary}, ${customSecondary})` }}
                    ></div>
                    <div 
                      className="h-20 rounded-lg mb-3"
                      style={{ background: `linear-gradient(to right, ${customSecondary}, ${customAccent})` }}
                    ></div>
                    <div 
                      className="h-20 rounded-lg"
                      style={{ background: `linear-gradient(to right, ${customAccent}, ${customPrimary})` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={applyCustomTheme}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply Custom Theme
                </button>
              </div>
            </div>
          )}

          {/* Typography */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              {/* Font Size */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Font Size</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => changeFontSize(size.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        fontSize === size.value
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`${size.size} font-bold mb-2`}>Aa</div>
                      <div className="text-sm text-gray-400">{size.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Font Family</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => changeFontFamily(font.value)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        fontFamily === font.value
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`${font.font} text-2xl font-bold mb-2`}>
                        The quick brown fox
                      </div>
                      <div className="text-sm text-gray-400">{font.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Preview</h3>
                <div className={`bg-gray-950 rounded-lg p-6 ${fontFamilies.find(f => f.value === fontFamily)?.font}`}>
                  <div className={`${fontSizes.find(s => s.value === fontSize)?.size} mb-4`}>
                    <div className="font-bold mb-2">function helloWorld() {'{'}</div>
                    <div className="ml-4 text-gray-400">console.log("Hello, World!");</div>
                    <div className="font-bold">{'}'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={exportTheme}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                changeTheme('default');
                changeFontSize('medium');
                changeFontFamily('mono');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;

import { useState } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { 
  Palette, X, Check, Sparkles, Sun, Moon, Zap, 
  Type, Monitor, Eye, Download, Upload, RotateCcw,
  Grid, Waves, Gamepad2, Briefcase, Cpu, Clock,
  Filter, Search, Star, Share2, Copy, Shuffle
} from 'lucide-react';

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const { theme, currentTheme, changeTheme, setCustomTheme, fontSize, changeFontSize, fontFamily, changeFontFamily } = useTheme();
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [customPrimary, setCustomPrimary] = useState('#3b82f6');
  const [customSecondary, setCustomSecondary] = useState('#8b5cf6');
  const [customAccent, setCustomAccent] = useState('#06b6d4');
  const [customBackground, setCustomBackground] = useState('#0f172a');
  const [customPattern, setCustomPattern] = useState('none');
  const [enableGlow, setEnableGlow] = useState(false);
  const [enableAnimation, setEnableAnimation] = useState(false);

  if (!isOpen) return null;

  // Get unique categories
  const categories = ['All', ...new Set(Object.values(themes).map(theme => theme.category))];

  // Filter themes by category and search
  const filteredThemes = Object.entries(themes).filter(([key, themeData]) => {
    const matchesCategory = selectedCategory === 'All' || themeData.category === selectedCategory;
    const matchesSearch = themeData.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Professional': return <Briefcase className="w-4 h-4" />;
      case 'Gaming': return <Gamepad2 className="w-4 h-4" />;
      case 'Popular': return <Star className="w-4 h-4" />;
      case 'Nature': return <Waves className="w-4 h-4" />;
      case 'Creative': return <Palette className="w-4 h-4" />;
      case 'Retro': return <Clock className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const patterns = [
    { value: 'none', label: 'None' },
    { value: 'dots', label: 'Dots' },
    { value: 'grid', label: 'Grid' },
    { value: 'waves', label: 'Waves' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'retro-grid', label: 'Retro Grid' },
    { value: 'scanlines', label: 'Scanlines' }
  ];

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
      category: 'Custom',
      primary: `from-[${customPrimary}] to-[${customSecondary}]`,
      secondary: `from-[${customSecondary}] to-[${customAccent}]`,
      accent: `from-[${customAccent}] to-[${customPrimary}]`,
      background: `from-[${customBackground}] via-gray-900 to-[${customBackground}]`,
      card: 'from-gray-800 to-gray-900',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      editorTheme: 'vs-dark',
      pattern: customPattern,
      glow: enableGlow,
      animation: enableAnimation ? 'pulse' : 'none'
    };
    setCustomTheme(customTheme);
  };

  const generateRandomTheme = () => {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc',
      '#d946ef', '#ec4899', '#f43f5e'
    ];
    
    setCustomPrimary(colors[Math.floor(Math.random() * colors.length)]);
    setCustomSecondary(colors[Math.floor(Math.random() * colors.length)]);
    setCustomAccent(colors[Math.floor(Math.random() * colors.length)]);
    setCustomPattern(patterns[Math.floor(Math.random() * patterns.length)].value);
    setEnableGlow(Math.random() > 0.5);
    setEnableAnimation(Math.random() > 0.7);
  };

  const shareTheme = async () => {
    const themeData = {
      name: theme.name || 'Custom Theme',
      theme: currentTheme,
      fontSize,
      fontFamily,
      customColors: currentTheme === 'custom' ? theme : null
    };
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(themeData, null, 2));
      alert('Theme copied to clipboard! Share it with others.');
    } catch (err) {
      console.error('Failed to copy theme:', err);
    }
  };

  const getPatternClass = (pattern) => {
    switch (pattern) {
      case 'dots':
        return 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)]';
      case 'grid':
        return 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]';
      case 'waves':
        return 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]';
      case 'matrix':
        return 'bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Ctext x="2" y="15" font-family="monospace" font-size="12" fill="%2300ff00" opacity="0.3"%3E1%3C/text%3E%3Ctext x="12" y="8" font-family="monospace" font-size="12" fill="%2300ff00" opacity="0.2"%3E0%3C/text%3E%3C/svg%3E")]';
      case 'retro-grid':
        return 'bg-[linear-gradient(rgba(255,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)]';
      case 'scanlines':
        return 'bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)]';
      default:
        return '';
    }
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
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'advanced'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-5 h-5 inline mr-2" />
            Advanced
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
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search themes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {getCategoryIcon(category)}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredThemes.map(([key, themeData]) => (
                  <div
                    key={key}
                    onClick={() => changeTheme(key)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
                      currentTheme === key
                        ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                        : 'border-gray-700 hover:border-gray-600'
                    } ${themeData.glow ? 'shadow-lg' : ''}`}
                  >
                    {/* Theme Preview */}
                    <div className={`h-32 bg-gradient-to-br ${themeData.background} p-4 relative overflow-hidden`}>
                      {/* Pattern overlay */}
                      {themeData.pattern && themeData.pattern !== 'none' && (
                        <div className={`absolute inset-0 opacity-20 ${getPatternClass(themeData.pattern)}`}></div>
                      )}
                      
                      <div className={`h-full bg-gradient-to-r ${themeData.card} rounded-lg p-3 border ${themeData.border} relative z-10`}>
                        <div className={`w-full h-2 bg-gradient-to-r ${themeData.primary} rounded mb-2 ${themeData.animation === 'pulse' ? 'animate-pulse' : ''}`}></div>
                        <div className={`w-3/4 h-2 bg-gradient-to-r ${themeData.secondary} rounded mb-2`}></div>
                        <div className={`w-1/2 h-2 bg-gradient-to-r ${themeData.accent} rounded`}></div>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div className="bg-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{themeData.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              {getCategoryIcon(themeData.category)}
                              {themeData.category}
                            </span>
                            {themeData.glow && <Zap className="w-3 h-3 text-yellow-400" />}
                          </div>
                        </div>
                        {currentTheme === key && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Colors */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Create Your Custom Theme</h3>
                  <button
                    onClick={generateRandomTheme}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Shuffle className="w-4 h-4" />
                    Random
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

                  <div>
                    <label className="block text-sm font-semibold mb-2">Background</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customBackground}
                        onChange={(e) => setCustomBackground(e.target.value)}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customBackground}
                        onChange={(e) => setCustomBackground(e.target.value)}
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
                  <div className="bg-gray-950 rounded-xl p-6 relative overflow-hidden">
                    {customPattern !== 'none' && (
                      <div className={`absolute inset-0 opacity-20 ${getPatternClass(customPattern)}`}></div>
                    )}
                    <div 
                      className={`h-20 rounded-lg mb-3 relative z-10 ${enableGlow ? 'shadow-lg' : ''}`}
                      style={{ 
                        background: `linear-gradient(to right, ${customPrimary}, ${customSecondary})`,
                        boxShadow: enableGlow ? `0 0 20px ${customPrimary}40` : 'none'
                      }}
                    ></div>
                    <div 
                      className="h-20 rounded-lg mb-3 relative z-10"
                      style={{ background: `linear-gradient(to right, ${customSecondary}, ${customAccent})` }}
                    ></div>
                    <div 
                      className="h-20 rounded-lg relative z-10"
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

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Pattern Selection */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Background Patterns</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.value}
                      onClick={() => setCustomPattern(pattern.value)}
                      className={`p-4 rounded-lg border-2 transition-all relative overflow-hidden ${
                        customPattern === pattern.value
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-full h-16 bg-gray-900 rounded relative ${pattern.value !== 'none' ? getPatternClass(pattern.value) : ''}`}>
                        {pattern.value === 'none' && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                            No Pattern
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">{pattern.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Visual Effects</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Glow Effects</h4>
                      <p className="text-sm text-gray-400">Add subtle glow to UI elements</p>
                    </div>
                    <button
                      onClick={() => setEnableGlow(!enableGlow)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        enableGlow ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        enableGlow ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Animations</h4>
                      <p className="text-sm text-gray-400">Enable subtle animations</p>
                    </div>
                    <button
                      onClick={() => setEnableAnimation(!enableAnimation)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        enableAnimation ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        enableAnimation ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
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
              onClick={shareTheme}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => {
                changeTheme('default');
                changeFontSize('medium');
                changeFontFamily('mono');
                setCustomPattern('none');
                setEnableGlow(false);
                setEnableAnimation(false);
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

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Palette, Check, Settings, Monitor } from 'lucide-react';
import ResponsiveModal from './ResponsiveModal';
import ResponsiveButton from './ResponsiveButton';

const ThemeSelector = ({ showLabel = true, variant = 'button' }) => {
  const { 
    currentTheme, 
    themes, 
    setTheme, 
    customColors, 
    setCustomColors,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');
  const [customColor, setCustomColor] = useState('#3b82f6');

  const themeCategories = {
    'Professional': ['default', 'light', 'github', 'vscode', 'minimal'],
    'Nature': ['ocean', 'sunset', 'forest'],
    'Gaming': ['cyberpunk', 'neon', 'matrix', 'terminal'],
    'Popular': ['dracula', 'monokai', 'nord', 'solarized'],
    'Creative': ['retro', 'purple']
  };

  const fontSizes = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' }
  ];

  const fontFamilies = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'JetBrains Mono', value: 'JetBrains Mono' },
    { label: 'Fira Code', value: 'Fira Code' }
  ];

  const handleCustomColorAdd = () => {
    if (customColor && !customColors.includes(customColor)) {
      setCustomColors([...customColors, customColor]);
    }
  };

  const ThemePreview = ({ theme, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg cursor-pointer transition-all duration-200
        border-2 ${isSelected ? 'border-white' : 'border-transparent'}
        hover:scale-105 hover:shadow-lg
      `}
    >
      <div className={`w-full h-16 rounded-md bg-gradient-to-r ${theme.background} mb-2`}>
        <div className="flex items-center justify-between p-2 h-full">
          <div className={`w-8 h-8 rounded bg-gradient-to-r ${theme.primary}`} />
          <div className={`w-6 h-6 rounded bg-gradient-to-r ${theme.secondary}`} />
          <div className={`w-4 h-4 rounded bg-gradient-to-r ${theme.accent}`} />
        </div>
      </div>
      <p className="text-xs text-center text-gray-300 font-medium">{theme.name}</p>
      {isSelected && (
        <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Change Theme"
        >
          <Palette className="w-5 h-5 text-white" />
        </button>
        
        {isOpen && (
          <ResponsiveModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Theme Settings"
            size="lg"
          >
            <ThemeSelectorContent />
          </ResponsiveModal>
        )}
      </div>
    );
  }

  const ThemeSelectorContent = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'themes', label: 'Themes', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Settings },
          { id: 'custom', label: 'Custom', icon: Monitor }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md
              transition-all duration-200 text-sm font-medium
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          {Object.entries(themeCategories).map(([category, themeIds]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {themeIds.map(themeId => {
                  const theme = themes[themeId];
                  if (!theme) return null;
                  
                  return (
                    <ThemePreview
                      key={themeId}
                      theme={theme}
                      isSelected={currentTheme === themeId}
                      onClick={() => setTheme(themeId)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${fontSize === size.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <div className={`font-medium ${
                    size.value === 'sm' ? 'text-sm' :
                    size.value === 'md' ? 'text-base' :
                    size.value === 'lg' ? 'text-lg' : 'text-xl'
                  }`}>
                    Aa
                  </div>
                  <div className="text-xs mt-1">{size.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Font Family
            </label>
            <div className="space-y-2">
              {fontFamilies.map(font => (
                <button
                  key={font.value}
                  onClick={() => setFontFamily(font.value)}
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all duration-200
                    ${fontFamily === font.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }
                  `}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Custom Colors
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-600 bg-transparent cursor-pointer"
              />
              <ResponsiveButton
                onClick={handleCustomColorAdd}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Add Color
              </ResponsiveButton>
            </div>
            
            {customColors.length > 0 && (
              <div className="grid grid-cols-6 gap-2">
                {customColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomColors(customColors.filter((_, i) => i !== index))}
                    className="w-12 h-12 rounded-lg border-2 border-gray-600 hover:border-red-500 transition-colors"
                    style={{ backgroundColor: color }}
                    title="Click to remove"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <ResponsiveButton
        onClick={() => setIsOpen(true)}
        variant="secondary"
        icon={Palette}
        className="gap-2"
      >
        {showLabel && 'Theme'}
      </ResponsiveButton>

      <ResponsiveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Theme Settings"
        size="xl"
      >
        <ThemeSelectorContent />
      </ResponsiveModal>
    </div>
  );
};

export default ThemeSelector;
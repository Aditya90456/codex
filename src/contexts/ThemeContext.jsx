import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Predefined themes
export const themes = {
  default: {
    name: 'Default Dark',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-cyan-500 to-blue-500',
    background: 'from-gray-950 via-gray-900 to-gray-950',
    card: 'from-gray-800 to-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    editorTheme: 'vs-dark'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-500 to-teal-500',
    accent: 'from-blue-400 to-cyan-400',
    background: 'from-slate-950 via-blue-950 to-slate-950',
    card: 'from-slate-800 to-blue-900',
    text: 'text-white',
    textSecondary: 'text-blue-200',
    border: 'border-blue-700',
    editorTheme: 'vs-dark'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-red-500 to-pink-500',
    accent: 'from-yellow-500 to-orange-500',
    background: 'from-gray-950 via-orange-950 to-gray-950',
    card: 'from-gray-800 to-orange-900',
    text: 'text-white',
    textSecondary: 'text-orange-200',
    border: 'border-orange-700',
    editorTheme: 'vs-dark'
  },
  forest: {
    name: 'Forest Green',
    primary: 'from-green-500 to-emerald-500',
    secondary: 'from-emerald-500 to-teal-500',
    accent: 'from-lime-500 to-green-500',
    background: 'from-gray-950 via-green-950 to-gray-950',
    card: 'from-gray-800 to-green-900',
    text: 'text-white',
    textSecondary: 'text-green-200',
    border: 'border-green-700',
    editorTheme: 'vs-dark'
  },
  purple: {
    name: 'Purple Haze',
    primary: 'from-purple-500 to-violet-500',
    secondary: 'from-violet-500 to-fuchsia-500',
    accent: 'from-purple-400 to-pink-400',
    background: 'from-gray-950 via-purple-950 to-gray-950',
    card: 'from-gray-800 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    border: 'border-purple-700',
    editorTheme: 'vs-dark'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: 'from-pink-500 to-cyan-500',
    secondary: 'from-cyan-500 to-purple-500',
    accent: 'from-yellow-400 to-pink-500',
    background: 'from-black via-purple-950 to-black',
    card: 'from-gray-900 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-cyan-300',
    border: 'border-pink-500',
    editorTheme: 'vs-dark'
  },
  light: {
    name: 'Light Mode',
    primary: 'from-blue-600 to-indigo-600',
    secondary: 'from-indigo-600 to-purple-600',
    accent: 'from-cyan-600 to-blue-600',
    background: 'from-gray-50 via-white to-gray-50',
    card: 'from-white to-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300',
    editorTheme: 'vs'
  },
  dracula: {
    name: 'Dracula',
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-pink-600 to-red-600',
    accent: 'from-cyan-500 to-purple-500',
    background: 'from-[#282a36] via-[#1e1f29] to-[#282a36]',
    card: 'from-[#44475a] to-[#282a36]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#6272a4]',
    border: 'border-[#44475a]',
    editorTheme: 'vs-dark'
  },
  monokai: {
    name: 'Monokai',
    primary: 'from-green-500 to-lime-500',
    secondary: 'from-yellow-500 to-orange-500',
    accent: 'from-pink-500 to-purple-500',
    background: 'from-[#272822] via-[#1e1f1c] to-[#272822]',
    card: 'from-[#3e3d32] to-[#272822]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#75715e]',
    border: 'border-[#3e3d32]',
    editorTheme: 'vs-dark'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customColors, setCustomColors] = useState(null);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('mono');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    const savedCustomColors = localStorage.getItem('customColors');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
  }, []);

  // Save theme to localStorage
  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('userTheme', themeName);
    setCustomColors(null);
    localStorage.removeItem('customColors');
  };

  // Save custom colors
  const setCustomTheme = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
    setCurrentTheme('custom');
  };

  // Change font size
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  // Change font family
  const changeFontFamily = (family) => {
    setFontFamily(family);
    localStorage.setItem('fontFamily', family);
  };

  const theme = customColors || themes[currentTheme] || themes.default;

  const value = {
    theme,
    currentTheme,
    changeTheme,
    setCustomTheme,
    themes,
    fontSize,
    changeFontSize,
    fontFamily,
    changeFontFamily
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

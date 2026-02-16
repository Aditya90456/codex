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
    category: 'Professional',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-cyan-500 to-blue-500',
    background: 'from-gray-950 via-gray-900 to-gray-950',
    card: 'from-gray-800 to-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  ocean: {
    name: 'Ocean Blue',
    category: 'Nature',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-500 to-teal-500',
    accent: 'from-blue-400 to-cyan-400',
    background: 'from-slate-950 via-blue-950 to-slate-950',
    card: 'from-slate-800 to-blue-900',
    text: 'text-white',
    textSecondary: 'text-blue-200',
    border: 'border-blue-700',
    editorTheme: 'vs-dark',
    pattern: 'waves'
  },
  sunset: {
    name: 'Sunset Orange',
    category: 'Nature',
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-red-500 to-pink-500',
    accent: 'from-yellow-500 to-orange-500',
    background: 'from-gray-950 via-orange-950 to-gray-950',
    card: 'from-gray-800 to-orange-900',
    text: 'text-white',
    textSecondary: 'text-orange-200',
    border: 'border-orange-700',
    editorTheme: 'vs-dark',
    pattern: 'gradient'
  },
  forest: {
    name: 'Forest Green',
    category: 'Nature',
    primary: 'from-green-500 to-emerald-500',
    secondary: 'from-emerald-500 to-teal-500',
    accent: 'from-lime-500 to-green-500',
    background: 'from-gray-950 via-green-950 to-gray-950',
    card: 'from-gray-800 to-green-900',
    text: 'text-white',
    textSecondary: 'text-green-200',
    border: 'border-green-700',
    editorTheme: 'vs-dark',
    pattern: 'dots'
  },
  purple: {
    name: 'Purple Haze',
    category: 'Creative',
    primary: 'from-purple-500 to-violet-500',
    secondary: 'from-violet-500 to-fuchsia-500',
    accent: 'from-purple-400 to-pink-400',
    background: 'from-gray-950 via-purple-950 to-gray-950',
    card: 'from-gray-800 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    border: 'border-purple-700',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    category: 'Gaming',
    primary: 'from-pink-500 to-cyan-500',
    secondary: 'from-cyan-500 to-purple-500',
    accent: 'from-yellow-400 to-pink-500',
    background: 'from-black via-purple-950 to-black',
    card: 'from-gray-900 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-cyan-300',
    border: 'border-pink-500',
    editorTheme: 'vs-dark',
    pattern: 'grid',
    glow: true
  },
  light: {
    name: 'Light Mode',
    category: 'Professional',
    primary: 'from-blue-600 to-indigo-600',
    secondary: 'from-indigo-600 to-purple-600',
    accent: 'from-cyan-600 to-blue-600',
    background: 'from-gray-50 via-white to-gray-50',
    card: 'from-white to-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300',
    editorTheme: 'vs',
    pattern: 'none'
  },
  dracula: {
    name: 'Dracula',
    category: 'Popular',
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-pink-600 to-red-600',
    accent: 'from-cyan-500 to-purple-500',
    background: 'from-[#282a36] via-[#1e1f29] to-[#282a36]',
    card: 'from-[#44475a] to-[#282a36]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#6272a4]',
    border: 'border-[#44475a]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  monokai: {
    name: 'Monokai',
    category: 'Popular',
    primary: 'from-green-500 to-lime-500',
    secondary: 'from-yellow-500 to-orange-500',
    accent: 'from-pink-500 to-purple-500',
    background: 'from-[#272822] via-[#1e1f1c] to-[#272822]',
    card: 'from-[#3e3d32] to-[#272822]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#75715e]',
    border: 'border-[#3e3d32]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  github: {
    name: 'GitHub Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-gray-600 to-gray-700',
    accent: 'from-green-500 to-green-600',
    background: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    card: 'from-[#21262d] to-[#161b22]',
    text: 'text-[#f0f6fc]',
    textSecondary: 'text-[#7d8590]',
    border: 'border-[#30363d]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  vscode: {
    name: 'VS Code Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-purple-500 to-purple-600',
    accent: 'from-orange-500 to-orange-600',
    background: 'from-[#1e1e1e] via-[#252526] to-[#1e1e1e]',
    card: 'from-[#2d2d30] to-[#252526]',
    text: 'text-[#cccccc]',
    textSecondary: 'text-[#969696]',
    border: 'border-[#3e3e42]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  neon: {
    name: 'Neon Nights',
    category: 'Gaming',
    primary: 'from-pink-400 to-purple-500',
    secondary: 'from-purple-500 to-blue-500',
    accent: 'from-cyan-400 to-pink-400',
    background: 'from-black via-gray-900 to-black',
    card: 'from-gray-900 to-black',
    text: 'text-white',
    textSecondary: 'text-pink-300',
    border: 'border-pink-500',
    editorTheme: 'vs-dark',
    pattern: 'grid',
    glow: true,
    animation: 'pulse'
  },
  matrix: {
    name: 'Matrix',
    category: 'Gaming',
    primary: 'from-green-400 to-green-500',
    secondary: 'from-green-500 to-green-600',
    accent: 'from-lime-400 to-green-400',
    background: 'from-black via-green-950 to-black',
    card: 'from-gray-900 to-green-950',
    text: 'text-green-400',
    textSecondary: 'text-green-600',
    border: 'border-green-500',
    editorTheme: 'vs-dark',
    pattern: 'matrix',
    glow: true
  },
  retro: {
    name: 'Retro Wave',
    category: 'Retro',
    primary: 'from-pink-500 to-purple-600',
    secondary: 'from-purple-600 to-blue-600',
    accent: 'from-cyan-400 to-pink-500',
    background: 'from-purple-900 via-pink-900 to-purple-900',
    card: 'from-purple-800 to-pink-800',
    text: 'text-white',
    textSecondary: 'text-pink-200',
    border: 'border-pink-400',
    editorTheme: 'vs-dark',
    pattern: 'retro-grid',
    glow: true
  },
  terminal: {
    name: 'Terminal Green',
    category: 'Retro',
    primary: 'from-green-500 to-green-600',
    secondary: 'from-green-600 to-green-700',
    accent: 'from-lime-400 to-green-500',
    background: 'from-black via-gray-900 to-black',
    card: 'from-gray-900 to-black',
    text: 'text-green-400',
    textSecondary: 'text-green-600',
    border: 'border-green-500',
    editorTheme: 'vs-dark',
    pattern: 'scanlines'
  },
  minimal: {
    name: 'Minimal White',
    category: 'Professional',
    primary: 'from-gray-800 to-gray-900',
    secondary: 'from-gray-700 to-gray-800',
    accent: 'from-blue-500 to-blue-600',
    background: 'from-white via-gray-50 to-white',
    card: 'from-gray-50 to-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    editorTheme: 'vs',
    pattern: 'none'
  },
  nord: {
    name: 'Nord',
    category: 'Popular',
    primary: 'from-blue-400 to-blue-500',
    secondary: 'from-indigo-400 to-indigo-500',
    accent: 'from-cyan-400 to-blue-400',
    background: 'from-[#2e3440] via-[#3b4252] to-[#2e3440]',
    card: 'from-[#434c5e] to-[#3b4252]',
    text: 'text-[#eceff4]',
    textSecondary: 'text-[#d8dee9]',
    border: 'border-[#4c566a]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  solarized: {
    name: 'Solarized Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-500 to-green-500',
    accent: 'from-yellow-500 to-orange-500',
    background: 'from-[#002b36] via-[#073642] to-[#002b36]',
    card: 'from-[#073642] to-[#002b36]',
    text: 'text-[#839496]',
    textSecondary: 'text-[#586e75]',
    border: 'border-[#073642]',
    editorTheme: 'vs-dark',
    pattern: 'none'
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

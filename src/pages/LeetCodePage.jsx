import { useEffect } from 'react';
import ThemedLeetCodeEditor from '../components/LeetCode/ThemedLeetCodeEditor';
import { ThemeProvider } from '../contexts/ThemeContext';

const LeetCodePage = () => {
  useEffect(() => {
    document.title = 'LeetCode Practice | CP-AI';
  }, []);

  return (
    <ThemeProvider>
      <div className="w-full h-screen overflow-hidden">
        <ThemedLeetCodeEditor />
      </div>
    </ThemeProvider>
  );
};

export default LeetCodePage;

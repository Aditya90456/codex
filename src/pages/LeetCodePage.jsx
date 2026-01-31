import { useEffect } from 'react';
import LeetCodeEditor from '../components/LeetCodeEditor';

const LeetCodePage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'LeetCode Practice | CP-AI';
  }, []);

  return (
    <div className="w-full h-screen">
      <LeetCodeEditor />
    </div>
  );
};

export default LeetCodePage;

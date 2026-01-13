import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleViewer from '../components/Articles/ArticleViewer';

const ArticlesPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <ArticleViewer onBack={handleBack} />;
};

export default ArticlesPage;
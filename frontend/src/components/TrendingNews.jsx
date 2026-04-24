import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TrendingNews = ({ onAskAboutArticle }) => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/api/trending`);
        if (!response.ok) {
          throw new Error(`Failed to fetch trending news: ${response.status}`);
        }
        
        const data = await response.json();
        setTrendingNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingNews();
  }, []);

  const handleCardClick = (title) => {
    const query = `Explain this news: ${title}`;
    onAskAboutArticle(query);
  };

  const truncateSummary = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  };

  if (error) {
    return (
      <div className="trending-error">
        Couldn't load latest stories. Try refreshing.
      </div>
    );
  }

  return (
    <div className="trending-section">
      <div className="trending-header">
        <div className="trending-label">
          <span className="live-dot"></span>
          LIVE <span className="separator">·</span> LATEST TECH NEWS
        </div>
      </div>
      
      <div className="trending-cards">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="trending-card skeleton">
              <div className="skeleton-content">
                <div className="skeleton-source"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-snippet"></div>
              </div>
            </div>
          ))
        ) : (
          trendingNews.map((article, index) => (
            <TrendingCard 
              key={index} 
              article={article} 
              onCardClick={handleCardClick}
              truncateSummary={truncateSummary}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TrendingCard = ({ article, onCardClick, truncateSummary }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'AI': '#3b82f6',
      'GADGETS': '#10b981', 
      'STARTUPS': '#f59e0b',
      'CYBERSECURITY': '#ef4444',
      'EV': '#8b5cf6',
      'SPACE': '#06b6d4',
      'TECH': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div 
      className="trending-card"
      onClick={() => onCardClick(article.title)}
    >
      <div className="trending-content">
        <div className="trending-meta">
          <span 
            className="trending-category" 
            style={{ backgroundColor: getCategoryColor(article.category) }}
          >
            {article.category}
          </span>
          <span className="trending-source">{article.source}</span>
          <span className="trending-date">{article.published_date}</span>
        </div>
        <h3 className="trending-title">{article.title}</h3>
        <p className="trending-snippet">{truncateSummary(article.snippet)}</p>
      </div>
    </div>
  );
};

export default TrendingNews;

import React from 'react';

const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Convert **bold** to <strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert newlines to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
};

const ResultCard = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="result-card loading">
        <div className="loading-spinner"></div>
        <p>Analyzing latest signals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-card error">
        <div className="error-icon">!</div>
        <h3>Unable to fetch data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="result-card">
      <div className="result-header">
        <h2 className="result-query">Summary for: {data.query}</h2>
        <div className="result-meta">
          {data.cached && <span className="badge cached">Cached</span>}
          {data.response_time && (
            <span className="response-time">{data.response_time}s</span>
          )}
        </div>
      </div>
      
      <div className="result-content">
        <div className="summary-section">
          <h3>Summary</h3>
          <div className="summary-text">
            <div dangerouslySetInnerHTML={{ 
              __html: parseMarkdown(data.summary || 'No summary available') 
            }} />
          </div>
        </div>
        
        {data.sources && data.sources.length > 0 && (
          <div className="sources-section">
            <h3>Sources ({data.sources.length})</h3>
            <ul className="sources-list">
              {data.sources.map((source, index) => (
                <li key={index} className="source-item">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title || source.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

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

const ResultCard = ({ data, isLoading, error, readingMode, onFollowUpClick }) => {
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

  // Parse structured JSON response if available
  let structuredData = null;
  if (data && data.summary) {
    try {
      // Check if summary is a JSON string
      if (typeof data.summary === 'string' && data.summary.trim().startsWith('{')) {
        structuredData = JSON.parse(data.summary);
      }
    } catch (e) {
      // If parsing fails, fall back to treating it as plain text
    }
  }

  const getReadingModeLabel = (mode) => {
    const modes = {
      'brief': '⚡ Brief',
      'explained': '🧠 Explained', 
      'critical': '🔍 Critical'
    };
    return modes[mode] || '⚡ Brief';
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-meta">
          {readingMode && <span className="badge reading-mode">{getReadingModeLabel(readingMode)}</span>}
          {data.cached && <span className="badge cached">Cached</span>}
          {data.response_time && (
            <span className="response-time">{data.response_time}s</span>
          )}
        </div>
      </div>
      
      <div className="result-content">
        {structuredData ? (
          // Structured JSON response
          <>
            {structuredData.headline && (
              <div className="headline-section">
                <h2 className="headline">{structuredData.headline}</h2>
              </div>
            )}
            
            {structuredData.summary && (
              <div className="summary-section">
                <div className="summary-text">
                  <div dangerouslySetInnerHTML={{ 
                    __html: parseMarkdown(structuredData.summary) 
                  }} />
                </div>
              </div>
            )}
            
            {structuredData.key_players && structuredData.key_players.length > 0 && (
              <div className="key-players-section">
                <h4>Key Players</h4>
                <div className="key-players-chips">
                  {structuredData.key_players.map((player, index) => (
                    <span key={index} className="player-chip">{player}</span>
                  ))}
                </div>
              </div>
            )}
            
            {structuredData.why_it_matters && (
              <div className="why-it-matters-section">
                <h4>Why it matters</h4>
                <div className="why-it-matters-content">
                  <div dangerouslySetInnerHTML={{ 
                    __html: parseMarkdown(structuredData.why_it_matters) 
                  }} />
                </div>
              </div>
            )}
            
            {structuredData.follow_up_question && (
              <div className="follow-up-section">
                <button 
                  className="follow-up-chip"
                  onClick={() => onFollowUpClick && onFollowUpClick(structuredData.follow_up_question)}
                >
                  💭 {structuredData.follow_up_question}
                </button>
              </div>
            )}
          </>
        ) : (
          // Fallback to plain text response
          <div className="summary-section">
            <div className="summary-text">
              <div dangerouslySetInnerHTML={{ 
                __html: parseMarkdown(data.summary || 'No summary available') 
              }} />
            </div>
          </div>
        )}
        
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

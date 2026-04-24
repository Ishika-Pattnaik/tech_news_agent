import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import TrendingNews from './components/TrendingNews';
import './styles.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readingMode, setReadingMode] = useState('brief');
  const [query, setQuery] = useState('');

  const readingModes = [
    { id: 'brief', label: '⚡ Brief', icon: '⚡' },
    { id: 'explained', label: '🧠 Explained', icon: '🧠' },
    { id: 'critical', label: '🔍 Critical', icon: '🔍' }
  ];

  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/summarize?query=${encodeURIComponent(searchQuery)}&reading_mode=${readingMode}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (followUpQuestion) => {
    setQuery(followUpQuestion);
    // Auto-focus the input after setting the query
    setTimeout(() => {
      const inputElement = document.querySelector('.search-input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const handleAskAboutArticle = (query) => {
    setQuery(query);
    // Auto-focus the input after setting the query
    setTimeout(() => {
      const inputElement = document.querySelector('.search-input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const handleReadingModeChange = (newMode) => {
    setReadingMode(newMode);
    // If there's an existing result, regenerate it with new mode
    if (result && query) {
      regenerateSummary(query, newMode);
    }
  };

  const regenerateSummary = async (searchQuery, mode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/summarize?query=${encodeURIComponent(searchQuery)}&reading_mode=${mode}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to regenerate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Techno AI</h1>
          <p>Real-time AI-powered tech intelligence</p>
        </header>

        <main className="main">
          <div className="hero-section">
            <div className="reading-mode-selector">
              {readingModes.map((mode) => (
                <button
                  key={mode.id}
                  className={`mode-tab ${readingMode === mode.id ? 'active' : ''}`}
                  onClick={() => handleReadingModeChange(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading} 
              query={query}
              setQuery={setQuery}
            />
          </div>
          
          <div className="secondary-section">
            {!result && !isLoading && <TrendingNews onAskAboutArticle={handleAskAboutArticle} />}
            {(result || isLoading) && (
              <ResultCard 
                data={result} 
                isLoading={isLoading} 
                error={error} 
                readingMode={readingMode}
                onFollowUpClick={handleFollowUpClick}
              />
            )}
          </div>
        </main>

        <footer className="footer">
          <p>Powered by Tavily Search & Mistral AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

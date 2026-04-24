import React, { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import TrendingNews from './components/TrendingNews';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readingMode, setReadingMode] = useState('brief');
  const [query, setQuery] = useState('');
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showClearButton, setShowClearButton] = useState(false);
  
  const placeholders = [
    "Ask about latest AI news...",
    "What's happening in Silicon Valley?",
    "Latest developments in quantum computing...",
    "Explain the OpenAI vs Anthropic rivalry...",
    "What happened in tech this week?",
    "Latest startup funding rounds..."
  ];
  
  const exampleQueries = [
    "Latest AI breakthroughs today",
    "What happened in Silicon Valley this week?",
    "Explain the OpenAI vs Anthropic rivalry"
  ];
  
  const scrollRef = useRef(null);

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyHeader(scrollY > 100);
      setShowBackToTop(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear button visibility
  useEffect(() => {
    setShowClearButton(query.length > 0);
  }, [query]);

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
      const response = await fetch(`${API_BASE}/summarize?query=${encodeURIComponent(searchQuery)}&reading_mode=${readingMode}`);
      
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

  const handleClear = () => {
    setQuery('');
    setShowClearButton(false);
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    // Auto-focus the input
    setTimeout(() => {
      const inputElement = document.querySelector('.search-input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const response = await fetch(`${API_BASE}/summarize?query=${encodeURIComponent(searchQuery)}&reading_mode=${mode}`);
      
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
      {/* Sticky Header */}
      <div className={`sticky-header ${showStickyHeader ? 'visible' : ''}`}>
        <div className="sticky-header-content">
          <h1>Techno AI</h1>
          <div className="sticky-search">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading} 
              query={query}
              setQuery={setQuery}
              placeholder={placeholders[placeholderIndex]}
              showClear={showClearButton}
              onClear={handleClear}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>

      <div className="container">
        <header className="header">
          <h1>Techno AI</h1>
          <p>Your AI agent for real-time tech news intelligence</p>
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="example-chips">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                className="example-chip"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
          
          <div className="reading-mode-selector" data-active={readingModes.findIndex(m => m.id === readingMode)}>
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
            placeholder={placeholders[placeholderIndex]}
            showClear={showClearButton}
            onClear={handleClear}
          />
        </div>
        
        <main className="main">
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

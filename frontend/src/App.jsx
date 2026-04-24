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
  const [showHelpBanner, setShowHelpBanner] = useState(false);
  
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
    // Set query and immediately trigger search
    setQuery(followUpQuestion);
    handleSearch(followUpQuestion);
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
          <div className="header-content">
            <div className="header-text">
              <h1>Techno AI</h1>
              <p>Your AI agent for real-time tech news intelligence</p>
            </div>
            <button 
              className="help-icon"
              onClick={() => setShowHelpBanner(!showHelpBanner)}
              aria-label="Help"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 9h6a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1h3a1 1 0 0 0 0-2H7a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v1a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Help Banner */}
        {showHelpBanner && (
          <div className="help-banner">
            <button 
              className="help-banner-close"
              onClick={() => setShowHelpBanner(false)}
              aria-label="Close help"
            >
              ×
            </button>
            <div className="help-banner-content">
              <h2>How Techno AI Works</h2>
              <p>Techno AI connects to live news sources and uses AI to summarize, explain, and analyze the latest in tech — so you get the signal, not the noise.</p>
              
              <div className="help-section">
                <h3>✦ Three modes to match how you think</h3>
                <div className="help-mode-list">
                  <div className="help-mode-item">
                    <span className="help-mode-icon">⚡</span>
                    <div>
                      <strong>Brief</strong> — Fast headline summaries for when you're short on time
                    </div>
                  </div>
                  <div className="help-mode-item">
                    <span className="help-mode-icon">🧠</span>
                    <div>
                      <strong>Explained</strong> — Deep dives that break down why something matters
                    </div>
                  </div>
                  <div className="help-mode-item">
                    <span className="help-mode-icon">🔍</span>
                    <div>
                      <strong>Critical</strong> — Balanced analysis with multiple perspectives
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="help-section">
                <h3>✦ Prompts that work best</h3>
                <div className="help-chips">
                  <button 
                    className="help-chip"
                    onClick={() => {
                      setQuery("What happened in AI this week?");
                      setShowHelpBanner(false);
                    }}
                  >
                    What happened in AI this week?
                  </button>
                  <button 
                    className="help-chip"
                    onClick={() => {
                      setQuery("Explain the latest Google I/O announcements");
                      setShowHelpBanner(false);
                    }}
                  >
                    Explain the latest Google I/O announcements
                  </button>
                  <button 
                    className="help-chip"
                    onClick={() => {
                      setQuery("What is the impact of the new EU AI Act?");
                      setShowHelpBanner(false);
                    }}
                  >
                    What is the impact of the new EU AI Act?
                  </button>
                  <button 
                    className="help-chip"
                    onClick={() => {
                      setQuery("Latest funding rounds in Silicon Valley");
                      setShowHelpBanner(false);
                    }}
                  >
                    Latest funding rounds in Silicon Valley
                  </button>
                  <button 
                    className="help-chip"
                    onClick={() => {
                      setQuery("How does the new Apple chip compare to Qualcomm?");
                      setShowHelpBanner(false);
                    }}
                  >
                    How does the new Apple chip compare to Qualcomm?
                  </button>
                </div>
              </div>
              
              <div className="help-section">
                <h3>✦ Tips</h3>
                <ul className="help-tips">
                  <li>Be specific — "Latest OpenAI news" works better than "AI news"</li>
                  <li>Click follow-up chips after each result to go deeper</li>
                  <li>Results sourced from Reuters, TechCrunch, Wired, Bloomberg and other established publications only</li>
                </ul>
              </div>
              
              <div className="help-footer">
                <p>Powered by Tavily real-time search + Mistral AI reasoning</p>
              </div>
            </div>
          </div>
        )}

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
          <div className="footer-content">
            <div className="footer-powered">
              <p>Powered by Tavily Search & Mistral AI</p>
            </div>
            <div className="footer-signature">
              <p>Crafted with ❤️ by <span className="dev-name">Techno AI Team</span></p>
              <p>© {new Date().getFullYear()} Techno AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

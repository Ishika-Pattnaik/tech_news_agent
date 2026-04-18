import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import './styles.css';

const API_BASE_URL = 'https://tech-news-agent-ofj9.onrender.com';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/summarize?query=${encodeURIComponent(query)}`);
      
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

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Techno AI</h1>
          <p>Real-time AI-powered tech intelligence</p>
        </header>

        <main className="main">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <ResultCard data={result} isLoading={isLoading} error={error} />
        </main>

        <footer className="footer">
          <p>Powered by Tavily Search & Mistral AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

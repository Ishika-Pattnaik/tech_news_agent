import React from 'react';

const SearchBar = ({ onSearch, isLoading, query, setQuery }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-container hero-search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about latest tech news..."
          className={`search-input ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="search-button"
        >
          {isLoading ? 'Analyzing...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

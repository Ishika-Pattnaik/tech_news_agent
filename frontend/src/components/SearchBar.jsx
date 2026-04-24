import React from 'react';

const SearchBar = ({ 
  onSearch, 
  isLoading, 
  query, 
  setQuery, 
  placeholder = "Ask anything about latest tech news...",
  showClear = false,
  onClear,
  compact = false
}) => {

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

  const handleClearClick = (e) => {
    e.preventDefault();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`search-container ${compact ? 'compact' : 'hero-search'}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={`search-input ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          />
          {showClear && (
            <button
              type="button"
              onClick={handleClearClick}
              className={`search-clear ${showClear ? 'visible' : ''}`}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
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

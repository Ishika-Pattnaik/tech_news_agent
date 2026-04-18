# Techno AI Frontend

A clean, minimal React frontend for Techno AI - real-time AI-powered tech intelligence.

## Features

- **Clean UI**: Dark minimal design with sharp typography
- **Real-time Intelligence**: Instant tech signal analysis
- **Loading States**: Visual feedback during data processing
- **Error Handling**: Graceful error display
- **Mobile Responsive**: Works perfectly on all devices
- **Keyboard Support**: Press Enter to search

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## API Integration

The frontend connects to your deployed API at:
```
https://tech-news-agent-ofj9.onrender.com
```

### API Endpoint Used
```
GET /summarize?query=<search_term>
```

### Search Capabilities
- AI developments and breakthroughs
- Startup funding and news
- Tech industry trends
- Product launches and updates

### Response Format
```json
{
  "query": "...",
  "summary": "...",
  "sources": [...],
  "cached": true/false,
  "response_time": "..."
}
```

## Project Structure

```
frontend/
src/
  components/
    SearchBar.jsx      # Search input and submit button
    ResultCard.jsx     # Display API results
  App.jsx             # Main app component
  styles.css          # All styling
public/
  index.html          # HTML template
package.json          # Dependencies and scripts
```

## Usage

1. Enter a tech topic in the search box (e.g., "AI startups", "blockchain technology")
2. Click "Search" or press Enter
3. View the AI-generated intelligence summary and sources
4. Click on sources to read full articles

## Customization

### Change API URL
Edit `src/App.jsx` and update the `API_BASE_URL`:
```javascript
const API_BASE_URL = 'your-api-url-here';
```

### Styling
All styles are in `src/styles.css`. Key sections:
- `.search-input` - Search field styling
- `.result-card` - Results display
- `.header` - App header
- Mobile responsive styles at bottom

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

## Tech Stack

- **React 18** - Modern functional components
- **CSS3** - Custom dark theme and animations
- **Vanilla JS** - No heavy UI libraries
- **Fetch API** - Simple HTTP requests

## Deployment Options

1. **Netlify**: Drag and drop the build folder
2. **Vercel**: Connect GitHub repository
3. **GitHub Pages**: Use `gh-pages` branch
4. **Any static host**: Upload build folder contents

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- **Bundle size**: ~50KB gzipped
- **Load time**: <2 seconds on 3G
- **Animations**: 60fps CSS transitions
- **Mobile optimized**: Touch-friendly interface

## Design Philosophy

Techno AI embodies:
- **Signal over noise**: Precise, relevant intelligence
- **Clarity over creativity**: Clean, functional interface
- **Function over decoration**: Minimal, focused design

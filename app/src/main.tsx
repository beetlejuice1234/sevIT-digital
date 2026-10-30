import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.tsx';
import { applyTheme, themeFor } from './lib/theme';

// The site used to run on hash routes (/#/services/web-design). Keep any old
// shared links working by moving them onto the real path before React boots.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

applyTheme(themeFor(window.location.pathname));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

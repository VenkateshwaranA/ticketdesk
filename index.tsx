
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setAccessToken } from './services/apiClient';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Capture token from redirect after OAuth if backend appends ?token=... or #token=...
try {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token') || new URLSearchParams(url.hash.replace(/^#/, '')).get('token');
  if (token) {
    setAccessToken(token);
    // Clean token from URL
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }
} catch {
  // ignore
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

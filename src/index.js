import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// // Register the service worker
// navigator.serviceWorker.register('/serviceWorker.js')
//   .then((registration) => {
//     console.log('Service Worker registered:', registration);
//   })
//   .catch((error) => {
//     console.log('Service Worker registration failed:', error);
//   });


// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register the service worker
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
} else {
  console.log('Service Worker is not supported in this browser.');
}

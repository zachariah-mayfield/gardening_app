// The index.js file is the entry point of your React application. 
// It's the first JavaScript file that gets executed when your app starts. 

import React from 'react';              // Core React library
import ReactDOM from 'react-dom/client'; // React DOM rendering
import './index.css';                   // Global styles
import App from './App';                // Main App component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Development mode wrapper for additional checks */}
    <App />
    {/* Main application component */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();  // Optional performance measurement

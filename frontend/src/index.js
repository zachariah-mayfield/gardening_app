// The index.js file is the entry point of your React application.
// It's the first JavaScript file that gets executed when your app starts.
//
// This file is responsible for rendering your main App component into the root HTML element.
// It also imports global styles and sets up performance measurement (optional).

import React from 'react'; // Core React library
import ReactDOM from 'react-dom/client'; // React DOM rendering
import './index.css'; // Global styles
import App from './App'; // Main App component
import reportWebVitals from './reportWebVitals';

// Create a root for React to render into. This targets the <div id="root"></div> in public/index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Development mode wrapper for additional checks */}
    <App />
    {/* Main application component */}
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Optional performance measurement

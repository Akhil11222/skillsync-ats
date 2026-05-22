import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import BuilderPage from './pages/BuilderPage';
import ExportPage from './pages/ExportPage';

export const App = () => {
  // Theme State with local storage and media query synchronization
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Sync theme attribute to Document Element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Persistent Glassmorphic Header */}
          <Header theme={theme} toggleTheme={toggleTheme} />
          
          {/* Main Routing Context */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzerPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
          
          {/* Persistent Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

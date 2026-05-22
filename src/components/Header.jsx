import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ScanText, Sun, Moon, Share2, CheckCircle2 } from 'lucide-react';

export const Header = ({ theme, toggleTheme }) => {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <>
      <header className="app-header">
        {/* Clickable Brand Logo */}
        <Link to="/" className="logo-container">
          <ScanText className="logo-icon" />
          <h1 className="logo-text">
            Skill<span>Sync</span>
          </h1>
        </Link>

        {/* Navigation Routes */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/analyze" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Analyzer
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/builder" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Builder
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/export" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Export
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Global Toolbar Actions */}
        <div className="header-actions">
          {/* Share Action */}
          <button 
            className="theme-toggle-btn"
            onClick={handleShare}
            aria-label="Share this tool"
          >
            <Share2 size={18} />
            <span>Share Link</span>
          </button>

          {/* Theme Toggler */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={18} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Floating Toast Notice */}
      {showToast && (
        <div className="share-toast">
          <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>App link copied to clipboard!</span>
        </div>
      )}
    </>
  );
};

export default Header;

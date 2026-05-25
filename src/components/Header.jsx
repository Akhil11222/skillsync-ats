import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ScanText, Sun, Moon, Share2, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';

export const Header = ({ theme, toggleTheme }) => {
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="app-header">
        {/* Clickable Brand Logo */}
        <Link to="/" className="logo-container" onClick={closeMenu}>
          <ScanText className="logo-icon" />
          <h1 className="logo-text">
            Skill<span>Sync</span>
          </h1>
        </Link>

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation & Actions Wrapper (Responsive Drawer) */}
        <div className={`nav-container-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <nav className="header-nav">
            <ul className="nav-links">
              <li>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/analyze" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Analyzer
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/builder" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Builder
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/auto-build" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} special-nav-link`}
                  onClick={closeMenu}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>AI Builder</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/export" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
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
              onClick={() => { handleShare(); closeMenu(); }}
              aria-label="Share this tool"
            >
              <Share2 size={18} />
              <span>Share Link</span>
            </button>

            {/* Theme Toggler */}
            <button 
              className="theme-toggle-btn" 
              onClick={() => { toggleTheme(); closeMenu(); }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={18} />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
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

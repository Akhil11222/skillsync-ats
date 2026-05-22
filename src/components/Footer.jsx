import React from 'react';
import { Heart, Code2 } from 'lucide-react';

export const Footer = () => {
  const handleLinkClick = (e, feature) => {
    e.preventDefault();
    alert(`${feature} details will be configured in production.`);
  };

  return (
    <footer className="app-footer">
      {/* Copyright info */}
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} SkillSync Analytics. All rights reserved.
      </div>

      {/* Helpful links */}
      <ul className="footer-links">
        <li>
          <a href="#how" className="footer-link" onClick={(e) => handleLinkClick(e, 'How It Works')}>
            How It Works
          </a>
        </li>
        <li>
          <a href="#privacy" className="footer-link" onClick={(e) => handleLinkClick(e, 'Privacy Policy')}>
            Privacy Policy
          </a>
        </li>
      </ul>

      {/* Signature branding */}
      <div className="footer-brand">
        <Code2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
        Built with <Heart size={12} style={{ display: 'inline', fill: 'var(--color-danger)', color: 'var(--color-danger)', verticalAlign: 'middle' }} /> by <span>Akhil Tiwari</span>
      </div>
    </footer>
  );
};

export default Footer;

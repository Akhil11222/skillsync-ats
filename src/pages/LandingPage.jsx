import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, Sliders, Download, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Banner */}
      <section className="landing-hero">
        <div className="hero-tag">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          <span>Next-Generation Resume Optimizer</span>
        </div>
        <h2 className="hero-title">
          Beat the Bots.<br />Land the Interview.
        </h2>
        <p className="hero-sub">
          Analyze your resume against any job description and build an ATS-optimized layout in minutes.
        </p>
        <div className="hero-cta">
          <Link to="/analyze" className="theme-toggle-btn btn-primary" style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', gap: '0.75rem' }}>
            <span>Start Free Analysis</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 3-Column Features Grid */}
      <section className="features-grid">
        {/* Feature 1: ATS Analyzer */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Cpu size={24} />
          </div>
          <h3 className="feature-title">Real-Time ATS Analyzer</h3>
          <p className="feature-text">
            Compare your resume side-by-side with target job descriptions. See matched and missing keywords highlighted in-line instantly as you type.
          </p>
        </div>

        {/* Feature 2: Smart Resume Builder */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Sliders size={24} />
          </div>
          <h3 className="feature-title">Smart Resume Builder</h3>
          <p className="feature-text">
            Fill out form categories while checking off critical keywords. The JD Sync sidebar strikes through terms automatically as they are entered.
          </p>
        </div>

        {/* Feature 3: PDF Template Exporter */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Download size={24} />
          </div>
          <h3 className="feature-title">Perfect PDF Exporter</h3>
          <p className="feature-text">
            Render your data into corporate executive and modern templates. Export clean A4 papers designed to bypass screening bots.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

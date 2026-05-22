import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Workspace from '../components/Workspace';
import Dashboard from '../components/Dashboard';
import { Lightbulb, Info, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

export const AnalyzerPage = () => {
  const {
    jobDescription,
    setJobDescription,
    resume,
    setResume,
    analysis,
    loadAllSampleData,
    clearAllData
  } = useContext(AppContext);

  return (
    <div className="analyzer-page">
      {/* Information Header & Actions */}
      <section className="info-section">
        <h2 className="info-title">
          <Lightbulb size={20} className="info-item-icon" />
          <span>Optimize Your Resume Instantly</span>
        </h2>
        <ul className="info-list">
          <li className="info-item">
            <Info size={16} className="info-item-icon" />
            <span>Paste your target Job Description (left) and your current Resume (right) to run real-time keyword analysis.</span>
          </li>
          <li className="info-item">
            <Info size={16} className="info-item-icon" />
            <span>The system sanitizes input, ignores English stop-words, and isolates specific skills (e.g. C++, React.js, Git).</span>
          </li>
          <li className="info-item">
            <Info size={16} className="info-item-icon" />
            <span>Verify your score instantly and add the suggested "Missing Skills" badges to optimize your ATS visibility.</span>
          </li>
        </ul>

        {/* Quick Actions Container */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button
            onClick={loadAllSampleData}
            className="theme-toggle-btn btn-primary"
            style={{ padding: '0.6rem 1.2rem', gap: '0.5rem' }}
          >
            <RefreshCw size={16} />
            <span>Load Sample Data</span>
          </button>
          <button
            onClick={clearAllData}
            className="theme-toggle-btn btn-secondary"
            style={{ padding: '0.6rem 1.2rem', gap: '0.5rem' }}
          >
            <Trash2 size={16} />
            <span>Clear Workspace</span>
          </button>
        </div>
      </section>

      {/* Side-by-Side Editor Panels with In-Line Highlighting */}
      <Workspace
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        resume={resume}
        setResume={setResume}
        matchedKeywordsSet={
          new Set(
            (analysis.matchedKeywords || []).map(k =>
              k.toLowerCase()
                .replace(/c\+\+/g, 'cplusplus')
                .replace(/c#/g, 'csharp')
                .replace(/\.net/g, 'dotnet')
                .replace(/\b(react|node|vue|d3|next|nuxt|nest)\.js\b/g, '$1js')
                .replace(/[^a-z0-9]/g, '')
            )
          )
        }
      />

      {/* Dashboard Analytics Report */}
      <Dashboard analysis={analysis} />

      {/* Primary Navigation CTA */}
      {analysis.totalKeywordsCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
          <Link 
            to="/builder" 
            className="theme-toggle-btn btn-primary" 
            style={{ padding: '0.8rem 2.5rem', fontSize: '1.05rem', gap: '0.75rem', borderRadius: '50px' }}
          >
            <span>Build Optimized Resume</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnalyzerPage;

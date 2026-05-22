import React from 'react';
import { AreaChart, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export const Dashboard = ({ analysis }) => {
  const { score, matchedKeywords, missingKeywords, totalKeywordsCount } = analysis;

  // Circular SVG configuration
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // Approx 439.82
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Determine feedback text & color based on score
  const getScoreFeedback = () => {
    if (totalKeywordsCount === 0) {
      return {
        text: 'Awaiting Input',
        color: 'var(--text-muted)',
        desc: 'Paste a job description to extract target skills.'
      };
    }
    if (score < 40) {
      return {
        text: 'Needs Optimization',
        color: 'var(--color-danger)',
        desc: 'Focus on adding the critical missing skills highlighted in red below.'
      };
    }
    if (score <= 70) {
      return {
        text: 'Good Match Potential',
        color: 'var(--color-warning)',
        desc: 'Strong foundation. Integrate a few more missing key terms to pass screening.'
      };
    }
    return {
      text: 'ATS Optimised',
      color: 'var(--color-success)',
      desc: 'Excellent keyword density. Your resume matches the job profile requirements.'
    };
  };

  const feedback = getScoreFeedback();

  const getScoreColor = () => {
    if (totalKeywordsCount === 0) return 'var(--border-color)';
    if (score < 40) return 'var(--color-danger)';
    if (score <= 70) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <AreaChart className="dashboard-icon" />
          <span>Real-Time Analytics Dashboard</span>
        </h2>
        {totalKeywordsCount > 0 && (
          <button 
            onClick={handlePrint}
            className="theme-toggle-btn btn-secondary"
            style={{ padding: '0.6rem 1.2rem', gap: '0.5rem' }}
          >
            <Printer size={16} />
            <span>Print ATS Report</span>
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Left: SVG Match Ring */}
        <div className="score-section">
          <div className="svg-ring-container">
            <svg width="180" height="180">
              <circle
                className="svg-ring-bg"
                cx="90"
                cy="90"
                r={radius}
              />
              <circle
                className="svg-ring-progress"
                cx="90"
                cy="90"
                r={radius}
                stroke={getScoreColor()}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="score-text-overlay">
              <span className="score-value">{score}%</span>
              <span className="score-label">ATS Score</span>
            </div>
          </div>
          <div>
            <div 
              className="match-feedback" 
              style={{ color: feedback.color }}
            >
              {feedback.text}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {feedback.desc}
            </p>
          </div>
        </div>

        {/* Right: Skill Badges */}
        <div className="skills-section">
          {/* Matched Skills */}
          <div className="skills-category">
            <h3 className="category-title">
              <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
              <span>Matched Skills</span>
              {matchedKeywords.length > 0 && (
                <span className="category-badge-count">{matchedKeywords.length}</span>
              )}
            </h3>
            <div className="badges-container">
              {matchedKeywords.length > 0 ? (
                matchedKeywords.map((skill, idx) => (
                  <span key={`matched-${idx}`} className="badge badge-matched">
                    {skill}
                  </span>
                ))
              ) : (
                <div className="badges-placeholder">
                  {totalKeywordsCount === 0 
                    ? 'Fill out the workspaces to check matches.' 
                    : 'No skills matched yet. Refine your resume details.'}
                </div>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="skills-category">
            <h3 className="category-title">
              <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />
              <span>Missing Skills</span>
              {missingKeywords.length > 0 && (
                <span className="category-badge-count">{missingKeywords.length}</span>
              )}
            </h3>
            <div className="badges-container">
              {missingKeywords.length > 0 ? (
                missingKeywords.map((skill, idx) => (
                  <span key={`missing-${idx}`} className="badge badge-missing">
                    + {skill}
                  </span>
                ))
              ) : (
                <div className="badges-placeholder">
                  {totalKeywordsCount === 0 
                    ? 'Fill out the workspaces to identify missing skills.' 
                    : 'No missing skills! Excellent job.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

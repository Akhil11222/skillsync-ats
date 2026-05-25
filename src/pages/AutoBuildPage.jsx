import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { Sparkles, Briefcase, Code, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const AutoBuildPage = () => {
  const navigate = useNavigate();
  const { 
    jobDescription, 
    setJobDescription, 
    setResumeData
  } = useContext(AppContext);

  const [currentRole, setCurrentRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim()) {
      setError('Please provide a Job Description to optimize against.');
      return;
    }
    if (!currentRole.trim() || !techStack.trim() || !yearsOfExp.trim()) {
      setError('Please fill out all professional details.');
      return;
    }

    setLoading(true);
    try {
      // Send data to Vercel serverless backend function
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobDescription,
          currentRole,
          techStack,
          yearsOfExp
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate resume (HTTP ${response.status})`);
      }

      const parsedData = await response.json();

      // Add programmatically unique IDs to the generated arrays
      if (parsedData.experience && Array.isArray(parsedData.experience)) {
        parsedData.experience = parsedData.experience.map((exp, idx) => ({
          ...exp,
          id: Date.now() + idx
        }));
      } else {
        parsedData.experience = [{ id: 1, company: 'TechCorp', position: currentRole, duration: '2021 - Present', details: 'Built React interfaces...' }];
      }

      if (parsedData.education && Array.isArray(parsedData.education)) {
        parsedData.education = parsedData.education.map((edu, idx) => ({
          ...edu,
          id: Date.now() + idx + 10
        }));
      } else {
        parsedData.education = [{ id: 1, school: 'State University', degree: 'Computer Science', duration: '2017 - 2021', details: '' }];
      }

      // Set the global state
      setResumeData(parsedData);
      
      // Navigate to builder
      navigate('/builder');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the resume. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auto-build-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <section className="info-section">
        <h2 className="info-title">
          <Sparkles size={20} className="info-item-icon" />
          <span>AI Resume Auto-Builder</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px', margin: 0 }}>
          Instantly generate a tailored, ATS-optimized resume using our secure Gemini service. Input your professional background and the target job description to build a matching profile.
        </p>
      </section>

      <form onSubmit={handleGenerate} className="builder-main" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {error && (
          <div className="share-toast" style={{ position: 'static', margin: 0, width: '100%', display: 'flex', animation: 'none', borderLeft: '4px solid var(--color-danger)', backgroundColor: 'var(--color-danger-bg)' }}>
            <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{error}</span>
          </div>
        )}

        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          {/* Job Description Input */}
          <div className="form-group">
            <label className="form-label">Target Job Description</label>
            <textarea 
              className="form-textarea" 
              placeholder="Paste the target job description here to analyze and extract ATS keywords..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ minHeight: '150px' }}
            />
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Current Role */}
            <div className="form-group">
              <label className="form-label">Desired / Current Role</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Senior Frontend Engineer"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {/* Years of Experience */}
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  placeholder="e.g. 5"
                  value={yearsOfExp}
                  onChange={(e) => setYearsOfExp(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="form-group">
            <label className="form-label">Core Tech Stack</label>
            <div style={{ position: 'relative' }}>
              <Code size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. React.js, JavaScript, HTML, CSS, Webpack, Git, Node.js"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>
        </div>

        {/* Generate CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            type="submit" 
            className="theme-toggle-btn btn-primary" 
            disabled={loading}
            style={{ padding: '0.75rem 2rem', gap: '0.5rem', borderRadius: 'var(--border-radius-md)' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Generating ATS Resume...</span>
              </>
            ) : (
              <>
                <span>Build Tailored Resume</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutoBuildPage;


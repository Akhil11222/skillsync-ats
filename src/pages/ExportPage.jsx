import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { 
  Download, 
  Layout, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  FileText, 
  AlertCircle,
  Sliders,
  Copy,
  Check,
  Loader2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ExportPage = () => {
  const { resumeData, analysis, jobDescription } = useContext(AppContext);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' or 'executive'
  const [accentColor, setAccentColor] = useState('#2563EB'); // Default tech-blue accent
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' or 'email' or 'interview'

  // PDF Scaling State
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // Cold Email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [copied, setCopied] = useState(false);

  // Interview Prep State
  const [interviewData, setInterviewData] = useState(() => {
    const saved = localStorage.getItem('skillsync_interviewData');
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [interviewError, setInterviewError] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(0);

  // Persist Interview Prep State
  useEffect(() => {
    if (interviewData) {
      localStorage.setItem('skillsync_interviewData', JSON.stringify(interviewData));
    }
  }, [interviewData]);

  // Handle mobile PDF scale factor
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // More aggressive scale factor calculation
        const padding = window.innerWidth <= 480 ? 48 : 80;
        const containerWidth = window.innerWidth - padding;
        const newScale = Math.min(1, containerWidth / 794); // 210mm in pixels
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerateEmail = async () => {
    setEmailError('');
    setCopied(false);

    if (!jobDescription.trim()) {
      setEmailError('Please enter a target Job Description first (under Analyzer or AI Builder) to tailor the email.');
      return;
    }

    setLoadingEmail(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobDescription,
          resumeData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate email (HTTP ${response.status})`);
      }

      const data = await response.json();

      setEmailSubject(data.subject || `Application for Position - ${resumeData.personalInfo.fullName}`);
      setEmailBody(data.body || '');
    } catch (err) {
      console.error(err);
      setEmailError(err.message || 'Failed to generate email. Please check your connection.');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateInterview = async () => {
    setInterviewError('');
    if (!jobDescription.trim()) {
      setInterviewError('Please enter a target Job Description first (under Analyzer or AI Builder) to generate interview questions.');
      return;
    }

    setLoadingInterview(true);
    try {
      const response = await fetch('/api/generate-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobDescription,
          resumeData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate interview prep (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid interview questions response format from server.');
      }
      setInterviewData(data);
    } catch (err) {
      console.error(err);
      setInterviewError(err.message || 'Failed to generate interview questions. Please check your connection.');
    } finally {
      setLoadingInterview(false);
    }
  };

  const renderInterviewPrepStudio = () => {
    const questions = interviewData?.questions || [];
    return (
      <div className="interview-prep-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div className="info-section" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-xl)', background: 'var(--bg-secondary-card)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1.25rem', fontFamily: 'var(--font-headings)' }}>
            <HelpCircle size={18} style={{ color: 'var(--color-accent)' }} />
            <span>AI Interview Prep Studio</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            Generate 5 highly specific interview questions you are likely to face based on this job description and your resume, complete with strategic answering tips.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!jobDescription.trim() && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--border-radius-md)', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>No target job description found. Paste one in the Analyzer or AI Builder first.</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button
              onClick={handleGenerateInterview}
              className="theme-toggle-btn btn-primary"
              disabled={loadingInterview}
              style={{ padding: '0.6rem 1.5rem', gap: '0.5rem', borderRadius: 'var(--border-radius-md)' }}
            >
              {loadingInterview ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Analyzing & Generating Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Prep Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {interviewError && (
          <div className="share-toast" style={{ position: 'static', margin: 0, width: '100%', display: 'flex', animation: 'none', borderLeft: '4px solid var(--color-danger)', backgroundColor: 'var(--color-danger-bg)' }}>
            <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{interviewError}</span>
          </div>
        )}

        {loadingInterview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="skeleton-card" style={{ height: '70px', borderRadius: 'var(--border-radius-md)', background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
            ))}
          </div>
        )}

        {!loadingInterview && questions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    boxShadow: isOpen ? '0 10px 25px -5px rgba(37, 99, 235, 0.15), 0 8px 10px -6px rgba(37, 99, 235, 0.15)' : 'var(--shadow-sm)',
                    transform: isOpen ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderLeft: isOpen ? '4px solid var(--color-accent)' : '1px solid var(--border-color)'
                  }}
                  className="accordion-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ 
                        background: isOpen ? 'var(--color-accent)' : 'var(--bg-primary)', 
                        color: isOpen ? '#ffffff' : 'var(--color-accent)',
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                        {q.question}
                      </h4>
                    </div>
                    <span style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '1.25rem', 
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▾
                    </span>
                  </div>

                  {isOpen && (
                    <div 
                      style={{ 
                        marginTop: '1rem', 
                        paddingTop: '0.75rem', 
                        borderTop: '1px solid var(--border-color)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '0.25rem', fontWeight: 700 }}>
                        Answering Strategy:
                      </h5>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                        {q.tip}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderColdEmailStudio = () => {
    return (
      <div className="email-studio-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div className="info-section" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-xl)', background: 'var(--bg-secondary-card)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1.25rem', fontFamily: 'var(--font-headings)' }}>
            <Mail size={18} style={{ color: 'var(--color-accent)' }} />
            <span>AI Cold Email Generator</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            Generate a targeted, high-converting cold outreach email customized using the keywords from the target job description and your resume details.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Warnings if inputs are missing */}
            {!jobDescription.trim() && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--border-radius-md)', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>No target job description found. Paste one in the Analyzer or AI Builder first.</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button
              onClick={handleGenerateEmail}
              className="theme-toggle-btn btn-primary"
              disabled={loadingEmail}
              style={{ padding: '0.6rem 1.5rem', gap: '0.5rem', borderRadius: 'var(--border-radius-md)' }}
            >
              {loadingEmail ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Writing Email...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Outreach Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {emailError && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--color-danger-bg)', borderLeft: '4px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            <AlertCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span>{emailError}</span>
          </div>
        )}

        {emailBody && (
          <div className="email-output-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-xl)', background: 'var(--bg-secondary-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tailored outreach email</span>
              <button 
                onClick={handleCopyEmail}
                className="theme-toggle-btn"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}
              >
                {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Subject:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emailSubject}</span>
              </div>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="form-textarea"
                style={{ minHeight: '300px', width: '100%', background: 'var(--bg-primary)', padding: '1rem', fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const hasData = resumeData.personalInfo.fullName.trim().length > 0;

  // Modern Template Layout (Template A)
  const renderModernTemplate = () => {
    const { personalInfo, summary, experience, education } = resumeData;
    return (
      <div className="resume-document" id="resume-a4-pdf">
        {/* Header */}
        <div className="resume-header" style={{ borderBottomColor: accentColor }}>
          <div className="resume-personal-details">
            <h1 className="resume-name">{personalInfo.fullName || 'Your Name'}</h1>
            <span className="resume-title" style={{ color: accentColor }}>{personalInfo.title || 'Professional Title'}</span>
          </div>
          {personalInfo.avatar && (
            <div className="resume-avatar-frame" style={{ borderColor: accentColor }}>
              <img src={personalInfo.avatar} alt="Profile" />
            </div>
          )}
        </div>

        {/* Contact info panel */}
        <div className="resume-contact-info">
          {personalInfo.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Mail size={11} style={{ color: accentColor }} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={11} style={{ color: accentColor }} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={11} style={{ color: accentColor }} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Globe size={11} style={{ color: accentColor }} />
              {personalInfo.website}
            </span>
          )}
        </div>

        {/* Two-Column Grid */}
        <div className="resume-modern-grid">
          {/* Left Column: Summary & Experience */}
          <div className="resume-modern-left">
            {summary && (
              <div className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <p className="resume-item-details">{summary}</p>
              </div>
            )}

            <div className="resume-section">
              <h2 className="resume-section-title">Work Experience</h2>
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="resume-item">
                  <div className="resume-item-header">
                    <span>{exp.position || 'Position Title'}</span>
                    <span>{exp.duration || 'Duration'}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span>{exp.company || 'Company Name'}</span>
                  </div>
                  <p className="resume-item-details">{exp.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Skills & Education */}
          <div className="resume-modern-right">
            {/* Matched skills lists */}
            <div className="resume-section">
              <h2 className="resume-section-title">Core Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9pt', color: '#475569' }}>
                {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                  analysis.matchedKeywords.map((skill, idx) => (
                    <div key={`skill-mod-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: accentColor }}></span>
                      <span>{skill}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>No skills synced. Add skills in the builder.</span>
                )}
              </div>
            </div>

            <div className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="resume-item">
                  <div className="resume-item-header" style={{ fontSize: '9pt' }}>
                    <span>{edu.degree || 'Degree'}</span>
                    <span style={{ fontSize: '8pt', color: '#64748B', fontWeight: 500 }}>{edu.duration}</span>
                  </div>
                  <div className="resume-item-sub" style={{ fontSize: '8.5pt' }}>
                    <span>{edu.school || 'School'}</span>
                  </div>
                  {edu.details && <p className="resume-item-details" style={{ fontSize: '8pt', marginTop: '1mm' }}>{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Executive Template Layout (Template B)
  const renderExecutiveTemplate = () => {
    const { personalInfo, summary, experience, education } = resumeData;
    return (
      <div className="resume-document" id="resume-a4-pdf" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="resume-executive-container">
          {/* Header */}
          <div className="resume-executive-header">
            <h1 className="resume-name" style={{ fontFamily: 'Georgia, serif', fontSize: '26pt', fontWeight: 500 }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="resume-title" style={{ color: '#000000', fontSize: '12pt', fontStyle: 'italic', fontWeight: 500 }}>
              {personalInfo.title || 'Professional Title'}
            </div>
            
            {/* Contact links */}
            <div className="resume-executive-contact">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.website && <span>• {personalInfo.website}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="resume-section">
              <h2 className="resume-section-title" style={{ fontFamily: 'Georgia, serif', borderBottomColor: '#000000' }}>
                Professional Summary
              </h2>
              <p className="resume-item-details" style={{ color: '#000000', fontSize: '9.5pt' }}>{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          <div className="resume-section">
            <h2 className="resume-section-title" style={{ fontFamily: 'Georgia, serif', borderBottomColor: '#000000' }}>
              Professional Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="resume-item" style={{ marginBottom: '5mm' }}>
                <div className="resume-item-header" style={{ color: '#000000', fontSize: '10pt' }}>
                  <span>{exp.company ? `${exp.company} — ${exp.position}` : 'Job Placement'}</span>
                  <span>{exp.duration}</span>
                </div>
                <p className="resume-item-details" style={{ color: '#000000', fontSize: '9.5pt', marginTop: '1mm' }}>{exp.details}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="resume-section">
            <h2 className="resume-section-title" style={{ fontFamily: 'Georgia, serif', borderBottomColor: '#000000' }}>
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="resume-item">
                <div className="resume-item-header" style={{ color: '#000000', fontSize: '10pt' }}>
                  <span>{edu.school ? `${edu.school} — ${edu.degree}` : 'Degree Earned'}</span>
                  <span>{edu.duration}</span>
                </div>
                {edu.details && <p className="resume-item-details" style={{ color: '#000000', fontSize: '9pt', marginTop: '1mm' }}>{edu.details}</p>}
              </div>
            ))}
          </div>

          {/* Core Competencies */}
          <div className="resume-section">
            <h2 className="resume-section-title" style={{ fontFamily: 'Georgia, serif', borderBottomColor: '#000000' }}>
              Core Competencies
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3mm', fontSize: '9pt', color: '#000000' }}>
              {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                analysis.matchedKeywords.map((skill, idx) => (
                  <span key={`skill-exec-${idx}`}>• {skill}</span>
                ))
              ) : (
                <span style={{ fontStyle: 'italic', color: '#777' }}>No skills synced. Add skills in the builder.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="export-layout">
      {/* Sidebar Controls */}
      <div className="export-controls" style={{ minWidth: 0 }}>
        <div className="control-group">
          <label className="control-label">
            <Layout size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            <span>Select Template</span>
          </label>
          <div 
            className={`template-card ${selectedTemplate === 'modern' ? 'active' : ''}`}
            onClick={() => setSelectedTemplate('modern')}
          >
            <span className="template-card-title">Modern (Template A)</span>
            <span className="template-card-desc">Two-column, profile photo, tech accents.</span>
          </div>
          <div 
            className={`template-card ${selectedTemplate === 'executive' ? 'active' : ''}`}
            onClick={() => setSelectedTemplate('executive')}
          >
            <span className="template-card-title">Executive (Template B)</span>
            <span className="template-card-desc">Single-column, serif font, black-and-white.</span>
          </div>
        </div>

        {/* Theme Accent selection (Modern only) */}
        {selectedTemplate === 'modern' && (
          <div className="control-group">
            <label className="control-label">Accent Theme</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button 
                type="button" 
                onClick={() => setAccentColor('#2563EB')} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563EB', border: accentColor === '#2563EB' ? '2.5px solid var(--text-primary)' : 'none', cursor: 'pointer' }}
                title="Tech Blue"
              />
              <button 
                type="button" 
                onClick={() => setAccentColor('#0D9488')} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0D9488', border: accentColor === '#0D9488' ? '2.5px solid var(--text-primary)' : 'none', cursor: 'pointer' }}
                title="Teal"
              />
              <button 
                type="button" 
                onClick={() => setAccentColor('#059669')} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', border: accentColor === '#059669' ? '2.5px solid var(--text-primary)' : 'none', cursor: 'pointer' }}
                title="Emerald Green"
              />
              <button 
                type="button" 
                onClick={() => setAccentColor('#7C3AED')} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#7C3AED', border: accentColor === '#7C3AED' ? '2.5px solid var(--text-primary)' : 'none', cursor: 'pointer' }}
                title="Royal Purple"
              />
            </div>
          </div>
        )}

        <div className="control-group" style={{ marginTop: '1rem' }}>
          {hasData ? (
            <button 
              onClick={handlePrint}
              className="theme-toggle-btn btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', boxSizing: 'border-box' }}
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          ) : (
            <Link 
              to="/builder"
              className="theme-toggle-btn btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', textDecoration: 'none', boxSizing: 'border-box' }}
            >
              <Sliders size={16} />
              <span>Open Resume Builder</span>
            </Link>
          )}
        </div>
      </div>

      {/* A4 Preview / Email Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', minWidth: 0 }}>
        {/* Tab Headers */}
        <div className="tab-header-container" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem', marginBottom: '0.5rem', overflowX: 'auto', width: '100%', scrollbarWidth: 'none', boxSizing: 'border-box' }}>
          <button 
            onClick={() => setActiveTab('resume')}
            className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'resume' ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
              color: activeTab === 'resume' ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '0.75rem 0.5rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={16} />
            <span>Resume Preview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('email')}
            className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'email' ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
              color: activeTab === 'email' ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '0.75rem 0.5rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Mail size={16} />
            <span>Cold Email Studio</span>
          </button>

          <button 
            onClick={() => setActiveTab('interview')}
            className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'interview' ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
              color: activeTab === 'interview' ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '0.75rem 0.5rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <HelpCircle size={16} />
            <span>Interview Prep Studio</span>
          </button>
        </div>

        {activeTab === 'resume' && (
          <>
            {!hasData && (
              <div className="share-toast" style={{ position: 'static', margin: 0, width: '100%', display: 'flex', animation: 'none', borderLeft: '4px solid var(--color-warning)' }}>
                <AlertCircle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Demo View Active</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Your builder form is empty. We are showing sample info below. Go to <Link to="/builder" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Smart Resume Builder</Link> to fill out your details!
                  </p>
                </div>
              </div>
            )}
            
            <div 
              className="resume-preview-container" 
              ref={containerRef}
              style={{ 
                overflow: 'hidden', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start',
                padding: scale < 1 ? '0.5rem' : '3rem',
                height: scale < 1 ? `${1122 * scale + 24}px` : 'auto'
              }}
            >
              <div
                style={{
                  width: scale < 1 ? `${794 * scale}px` : '794px',
                  height: scale < 1 ? `${1122 * scale}px` : '1122px',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                <div 
                  style={{ 
                    width: '794px',
                    height: '1122px',
                    transform: scale < 1 ? `scale(${scale})` : 'none', 
                    transformOrigin: 'top left',
                    position: scale < 1 ? 'absolute' : 'relative',
                    top: 0,
                    left: 0
                  }}
                >
                  {selectedTemplate === 'modern' ? renderModernTemplate() : renderExecutiveTemplate()}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'email' && renderColdEmailStudio()}

        {activeTab === 'interview' && renderInterviewPrepStudio()}
      </div>
    </div>
  );
};

export default ExportPage;

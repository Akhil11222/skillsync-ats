import React, { useContext, useState } from 'react';
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
  Sliders
} from 'lucide-react';

export const ExportPage = () => {
  const { resumeData, analysis } = useContext(AppContext);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' or 'executive'
  const [accentColor, setAccentColor] = useState('#2563EB'); // Default tech-blue accent

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
      <div className="export-controls">
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
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem' }}
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          ) : (
            <Link 
              to="/builder"
              className="theme-toggle-btn btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', textDecoration: 'none' }}
            >
              <Sliders size={16} />
              <span>Open Resume Builder</span>
            </Link>
          )}
        </div>
      </div>

      {/* A4 Preview Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
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
        
        <div className="resume-preview-container">
          {selectedTemplate === 'modern' ? renderModernTemplate() : renderExecutiveTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;

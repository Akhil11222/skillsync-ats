import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext, { SAMPLE_AVATAR } from '../context/AppContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sliders 
} from 'lucide-react';

export const BuilderPage = () => {
  const navigate = useNavigate();
  const { resumeData, setResumeData, analysis } = useContext(AppContext);
  const [step, setStep] = useState(1);

  // Compile all form text to search for matching keywords
  const serializedFormText = useMemo(() => {
    return JSON.stringify(resumeData).toLowerCase();
  }, [resumeData]);

  // Helper to check if keyword is resolved anywhere in the builder form
  const isKeywordResolved = (keyword) => {
    if (!serializedFormText) return false;
    const cleanKeyword = keyword.toLowerCase();
    
    // Exact text match check
    if (serializedFormText.includes(cleanKeyword)) return true;

    // Normalised matching (e.g. react.js -> reactjs)
    const normalizedKeyword = cleanKeyword
      .replace(/c\+\+/g, 'cplusplus')
      .replace(/c#/g, 'csharp')
      .replace(/\.net/g, 'dotnet')
      .replace(/\b(react|node|vue|d3|next|nuxt|nest)\.js\b/g, '$1js')
      .replace(/[^a-z0-9]/g, '');

    const normalizedForm = serializedFormText
      .replace(/c\+\+/g, 'cplusplus')
      .replace(/c#/g, 'csharp')
      .replace(/\.net/g, 'dotnet')
      .replace(/\b(react|node|vue|d3|next|nuxt|nest)\.js\b/g, '$1js')
      .replace(/[^a-z0-9]/g, '');

    return normalizedForm.includes(normalizedKeyword);
  };

  // Personal Info handlers
  const handlePersonalChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Experience handlers
  const handleExperienceChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), company: '', position: '', duration: '', details: '' }
      ]
    }));
  };

  const removeExperience = (id) => {
    if (resumeData.experience.length === 1) return;
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  // Education handlers
  const handleEducationChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), school: '', degree: '', duration: '', details: '' }
      ]
    }));
  };

  const removeEducation = (id) => {
    if (resumeData.education.length === 1) return;
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // Set Profile Avatar Image Placeholder
  const applyAvatarPlaceholder = () => {
    handlePersonalChange('avatar', SAMPLE_AVATAR);
  };

  return (
    <div className="builder-layout">
      {/* Main Form Area */}
      <div className="builder-main">
        <h2 className="form-section-title" style={{ border: 'none', padding: 0 }}>
          <Sliders className="logo-icon" />
          <span>Smart Resume Builder</span>
        </h2>

        {/* Step Progress Tracker Bar */}
        <div className="step-tracker">
          <div className={`step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
            1
            <span className="step-node-label">Personal</span>
          </div>
          <div className={`step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
            2
            <span className="step-node-label">Summary</span>
          </div>
          <div className={`step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
            3
            <span className="step-node-label">Experience</span>
          </div>
          <div className={`step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>
            4
            <span className="step-node-label">Education</span>
          </div>
        </div>

        {/* Form Inputs based on Step */}
        <div style={{ marginTop: '2.5rem' }}>
          {step === 1 && (
            <div>
              <h3 className="form-section-title">
                <User size={20} className="logo-icon" />
                <span>Personal Information</span>
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Alexander Rivera"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Senior Frontend Engineer"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => handlePersonalChange('title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="e.g. alex.rivera@email.com"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. +1 (555) 019-2834"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website / LinkedIn</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. github.com/alexr-dev"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => handlePersonalChange('website', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. San Francisco, CA"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Profile Image URL (For Modern Template)</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Paste image link or click placeholder..."
                      value={resumeData.personalInfo.avatar}
                      onChange={(e) => handlePersonalChange('avatar', e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="theme-toggle-btn btn-secondary" 
                      onClick={applyAvatarPlaceholder}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Use Demo Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="form-section-title">
                <FileText size={20} className="logo-icon" />
                <span>Professional Summary</span>
              </h3>
              <div className="form-group">
                <label className="form-label">Write a brief overview of your skills and career highlights:</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Paste or write your profile summary here..."
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="form-section-title">
                <Briefcase size={20} className="logo-icon" />
                <span>Work Experience</span>
              </h3>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp.id} className="dynamic-list-item">
                  {resumeData.experience.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExperience(exp.id)} 
                      className="remove-btn"
                      title="Remove work experience entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. TechCorp Solutions"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Position</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Lead Frontend Developer"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Duration</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 2021 - Present"
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Details / Accomplishments (Include skills here to match!)</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Describe achievements, responsibilities, and technologies used..."
                        value={exp.details}
                        onChange={(e) => handleExperienceChange(exp.id, 'details', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addExperience} 
                className="theme-toggle-btn btn-secondary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
              >
                <Plus size={16} />
                <span>Add Work Experience</span>
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="form-section-title">
                <GraduationCap size={20} className="logo-icon" />
                <span>Education</span>
              </h3>
              {resumeData.education.map((edu, idx) => (
                <div key={edu.id} className="dynamic-list-item">
                  {resumeData.education.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEducation(edu.id)} 
                      className="remove-btn"
                      title="Remove education entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">School / Institution</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Stanford University"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree / Field of Study</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. B.S. in Computer Science"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Duration</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 2015 - 2019"
                        value={edu.duration}
                        onChange={(e) => handleEducationChange(edu.id, 'duration', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Additional Details (Optional)</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Honors, courses, GPA..."
                        value={edu.details}
                        onChange={(e) => handleEducationChange(edu.id, 'details', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addEducation} 
                className="theme-toggle-btn btn-secondary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
              >
                <Plus size={16} />
                <span>Add Education</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="form-actions">
          <button 
            type="button"
            className="theme-toggle-btn btn-secondary"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            style={{ opacity: step === 1 ? 0.5 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          
          {step < 4 ? (
            <button 
              type="button"
              className="theme-toggle-btn btn-primary"
              onClick={() => setStep(prev => Math.min(4, prev + 1))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              type="button"
              className="theme-toggle-btn btn-primary"
              onClick={() => navigate('/export')}
              style={{ background: 'linear-gradient(135deg, var(--color-success), #059669)' }}
            >
              <span>Continue to Export</span>
              <Check size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Floating JD Sync Sidebar */}
      <div className="builder-sidebar">
        <h3 className="sidebar-title">
          <span>JD Sync Keywords</span>
        </h3>
        
        {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
          <>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Type these missing skills into the summary or experience sections to optimize your ATS score:
            </p>
            <div className="sidebar-badge-list">
              {analysis.missingKeywords.map((keyword, idx) => {
                const resolved = isKeywordResolved(keyword);
                return (
                  <div 
                    key={`sidebar-key-${idx}`} 
                    className={`sidebar-badge ${resolved ? 'resolved' : ''}`}
                  >
                    <span>{keyword}</span>
                    {resolved && <Check size={14} style={{ color: 'var(--color-success)' }} />}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No missing keywords to track. Run analysis on the Analyzer page first to sync skills here.
          </p>
        )}
      </div>
    </div>
  );
};

export default BuilderPage;

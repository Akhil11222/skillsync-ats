import React, { useRef, useEffect } from 'react';
import { Briefcase, FileText } from 'lucide-react';

export const Workspace = ({ 
  jobDescription, 
  setJobDescription, 
  resume, 
  setResume, 
  matchedKeywordsSet 
}) => {
  const resumeTextareaRef = useRef(null);
  const resumeOverlayRef = useRef(null);

  // Synchronize scrolls
  const handleResumeScroll = () => {
    if (resumeTextareaRef.current && resumeOverlayRef.current) {
      resumeOverlayRef.current.scrollTop = resumeTextareaRef.current.scrollTop;
      resumeOverlayRef.current.scrollLeft = resumeTextareaRef.current.scrollLeft;
    }
  };

  // Sync scroll on text modifications or component updates
  useEffect(() => {
    handleResumeScroll();
  }, [resume]);

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getCharCount = (text) => {
    if (!text) return 0;
    return text.length;
  };

  // Function to split text and wrap matched keywords in highlights
  const renderHighlightedText = (text) => {
    if (!text) return '';
    
    const matchedSet = matchedKeywordsSet || new Set();
    
    // Add trailing whitespace padding if text ends with a newline to align lines
    const textToProcess = text.endsWith('\n') ? text + '\u200B' : text;

    // Tokenize while keeping formatting, alphanumeric sequences, symbols (C++, C#)
    const tokensRegex = /(c\+\+|c#|\.net|\b(?:react|node|vue|next|nest|nuxt|d3)\.js\b|[a-z0-9]+|[^a-z0-9+#\.]+)/gi;
    const parts = textToProcess.match(tokensRegex) || [textToProcess];

    return parts.map((part, index) => {
      // Normalize token to check membership in the matched keywords set
      const normalized = part.toLowerCase()
        .replace(/c\+\+/g, 'cplusplus')
        .replace(/c#/g, 'csharp')
        .replace(/\.net/g, 'dotnet')
        .replace(/\b(react|node|vue|d3|next|nuxt|nest)\.js\b/g, '$1js')
        .replace(/[^a-z0-9]/g, '');

      if (normalized && matchedSet.has(normalized)) {
        return (
          <mark key={index} className="highlight-match">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <section className="workspace">
      {/* Left Pane: Job Description */}
      <div className="pane">
        <label htmlFor="job-description-input" className="pane-label">
          <Briefcase className="pane-icon" />
          <span>Job Description</span>
        </label>
        <div className="textarea-wrapper">
          <textarea
            id="job-description-input"
            className="styled-textarea-overlay"
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            spellCheck="false"
          />
          <div className="textarea-counter">
            {getWordCount(jobDescription)} words | {getCharCount(jobDescription)} chars
          </div>
        </div>
      </div>

      {/* Right Pane: Your Resume (with Grammarly Effect) */}
      <div className="pane">
        <label htmlFor="resume-input" className="pane-label">
          <FileText className="pane-icon" />
          <span>Your Resume (Matches Highlighted)</span>
        </label>
        <div className="textarea-wrapper">
          {/* Overlay Highlight Container */}
          <div ref={resumeOverlayRef} className="highlights-overlay" aria-hidden="true">
            {renderHighlightedText(resume)}
          </div>

          {/* Editable Textarea */}
          <textarea
            ref={resumeTextareaRef}
            id="resume-input"
            className="styled-textarea-overlay"
            placeholder="Paste your plain text resume details here... Matched skills will highlight automatically."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            onScroll={handleResumeScroll}
            spellCheck="false"
          />
          
          <div className="textarea-counter">
            {getWordCount(resume)} words | {getCharCount(resume)} chars
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workspace;

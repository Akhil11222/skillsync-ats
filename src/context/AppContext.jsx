import React, { createContext, useState, useEffect } from 'react';
import { useATSAnalyzer } from '../hooks/useATSAnalyzer';

export const AppContext = createContext();

// Visual placeholder image for resume avatar
export const SAMPLE_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export const SAMPLE_JD = `We are seeking a Senior Frontend Developer to join our core engineering team. 

Key Requirements:
- Strong experience with HTML, CSS, JavaScript (ES6+), and TypeScript.
- Hands-on expertise with React.js and modern state management.
- Solid understanding of Git, GitHub, and collaborative workflows.
- Professional experience with build tools like Vite and Webpack.
- Experience with Node.js and API integrations (REST, GraphQL) is preferred.
- Familiarity with CI/CD pipelines, Docker, and AWS is a huge plus.
- Passion for crafting polished UI/UX experiences and responsive layouts.`;

export const SAMPLE_RESUME = `ALEXANDER RIVERA
Senior Frontend Engineer | alex.rivera@email.com | github.com/alexr-dev

SUMMARY:
Detail-oriented Frontend Engineer with 5+ years of experience building high-performance web applications. Expert in React.js and responsive interface design.

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), TypeScript, HTML, CSS, SQL
- Frameworks & Libraries: React.js, Next.js, Redux, SASS
- Tools & DevOps: Git, GitHub, Vite, Webpack, npm, AWS
- Concepts: UI/UX optimization, REST APIs, responsive design

PROFESSIONAL EXPERIENCE:
Lead Frontend Developer | TechCorp Solutions
- Developed fully responsive React interfaces, increasing user retention by 20%.
- Integrated REST APIs with Node.js backend.
- Managed codebase using Git and collaborated via pull requests.`;

export const SAMPLE_BUILDER_DATA = {
  personalInfo: {
    fullName: 'Alexander Rivera',
    title: 'Senior Frontend Engineer',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 019-2834',
    website: 'github.com/alexr-dev',
    location: 'San Francisco, CA',
    avatar: SAMPLE_AVATAR
  },
  summary: 'Detail-oriented Frontend Engineer with 5+ years of experience building high-performance web applications. Expert in React.js and responsive interface design. Strong collaborator with backend teams to integrate REST APIs.',
  experience: [
    {
      id: 1,
      company: 'TechCorp Solutions',
      position: 'Lead Frontend Developer',
      duration: '2021 - Present',
      details: 'Developed fully responsive React interfaces, increasing user retention by 20%. Integrated REST APIs with Node.js backend. Managed codebase using Git and collaborated via pull requests.'
    },
    {
      id: 2,
      company: 'AppVantage Inc',
      position: 'Frontend Developer',
      duration: '2019 - 2021',
      details: 'Built reusable React components. Optimized page speed by 15%. Coordinated with UI/UX designers to implement pixel-perfect user interfaces.'
    }
  ],
  education: [
    {
      id: 1,
      school: 'Stanford University',
      degree: 'B.S. in Computer Science',
      duration: '2015 - 2019',
      details: 'Graduated with Honors. Specialization in Software Engineering and Human-Computer Interaction.'
    }
  ]
};

const INITIAL_BUILDER_DATA = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    avatar: ''
  },
  summary: '',
  experience: [
    { id: 1, company: '', position: '', duration: '', details: '' }
  ],
  education: [
    { id: 1, school: '', degree: '', duration: '', details: '' }
  ]
};

export const AppProvider = ({ children }) => {
  const [jobDescription, setJobDescription] = useState(() => {
    return localStorage.getItem('skillsync_jobDescription') || '';
  });
  const [resume, setResume] = useState(() => {
    return localStorage.getItem('skillsync_resume') || '';
  });
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('skillsync_resumeData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved resumeData from localStorage", e);
      }
    }
    return INITIAL_BUILDER_DATA;
  });


  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skillsync_jobDescription', jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    localStorage.setItem('skillsync_resume', resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('skillsync_resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // Compute ATS analysis globally
  const analysis = useATSAnalyzer(jobDescription, resume);

  // Synchronized loaders
  const loadAllSampleData = () => {
    setJobDescription(SAMPLE_JD);
    setResume(SAMPLE_RESUME);
    setResumeData(SAMPLE_BUILDER_DATA);
  };

  const clearAllData = () => {
    setJobDescription('');
    setResume('');
    setResumeData(INITIAL_BUILDER_DATA);
  };

  return (
    <AppContext.Provider value={{
      jobDescription,
      setJobDescription,
      resume,
      setResume,
      resumeData,
      setResumeData,
      analysis,
      loadAllSampleData,
      clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppContext;

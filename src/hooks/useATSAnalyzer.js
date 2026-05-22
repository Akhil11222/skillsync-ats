import { useMemo } from 'react';

// Standard English stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  // Common non-skill general words in job descriptions
  'required', 'requirements', 'responsibilities', 'responsible', 'experience', 'years', 'work', 'job', 'team', 'skills',
  'candidate', 'role', 'working', 'ability', 'knowledge', 'position', 'description', 'plus', 'preferred', 'strong',
  'ideal', 'looking', 'join', 'company', 'environment', 'business', 'projects', 'tools', 'technologies', 'using',
  'development', 'develop', 'building', 'create', 'design', 'support', 'management', 'manage', 'delivery', 'deliver',
  'written', 'verbal', 'communication', 'etc', 'day', 'track', 'record', 'proven', 'degree', 'computer', 'science',
  'degree', 'field', 'related', 'similar', 'including', 'benefits', 'apply', 'offer', 'status', 'employment',
  'national', 'origin', 'gender', 'race', 'color', 'religion', 'equal', 'opportunity', 'employer'
]);

// Mapping of normalized terms to premium display format
const SKILL_DISPLAY_MAP = {
  'cplusplus': 'C++',
  'csharp': 'C#',
  'dotnet': '.NET',
  'reactjs': 'React.js',
  'nodejs': 'Node.js',
  'vuejs': 'Vue.js',
  'nextjs': 'Next.js',
  'html': 'HTML',
  'css': 'CSS',
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'aws': 'AWS',
  'gcp': 'GCP',
  'sql': 'SQL',
  'nosql': 'NoSQL',
  'api': 'API',
  'apis': 'APIs',
  'rest': 'REST',
  'graphql': 'GraphQL',
  'ci': 'CI',
  'cd': 'CD',
  'cicd': 'CI/CD',
  'ui': 'UI',
  'ux': 'UX',
  'uiux': 'UI/UX',
  'qa': 'QA',
  'git': 'Git',
  'github': 'GitHub',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'python': 'Python',
  'java': 'Java',
  'rust': 'Rust',
  'golang': 'Go',
  'php': 'PHP',
  'ruby': 'Ruby',
  'rails': 'Ruby on Rails',
  'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'sqlite': 'SQLite',
  'redis': 'Redis',
  'sass': 'SASS',
  'less': 'LESS',
  'webpack': 'Webpack',
  'vite': 'Vite',
  'npm': 'NPM',
  'yarn': 'Yarn',
  'pnpm': 'PNPM',
  'seo': 'SEO',
  'ats': 'ATS',
  'saas': 'SaaS',
  'sdk': 'SDK',
  'jwt': 'JWT',
  'oauth': 'OAuth'
};

/**
 * Tokenizes text and extracts words while preserving programming syntaxes (C++, C#, .NET, .js).
 * Returns array of words.
 */
const tokenize = (text) => {
  if (!text) return [];

  // Convert to lowercase and handle special languages/terms
  let processed = text.toLowerCase()
    .replace(/c\+\+/g, ' cplusplus ')
    .replace(/c#/g, ' csharp ')
    .replace(/\.net\b/g, ' dotnet ')
    .replace(/\b(react|node|vue|d3|next|nuxt|nest)\.js\b/g, ' $1js ');

  // Replace punctuation with spaces (excluding numbers and letters)
  processed = processed.replace(/[^a-z0-9\s]/g, ' ');

  // Split by whitespace and remove empty strings/single characters (unless they are valid numbers/words)
  return processed.split(/\s+/).filter(word => word.trim().length > 1);
};

/**
 * Capitalizes a word for default display.
 */
const capitalize = (word) => {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Custom Hook useATSAnalyzer
 * Computes match percentage and determines matched and missing keywords.
 */
export const useATSAnalyzer = (jobDescription, resume) => {
  return useMemo(() => {
    // If Job Description is empty, return initial values
    if (!jobDescription || !jobDescription.trim()) {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        totalKeywordsCount: 0
      };
    }

    // Tokenize Job Description to find target keywords
    const jdTokens = tokenize(jobDescription);
    
    // Filter out stop words and keep unique keywords
    const targetKeywordsSet = new Set(
      jdTokens.filter(word => !STOP_WORDS.has(word))
    );

    const totalKeywordsCount = targetKeywordsSet.size;

    if (totalKeywordsCount === 0) {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        totalKeywordsCount: 0
      };
    }

    // Tokenize Resume for matching
    const resumeTokens = tokenize(resume);
    const resumeKeywordsSet = new Set(resumeTokens);

    const matched = [];
    const missing = [];

    // Compare keywords
    targetKeywordsSet.forEach(keyword => {
      // Find display string representation
      const displayString = SKILL_DISPLAY_MAP[keyword] || capitalize(keyword);
      
      if (resumeKeywordsSet.has(keyword)) {
        matched.push(displayString);
      } else {
        missing.push(displayString);
      }
    });

    // Calculate score
    const score = Math.round((matched.length / totalKeywordsCount) * 100);

    return {
      score,
      matchedKeywords: matched.sort((a, b) => a.localeCompare(b)),
      missingKeywords: missing.sort((a, b) => a.localeCompare(b)),
      totalKeywordsCount
    };
  }, [jobDescription, resume]);
};

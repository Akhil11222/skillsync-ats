import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { jobDescription, resumeData } = req.body || {};

  // Validate inputs
  if (!jobDescription || !resumeData) {
    return res.status(400).json({ error: 'Missing required parameters in request body (jobDescription, resumeData).' });
  }

  // Load API key securely from server environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured in process.env');
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  try {
    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemPrompt = `You are a professional career advisor and outreach copywriter.
Write a high-converting cold email tailored to a target Job Description and based on the applicant's resume.

Generate exactly 3 paragraphs:
1. Hook introduction referencing the job title and company from the job description, showing strong alignment and enthusiasm.
2. Core value pitch: Highlight 2-3 specific technical skills or accomplishments from the applicant's experience that directly address the requirements of the job description.
3. Call to Action (CTA): Propose a brief call/meeting next week to discuss how the applicant can help the company achieve its goals, and close professionally.

Inputs:
- Job Description: "${jobDescription.replace(/"/g, '\\"')}"
- Resume Data: ${JSON.stringify(resumeData).replace(/"/g, '\\"')}

Output JSON format matching this schema:
{
  "subject": "Clear, catchy email subject line (e.g. Senior React Developer role - [Applicant Name])",
  "body": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3"
}

CRITICAL INSTRUCTIONS:
1. Enforce responseMimeType as "application/json" and output ONLY a parseable JSON object following the schema above.
2. Do not wrap the JSON in Markdown block ticks (e.g. \`\`\`json). Return a pure raw JSON string.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Parse the response to ensure validity before returning
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.warn("Raw response parsing failed, cleaning markdown ticks", parseErr);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.status(200).json(parsedData);
  } catch (err) {
    console.error('Gemini API execution error:', err);
    return res.status(500).json({ error: err.message || 'An error occurred during cold email generation.' });
  }
}

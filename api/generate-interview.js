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

    const systemPrompt = `You are an expert technical interviewer and recruiting director.
Analyze the target Job Description and the applicant's resume.
Generate exactly 5 highly specific, challenging, and realistic interview questions the candidate is likely to face based on their stack and the job role.
For each question, provide a strategic, 1-sentence answering tip that guides the candidate on how to structure their answer or what key skills to highlight.

Inputs:
- Job Description: "${jobDescription.replace(/"/g, '\\"')}"
- Resume Data: ${JSON.stringify(resumeData).replace(/"/g, '\\"')}

Output JSON format matching this schema:
{
  "questions": [
    {
      "question": "Question 1 text",
      "tip": "Answering tip 1"
    },
    {
      "question": "Question 2 text",
      "tip": "Answering tip 2"
    },
    {
      "question": "Question 3 text",
      "tip": "Answering tip 3"
    },
    {
      "question": "Question 4 text",
      "tip": "Answering tip 4"
    },
    {
      "question": "Question 5 text",
      "tip": "Answering tip 5"
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. Enforce responseMimeType as "application/json" and output ONLY a parseable JSON object following the schema above.
2. Answering tips must be strictly 1 sentence.
3. Do not wrap the JSON in Markdown block ticks (e.g. \`\`\`json). Return a pure raw JSON string.`;

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
    return res.status(500).json({ error: err.message || 'An error occurred during interview questions generation.' });
  }
}

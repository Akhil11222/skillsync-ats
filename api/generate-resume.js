import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { jobDescription, currentRole, techStack, yearsOfExp } = req.body || {};

  // Validate inputs
  if (!jobDescription || !currentRole || !techStack || !yearsOfExp) {
    return res.status(400).json({ error: 'Missing required parameters in request body.' });
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
    
    // Get the model (using gemini-1.5-flash for speed and reliability)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    // Strict Prompt Engineering
    const systemPrompt = `You are a Principal Technical Writer and ATS optimization specialist.
Your task is to generate a comprehensive, professional resume matching the user's inputs and optimized for the provided Job Description.

Generate a JSON object matching this strict schema:
{
  "personalInfo": {
    "fullName": "Name generated based on role or a default like 'Alexander Rivera'",
    "title": "Professional title (e.g. Senior Frontend Engineer)",
    "email": "Email address placeholder",
    "phone": "Phone number placeholder",
    "website": "Portfolio/Github website placeholder",
    "location": "Location placeholder",
    "avatar": ""
  },
  "summary": "A highly professional, 2-3 sentence summary optimized with key technical terms and matching ATS keywords from the Job Description.",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Position/Title",
      "duration": "Duration (e.g. 2022 - Present)",
      "details": "Bullet points describing achievements. The bullet points MUST be highly concise descriptions of technical skills. The bullet points must be short, punchy, and heavily optimized for the provided ATS keywords in the Job Description. Write 3-4 bullet points separated by newlines."
    }
  ],
  "education": [
    {
      "school": "University or College Name",
      "degree": "Degree earned (e.g. B.S. in Computer Science)",
      "duration": "Duration years",
      "details": "Honors or GPA details if applicable"
    }
  ]
}

Input Details:
- Target Job Description: "${jobDescription.replace(/"/g, '\\"')}"
- Target Role: "${currentRole.replace(/"/g, '\\"')}"
- Tech Stack: "${techStack.replace(/"/g, '\\"')}"
- Years of Experience: ${yearsOfExp} years

CRITICAL INSTRUCTIONS:
1. Enforce responseMimeType as "application/json" and output ONLY a parseable JSON object following the schema above.
2. The 'details' under experience must contain short, punchy, and highly technical sentences optimized for the Job Description. Avoid fluffy descriptions.
3. Generate 2 distinct work experience entries representing the user's career progression matching their total experience.
4. Generate 1 education entry.
5. Do not wrap the JSON in Markdown block ticks (e.g. \`\`\`json). Return a pure raw JSON string.`;

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
    return res.status(500).json({ error: err.message || 'An error occurred during resume data generation.' });
  }
}

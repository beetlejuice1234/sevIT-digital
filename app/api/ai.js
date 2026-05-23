// Vercel Serverless Function for Groq AI
// This hides your API key from the client

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Your Groq API key (hidden from client)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key is not configured' });
  }

  try {
    const { messages, model = 'llama-3.3-70b-versatile' } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq error:', errorData);
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key. Please check your Groq API key configuration.' });
      }
      
      return res.status(500).json({ error: 'Failed to call AI' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

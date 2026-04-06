// Vercel Serverless Function for ElevenLabs TTS
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

  // Your ElevenLabs API key (hidden from client)
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_ca7a1ada957133f0a9bf4616d970141eacca37d757fcc414';

  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs error:', error);
      return res.status(500).json({ error: 'Failed to generate speech' });
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();

    // Return audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

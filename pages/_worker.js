export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/test')) {
      return Response.json({ message: 'test' });
    }
    if (url.pathname.startsWith('/api/')) {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + env.API_KEY;

      const requestData = {
        contents: [
          {
            parts: [
              {
                text: 'Escribe una historia sobre una mochila mágica.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
          responseMimeType: 'text/plain'
        }
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Generated Content:', JSON.stringify(data, null, 2));
        return Response.json(data);
      } catch (error) {
        console.error('Error generating content:', error.message);
        return Response.json({ message: error.message }, { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  },
}
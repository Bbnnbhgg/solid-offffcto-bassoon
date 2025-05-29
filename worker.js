export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const text = body.text;

    if (!text) {
      return new Response(JSON.stringify({ error: "Text parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = "AIzaSyDzRjhrxdHk5gmEByP_-AzI9gbNLzRwX7E"; // Hardcoded or from secrets
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `Replace any offensive or inappropriate words in this sentence with asterisks (e.g., ****): "${text}". Return only the censored sentence.`;

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const geminiData = await geminiRes.json();

    const filtered = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Error filtering text.";

    return new Response(JSON.stringify({ original: text, filtered }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export const getGeminiResponse = async (prompt) => {
  const projectId = 'homyapp-425910'; 
  const location = 'us-central1'; 
  const modelId = 'gemini-1.5-flash';

  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:streamGenerateContent`;

  const accessToken = 'ACCESS_TOKEN';
  const requestBody = {
    contents: {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to fetch Gemini response');
    }

    const data = await response.json();

    // Pobranie wygenerowanego tekstu z odpowiedzi
    const generatedText = data.text;

    return generatedText;
  } catch (error) {
    console.error('Błąd podczas pobierania odpowiedzi Gemini:', error);
    throw error;
  }
};

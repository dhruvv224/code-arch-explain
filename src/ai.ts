export async function explainArchitecture(graphText: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCW-xlUpUt7FVRvyhms6I7AZrr8FU-40_k";
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  if (!apiKey) {
    return [
      "AI explanation is unavailable.",
      "Missing GEMINI_API_KEY environment variable.",
      `Configured model: ${model}`
    ].join("\n");
  }

  const prompt = `
Explain the architecture of this project.

Dependencies:
${graphText}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return [
        "AI explanation is unavailable.",
        `Tried model: ${model}`,
        `Gemini API error: ${response.status} ${response.statusText}`,
        errorText
      ].join("\n");
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim() || "";

    if (!text) {
      return [
        "AI explanation is unavailable.",
        `Tried model: ${model}`,
        "Gemini returned an empty response."
      ].join("\n");
    }

    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      "AI explanation is unavailable.",
      `Tried model: ${model}`,
      "Make sure the Gemini API key is valid and internet access is available.",
      `Error: ${message}`
    ].join("\n");
  }
}
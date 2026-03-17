import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getIslamicAssistantResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and knowledgeable Islamic assistant named 'Deener Sathi Assistant'. You provide accurate information about Namaz, Quran, and Islamic rules based on authentic sources. Respond in a calm, respectful, and professional manner. If asked in Bangla, respond in Bangla. Keep responses concise and informative.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}

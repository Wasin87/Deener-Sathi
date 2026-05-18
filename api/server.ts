import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and knowledgeable Islamic assistant named 'Deener Sathi Assistant'. You provide accurate information about Namaz, Quran, and Islamic rules based on authentic sources. Respond in a calm, respectful, and professional manner. If asked in Bangla, respond in Bangla. Keep responses concise and informative.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch response from Islamic Assistant." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;

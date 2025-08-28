import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from "dotenv";

dotenv.config();

console.log("inside gemini controller");

export const callGeminiAPI = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
    
    
    const prompt = `Analyze the following news and return JSON with fields, give very straight and to the point answers here:
    { "category": "Politics/Health/Sports/Tech/Other", "source": "Where it likely originated (Twitter, WhatsApp, News site, etc.)", "isFake": true/false, "confidence": 0.85 }
    News: ${text}`;

    
    const contents = [{
      role: 'user',
      parts: [{ text: prompt }]
    }];
    
    
    const result = await model.generateContent({ contents: contents });
    const response = await result.response;
    
    console.log(response);

    // Corrected here: .text is a method that needs to be called
    const rawText = response.text() || "{}";

    console.log(rawText);
    

    // Clean the response in case it has markdown formatting
    const cleanedText = rawText.replace(/```json\n?|\n?```/g, '').trim();

    console.log(cleanedText);
    
    // Check if the parsed JSON has the expected fields before returning
    const parsedData = JSON.parse(cleanedText);
    if (!parsedData.category || !parsedData.source) {
      console.warn("Gemini API returned an incomplete or empty JSON object.");
      return {
        category: "Other",
        source: "Unknown",
        isFake: false,
        confidence: 0.0
      };
    }
    
    return parsedData;
  } catch (err) {
    console.error("Gemini API error:", err);

    return {
      category: "Other",
      source: "Unknown",
      isFake: false,
      confidence: 0.0
    };
  }
};

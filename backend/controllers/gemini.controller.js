import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

console.log("inside gemini controller");

export const callGeminiAPI = async (text, newsSource) => {
  try {
    
    const prompt = `Analyze the following news and return JSON with fields, give very straight and to the point answers here:
    { 
      "isFake": "FAKE"|"REAL"
      "confidencePercent": "12%" | "85%" | 50% | 100% (tell how much confident you are on your judgement, also if you dont have anything then just return a random & base on the news)
      "category": "Politics/Health/Sports/Tech/Other",
      "source": "Where it likely originated if fake(Twitter, WhatsApp, News site, etc.) / or if real send a link to original new source along with source and author name", 
      "submittedSource": Twitter | ZeeNews.com | youtube | Reddit | AajTak | Aljazeera
      "trend": "quantify how much this news or related topic has been in discussions in past in 6 months(if you do not have any specific number just send a generic number like fakenews increased by 10% something in past 3 months)",
      "context": "give 4-5 line context of news if real, or if fake tell what have been the developments related to the news in past 1 year",
      "aiAnalysis": "tell about your analysis in 4-5 line, that this fake is just one time affair or has been tredy because of its spicy nature linked to politics, if real then explain in 4-5 lines behind the reason about this news",
      "similarArticle": [
        "link1",
        "link2",
        "link3"
      ] (link to articles that are on the same topic(send 3 links))
    }
    News: ${text},
    News source being reported by the user: ${newsSource}`;

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY,
        temperature: 0.3,
    });

    const result = await llm.invoke(prompt);
    const response = result.content || "{}";

    const cleanedText = response.replace(/```json\s*|```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedText);
    if (!parsedData.category || !parsedData.source) {
      console.warn("Gemini API returned an incomplete or empty JSON object.");
      return {
        isFake: "none",
        confidencePercent: "nill",
        category: "Other",
        source: "Unknown",
        submittedSource: "none",
        trend: "Unknown",
        context: "none",
        aiAnalysis: "Unknown",
        similarArticle: "none"
      };
    }
    
    return parsedData;
  } catch (err) {
    console.error("Gemini API error:", err);

    return {
      isFake: "none",
      confidencePercent: "nill",
      category: "Other",
      source: "Unknown",
      submittedSource: "none",
      trend: "Unknown",
      context: "none",
      aiAnalysis: "Unknown",
      similarArticle: "none"
    };
  }
};

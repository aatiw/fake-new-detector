import News from "../model/News.js";
import axios from "axios";
import { callGeminiAPI } from "./gemini.controller.js";
import dotenv, { parse } from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY; 
const MODEL = "mrm8488/bert-tiny-finetuned-fake-news-detection"; 

console.log("inside newsContoller.js");

export const classifyNews = async (req, res) => {
  try {
    const { text, newsSource } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }


    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    if (!Array.isArray(response.data) || !response.data[0]) {
      return res.status(500).json({ error: "Unexpected response from HuggingFace API" });
    }

    const predictions = response.data[0];
    const topPrediction = predictions.reduce((a, b) => (a.score > b.score ? a : b));
    let result;
    if (topPrediction.label === "LABEL_0") result = "REAL";
    else if (topPrediction.label === "LABEL_1") result = "FAKE";
    else result = topPrediction.label.toUpperCase();


    const data = await callGeminiAPI(text, newsSource);

    const news = new News({
      text,
      userSource: newsSource,
      modelResult: result,
      sourceAccuracy: topPrediction.score,
      aiResult: data.isFake,
      confidencePercent: parseFloat(data.confidencePercent),
      category: data.category,
      source: data.source,
      submittedSource: data.submittedSource,
      trend: data.trend,
      context: data.context,
      aiAnalysis: data.aiAnalysis,
      similarArticle: data.similarArticle,
      rawPredictions: predictions,
    });

    await news.save();

    res.json(news);
  } catch (error) {
    console.error("Classification error:", error.response?.data || error.message);

    if (error.response) {
      return res.status(500).json({ 
        error: "API request failed", 
        details: error.response.data,
        status: error.response.status 
      });
    } else if (error.request) {
      return res.status(500).json({ 
        error: "No response from API", 
        details: "Network or timeout error" 
      });
    } else {
      return res.status(500).json({ 
        error: "Classification failed", 
        details: error.message 
      });
    }
  }
};

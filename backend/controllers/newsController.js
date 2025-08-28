import News from "../model/News.js";
import axios from "axios";
import { callGeminiAPI } from "./gemini.controller.js";
import dotenv from "dotenv";
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



    // calling huggineface api
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    if (!Array.isArray(response.data) || !response.data[0]) {
      return res.status(500).json({ error: "Unexpected response from HuggingFace API" });
    }
    console.log(response.data);

    // storing and trimming data
    const predictions = response.data[0];
    const topPrediction = predictions.reduce((a, b) => (a.score > b.score ? a : b));

    let result;
    if (topPrediction.label === "LABEL_0") result = "REAL";
    else if (topPrediction.label === "LABEL_1") result = "FAKE";
    else result = topPrediction.label.toUpperCase();



    // caling gemini api endpoint
    const { category, source: geminiSource } = await callGeminiAPI(text);
    const sourceAccuracy = geminiSource.toLowerCase() === newsSource.toLowerCase();



    // saving to the db
    const news = new News({
      text,
      source: geminiSource,
      userSource: newsSource,
      sourceAccuracy,
      result,
      confidence: topPrediction.score,
      rawPredictions: predictions,
      category
    });

    await news.save();
    res.json(news);
  } catch (error) {
    console.error("Classification error:", error.response?.data || error.message);

    if (error.response) {
      // API responded with error status
      return res.status(500).json({ 
        error: "API request failed", 
        details: error.response.data,
        status: error.response.status 
      });
    } else if (error.request) {
      // Request was made but no response received
      return res.status(500).json({ 
        error: "No response from API", 
        details: "Network or timeout error" 
      });
    } else {
      // Something else happened
      return res.status(500).json({ 
        error: "Classification failed", 
        details: error.message 
      });
    }
  }
};

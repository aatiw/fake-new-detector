import News from "../models/News.js";
import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY; 
const MODEL = "mrm8488/bert-tiny-finetuned-fake-news-detection"; 

export const classifyNews = async (req, res) => {
  try {
    const { text, source } = req.body;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const label = response.data[0][0].label;
    const score = response.data[0][0].score;

    const news = await News.create({
      text,
      source,
      result: label.toUpperCase(),
      confidence: score
    });

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Classification failed" });
  }
};



export const getStats = async (req, res) => {
  try {
    const total = await News.countDocuments();
    const fakeCount = await News.countDocuments({ result: "FAKE" });
    const realCount = await News.countDocuments({ result: "REAL" });

    const stats = {
      total,
      fake: fakeCount,
      real: realCount,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

import express from "express";
import { classifyNews, getStats } from "../controllers/newsController";

const router = express.Router();

router.post("/classify", classifyNews)

router.get("/stats", getStats)

export default router;
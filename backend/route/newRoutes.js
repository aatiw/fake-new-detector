import express from "express";
import { classifyNews} from "../controllers/newsController.js";

const router = express.Router();

console.log("inside newRoutes.js");

router.post("/classify", classifyNews)

export default router;
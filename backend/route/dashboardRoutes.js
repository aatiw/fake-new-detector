import express from "express";
import { getStats } from "../controllers/dashboardController.js";

const router = express.Router();

console.log("inside dashboardRoutes.js");

router.get("/stats", getStats);

export default router;

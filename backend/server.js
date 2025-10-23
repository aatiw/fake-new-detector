import express from "express";
import connectDB from "./config/db.js";
import newsRoutes from "./route/newRoutes.js";
import dashboardRoutes from "./route/dashboardRoutes.js";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())

connectDB();

app.get("/", function reply(req, res) {
    console.log("you have hit the very first get request that is for test");
})

app.use("/api/news", newsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(5000, () => console.log("this app is working on server 5000"));
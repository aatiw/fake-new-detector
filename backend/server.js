import express from "express";
import connectDB from "./config/db";

const app = express();

app.use(express.json())

connectDB;

app.get("/", function reply(req, res) {
    console.log("this is test get request");
    res.send("hello")
})

app.listen(5000, () => console.log("this app is working on server 5000"));
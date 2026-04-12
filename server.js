import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import app from "./route/chat.js";
import router from "./route/user.js";

const server = express();
const PORT = process.env.PORT || 5000;

server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stayhub-chat.duckdns.org"
    ],
    credentials: true
  })
);

server.use(express.json());

server.use(app);
server.use(router);

server.get("/", (req, res) => {
  res.send("hello world");
})

const Mongodb = async () => {
  try {
    console.log("mongo url is ", process.env.MONGOUSER_URL);
    await mongoose.connect(process.env.MONGOUSER_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

server.listen(PORT, async () => {
  console.log(`server is listenning on port ${PORT}`);
  Mongodb();
})
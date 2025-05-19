// routes/chat.js
const express = require("express");
const router = express.Router();
const { chatWithOllama } = require("../controllers/ChatGPTController");

router.post("/", chatWithOllama);

module.exports = router;

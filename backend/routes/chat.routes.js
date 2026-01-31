const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: req.body.message })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ error: "Chatbot service unavailable" });
  }
});

router.post("/ai", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: req.body.message })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("AI Chat Error:", err);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

module.exports = router;

const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("GET /api/query-forum error", err);
    res.status(500).json({ error: "Failed to load queries" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("BODY /api/query-forum =>", req.body);
    const { title, body, authorId, authorName } = req.body;

    if (!title || !body || !authorId) {
      return res
        .status(400)
        .json({ error: "title, body and authorId are required" });
    }

    const question = await Question.create({
      title,
      body,
      authorId,
      authorName,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("POST /api/query-forum error", err);
    res.status(500).json({ error: "Failed to create query" });
  }
});

router.post("/:id/replies", async (req, res) => {
  try {
    const { text, authorId, authorName } = req.body;

    if (!text || !authorId) {
      return res
        .status(400)
        .json({ error: "text and authorId are required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.replies.push({ text, authorId, authorName });
    await question.save();

    res.status(201).json(question);
  } catch (err) {
    console.error("POST /api/query-forum/:id/replies error", err);
    res.status(500).json({ error: "Failed to add reply" });
  }
});

module.exports = router;


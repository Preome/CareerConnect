// routes/queryForumRoutes.js
const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET all questions – popular first
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ upvotes: -1, createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("GET /api/query-forum error", err);
    res.status(500).json({ error: "Failed to load queries" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, body, authorId, authorName, authorImageUrl } = req.body;

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
      authorImageUrl,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("POST /api/query-forum error", err);
    res.status(500).json({ error: "Failed to create query" });
  }
});

router.post("/:id/replies", async (req, res) => {
  try {
    const { text, authorId, authorName, authorImageUrl } = req.body;

    if (!text || !authorId) {
      return res
        .status(400)
        .json({ error: "text and authorId are required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.replies.push({ text, authorId, authorName, authorImageUrl });
    await question.save();

    res.status(201).json(question);
  } catch (err) {
    console.error("POST /api/query-forum/:id/replies error", err);
    res.status(500).json({ error: "Failed to add reply" });
  }
});

// prevent multiple upvotes by same user
router.post("/:id/upvote", async (req, res) => {
  try {
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: "authorId is required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.upvotedBy.includes(authorId)) {
      return res.status(400).json({ error: "You already upvoted this question" });
    }

    question.upvotes += 1;
    question.upvotedBy.push(authorId);
    await question.save();

    res.json(question);
  } catch (err) {
    console.error("POST /api/query-forum/:id/upvote error", err);
    res.status(500).json({ error: "Failed to upvote question" });
  }
});

module.exports = router;



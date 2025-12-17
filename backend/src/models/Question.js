// models/Question.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },   // changed from ObjectId
    authorName: { type: String },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },   // changed from ObjectId
    authorName: { type: String },
    title: { type: String, required: true },
    body: { type: String, required: true },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);



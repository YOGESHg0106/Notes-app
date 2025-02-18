const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Add a new note
router.post("/add", authMiddleware, async (req, res) => {
  console.log("Request Body:", req.body); // Log the received data

  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  const newNote = new Note({
    title,
    description,
    userId: req.user.id,
  });

  await newNote.save();
  res.json(newNote);
});

// Fetch notes for the logged-in user
router.get("/fetch", authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

module.exports = router;

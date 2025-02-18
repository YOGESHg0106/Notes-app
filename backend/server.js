require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User schema (for authentication)
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

// Note schema
const Note = mongoose.model(
  "Note",
  new mongoose.Schema({
    title: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  })
);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).send({ error: "Access denied, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token" });
  }
};

// Routes
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password }); // Store password securely in real apps
  await user.save();
  res.send({ message: "User registered successfully" });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // Secure password check here
  if (!user) return res.status(400).send({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

// Notes routes
app.post("/api/notes/add", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res
      .status(400)
      .send({ error: "Title and description are required" });

  const note = new Note({
    title,
    description,
    userId: req.user.id,
  });
  await note.save();
  res.send(note);
});

app.get("/api/notes", authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.send(notes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

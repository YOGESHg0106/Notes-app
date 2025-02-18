const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);

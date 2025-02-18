import React, { useState, useEffect } from "react";
import { addNote, fetchNotes } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Notes.css";

const Notes = ({ token }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch notes when component mounts
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Fetch notes from the backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchNotes(token);
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form inputs for new note
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNote({
      ...newNote,
      [name]: value,
    });
  };

  // Handle Add new note
  const handleAddNote = async () => {
    if (!newNote.title || !newNote.description) {
      alert("Please fill in both fields!");
      return;
    }
    try {
      const data = await addNote(newNote, token);
      setNotes([...notes, data]); // Add the new note to the list
      setNewNote({ title: "", description: "" });
      setShowForm(false); // Close the form after submission
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  return (
    <div className="notes-container">
      <h2>My Notes</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close" : "Add Note"}
      </button>

      {showForm && (
        <div>
          <input
            type="text"
            name="title"
            value={newNote.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <textarea
            name="description"
            value={newNote.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <button onClick={handleAddNote}>Save Note</button>
        </div>
      )}

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div>
          {notes.map((note) => (
            <div key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;

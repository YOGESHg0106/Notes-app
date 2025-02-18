import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addNote } from "../api";
import "../styles/AddNote.css";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNote({ title, description }, user.token);
    alert("Note added!");
  };

  return (
    <form className="add-note" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default AddNote;

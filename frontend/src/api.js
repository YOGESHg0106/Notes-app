import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username,
      password,
    });
    return response.data; // This should return the token
  } catch (error) {
    console.error("Failed to log in", error);
    throw error;
  }
};

// Helper to register a new user
export const register = async (username, password, email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      password,
      email,
    });
    return response.data; // This should return user data (maybe including a token)
  } catch (error) {
    console.error("Failed to register", error);
    throw error;
  }
};

// Helper to add note
export const addNote = async (newNote, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/notes/add`, newNote, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add note", error);
    throw error;
  }
};

// Helper to fetch notes
export const fetchNotes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notes", error);
    throw error;
  }
};

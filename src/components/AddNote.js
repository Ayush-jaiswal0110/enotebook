import React, { useState, useContext, useEffect } from 'react';
import noteContext from "../context/notes/noteContext";

// Get backend URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;
const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "", description: "", tag: "", assignedTo: ""
  });
  const [users, setUsers] = useState([]);

  // ✅ Fetch all users from backend with token
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("🔐 No token found. User not authenticated.");
      props.showAlert("Please login to fetch users.", "danger");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (response.status === 401) {
        props.showAlert("Session expired. Please log in again.", "danger");
        console.error("❌ Unauthorized! Token may be missing or invalid.");
        return;
      }

      const json = await response.json();
      setUsers(json);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      props.showAlert("Failed to fetch users.", "danger");
    }
  };

  // ✅ Load users on mount if token exists
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    if (!note.assignedTo) {
      props.showAlert("Please select a user to assign this note", "warning");
      return;
    }

    addNote(note.title, note.description, note.tag, note.assignedTo);
    setNote({ title: "", description: "", tag: "", assignedTo: "" });
    props.showAlert("Note added successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input required minLength={5} type="text" className="form-control" value={note.title} id="title" name="title" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input required minLength={5} type="text" className="form-control" value={note.description} id="description" name="description" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input required minLength={3} type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="assignedTo" className="form-label">Assign To</label>
          <select className="form-select" id="assignedTo" name="assignedTo" value={note.assignedTo} onChange={onChange} required>
            <option value="">Select user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
      </form>
    </div>
  );
};

export default AddNote;

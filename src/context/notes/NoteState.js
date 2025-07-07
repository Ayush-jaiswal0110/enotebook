import noteContext from "./noteContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket; // global socket instance

const NoteState = (props) => {
  const host = process.env.REACT_APP_API_URL;

  //const notesInitial = []; 
  const [notes, setNotes] = useState([]);

  // Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  // Only connect socket if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket = io(host);

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("note_updated", () => {
        console.log("📡 Note update received via socket");
        getNotes(); // refresh on any update
      });

      return () => {
        socket.disconnect();
        console.log("❌ Socket disconnected");
      };
    }
  }, []);

  // Add a note
  const addNote = async (title, description, tag, assignedTo) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, assignedTo }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
    socket?.emit("note_updated");
  };

  // Delete a note
  const deleteNote = async (id) => {
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
    socket?.emit("note_updated");
  };

  // Edit a note
  // ✅ Updated Edit Note function
const editNote = async (id, title, description, tag, status, priority, assignedTo) => {
  await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, description, tag, status, priority, assignedTo }),
  });

  // Fetch updated notes from server to reflect accurate status and assigned info
  getNotes();

  // 🔁 Notify others
  socket?.emit("note_updated");
};

  return (
    <noteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;

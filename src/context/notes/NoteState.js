import noteContext from "./noteContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket; // global socket instance

const NoteState = (props) => {
  const host = process.env.REACT_APP_API_URL;
  const [notes, setNotes] = useState([]);

  // ✅ Fetch all notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setNotes(json);
    } catch (err) {
      console.error("❌ Error fetching notes:", err);
    }
  };

  // ✅ Connect to Socket.IO only after login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket = io(host, {
        transports: ["websocket", "polling"], // ✅ compatibility
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("note_updated", () => {
        console.log("📡 Note update received via socket");
        getNotes(); // Refresh notes
      });

      return () => {
        socket.disconnect();
        console.log("❌ Socket disconnected");
      };
    }
  }, [host]);

  // ✅ Add a new note
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
    setNotes([...notes, note]);
    socket?.emit("note_updated");
  };

  // ✅ Delete a note
  const deleteNote = async (id) => {
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    setNotes(notes.filter((note) => note._id !== id));
    socket?.emit("note_updated");
  };

  // ✅ Edit a note (full update support)
  const editNote = async (id, title, description, tag, status, priority, assignedTo) => {
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, status, priority, assignedTo }),
    });

    getNotes(); // Fetch fresh state
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

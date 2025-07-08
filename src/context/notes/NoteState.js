import noteContext from "./noteContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket;

const NoteState = (props) => {
  const host =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : process.env.REACT_APP_API_URL;

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

  // ✅ Establish WebSocket connection if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket = io(host, {
        transports: ["websocket", "polling"], // important for cross-platform support
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("note_updated", () => {
        console.log("📡 Note updated via socket");
        getNotes();
      });

      return () => {
        socket.disconnect();
        console.log("❌ Socket disconnected");
      };
    }
  }, [host]);

  // ✅ Add a note
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

  // ✅ Edit a note
  const editNote = async (id, title, description, tag, status, priority, assignedTo) => {
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, status, priority, assignedTo }),
    });

    getNotes();
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

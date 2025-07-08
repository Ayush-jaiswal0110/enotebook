import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { io } from "socket.io-client";

// ✅ Load Socket.IO from backend based on environment
const SOCKET_URL = process.env.REACT_APP_API_URL;
const socket = io(SOCKET_URL);

const KanbanBoard = () => {
  const { notes, getNotes, editNote } = useContext(noteContext);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const user = await res.json();
      setCurrentUser(user);
    };

    fetchCurrentUser();
    getNotes();

    socket.on("note-updated", () => {
      console.log("🔄 Note updated via Socket.IO");
      getNotes();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const onStatusChange = async (note, newStatus) => {
    await editNote(note._id, note.title, note.description, note.tag, newStatus);
    socket.emit("note_updated", { noteId: note._id });
  };

  const renderRow = (note) => {
    const canEdit =
      note.assignedTo?._id === currentUser._id || currentUser.isAdmin;

    return (
      <tr key={note._id}>
        <td className="text-center">
          {note.status === "Todo" && <span>📌</span>}
        </td>
        <td className="text-center">
          {note.status === "In Progress" && <span>🚧</span>}
        </td>
        <td className="text-center">
          {note.status === "Done" && <span>✅</span>}
        </td>
        <td className="text-center fw-semibold">{note.title}</td>
        <td className="text-center">
          {canEdit && (
            <select
              className="form-select"
              value={note.status}
              onChange={(e) => onStatusChange(note, e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📋 Kanban Board</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>📌 Todo</th>
              <th>🚧 In Progress</th>
              <th>✅ Done</th>
              <th>📄 Task</th>
              <th>🎯 Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => renderRow(note))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KanbanBoard;

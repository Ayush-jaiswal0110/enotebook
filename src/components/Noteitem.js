import React, { useContext, useEffect, useState } from 'react';
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  const [currentUser, setCurrentUser] = useState({});

  // ✅ Get current logged-in user info
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      setCurrentUser(data); // includes _id and isAdmin
    };
    getUser();
  }, []);

  // ✅ Determine if current user can edit/delete
  const canEditOrDelete =
    currentUser &&
    (currentUser.isAdmin ||                              // ✅ Admin can edit/delete all
      note.user === currentUser._id ||                   // ✅ Creator of note
      note.assignedTo?._id === currentUser._id);         // ✅ Assigned user

  return (
    <div className="col-md-3">
      <div className="card my-3 p-2">
        <h5 className="card-title">{note.title}</h5>
        <p className="card-text">{note.description}</p>
        <p className="card-text">
          <small className="text-muted">
            Assigned to: {note.assignedTo?.name || "Unassigned"}
          </small>
        </p>

        {canEditOrDelete && (
          <div className="buttonContainer d-flex justify-content-between">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Note deleted successfully", "success");
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateNote(note)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Noteitem;

// | Fix                                        | Status                                       |
// | ------------------------------------------ | -------------------------------------------- |
// | Used `currentUser._id` instead of `userId` | ✅ Fixed                                      |
// | Added `isAdmin` check                      | ✅ Admin can now see Edit/Delete              |
// | Ensured all types of users are respected   | ✅ Creator, assignee, and admin all supported |

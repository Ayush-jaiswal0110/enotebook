const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog"); // ✅ NEW
const { body, validationResult } = require("express-validator");

// ✅ Route 1: Get notes based on user role
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const notes = currentUser.isAdmin
      ? await Note.find({}).populate("assignedTo", "name email")
      : await Note.find({
          $or: [
            { user: req.user.id },
            { assignedTo: req.user.id }
          ]
        }).populate("assignedTo", "name email");

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occurred!!");
  }
});

// ✅ Route 2: Add a new note (with Smart Assign Logic)
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, status, priority, assignedTo } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id);
      let finalAssignee = assignedTo;

      // ✅ Smart Assign: if no assigned user, choose one with fewest active tasks
      if (!assignedTo) {
        const users = await User.find({ isAdmin: false });

        let minUser = null;
        let minCount = Infinity;

        for (const u of users) {
          const count = await Note.countDocuments({
            assignedTo: u._id,
            status: { $in: ['Todo', 'In Progress'] }
          });

          if (count < minCount) {
            minCount = count;
            minUser = u;
          }
        }

        finalAssignee = minUser?._id || req.user.id;
      }

      const note = new Note({
        user: req.user.id,
        title,
        description,
        tag,
        status: status || 'Todo',
        priority: priority || 'Medium',
        assignedTo: finalAssignee,
        updatedAt: Date.now()
      });

      const savedNote = await note.save();

      // ✅ Log: Created
      await ActivityLog.create({
        action: "Created",
        noteId: savedNote._id,
        noteTitle: savedNote.title,
        performedBy: user._id,
        performedByName: user.name
      });

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error occurred!!");
    }
  }
);


// ✅ Route 3: Update note (Admin or Owner only)
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag, status, priority, assignedTo } = req.body;

  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;
  if (status) newNote.status = status;
  if (priority) newNote.priority = priority;
  if (assignedTo) newNote.assignedTo = assignedTo;
  newNote.updatedAt = Date.now();

  try {
    const currentUser = await User.findById(req.user.id);
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    const isOwner = note.user.toString() === req.user.id;
    if (!isOwner && !currentUser.isAdmin) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ).populate("assignedTo", "name email");

    // ✅ Log: Updated
    await ActivityLog.create({
      action: "Updated",
      noteId: note._id,
      noteTitle: note.title,
      performedBy: currentUser._id,
      performedByName: currentUser.name
    });

    // ✅ Real-time update
    const io = req.app.get("socketio");
    io.emit("note-updated", note);

    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occurred!!");
  }
});

// ✅ Route 4: Delete note (Admin or Owner only)
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    const isOwner = note.user.toString() === req.user.id;
    if (!isOwner && !currentUser.isAdmin) {
      return res.status(401).send("Not Allowed");
    }

    await Note.findByIdAndDelete(req.params.id);

    // ✅ Log: Deleted
    await ActivityLog.create({
      action: "Deleted",
      noteId: note._id,
      noteTitle: note.title,
      performedBy: currentUser._id,
      performedByName: currentUser.name
    });

    res.json({ Success: "Note has been deleted successfully", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occurred!!");
  }
});

module.exports = router;

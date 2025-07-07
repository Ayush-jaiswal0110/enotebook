// models/ActivityLog.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivityLogSchema = new Schema({
  action: {
    type: String,
    enum: ["Created", "Updated", "Deleted"],
    required: true,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "note",
    required: true,
  },
  noteTitle: {
    type: String,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  performedByName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("activitylog", ActivityLogSchema);

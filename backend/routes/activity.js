const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// ✅ Route: GET /api/activity/logs
// ▶️ Admins: see all logs
// ▶️ Users: see only their own actions
router.get("/logs", fetchuser, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const logs = currentUser.isAdmin
      ? await ActivityLog.find({}).sort({ timestamp: -1 }) // All logs
      : await ActivityLog.find({ performedBy: currentUser._id }).sort({ timestamp: -1 }); // Own logs

    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error.message);
    res.status(500).send("Internal Server Error occurred!!");
  }
});

module.exports = router;

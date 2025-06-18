const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController")

const router = express.Router();

router.get("/exports/tasks", protect, adminOnly, exportTasksReport); // exporrta as tasks como excel ou pdf
router.get("/exports/users", protect, adminOnly, exportUsersReport); // 

module.exports = router;

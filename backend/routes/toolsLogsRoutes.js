// routes/toolLogRoutes.js

const express = require("express");
const ToolLogs = require("../controllers/toolsLogsController");

const router = express.Router();

// Route to fetch all tool logs
router.get("/", ToolLogs.getAllToolLogs);

module.exports = router;

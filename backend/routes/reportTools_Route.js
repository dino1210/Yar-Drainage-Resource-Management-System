const express = require("express");
const router = express.Router();
const reportToolsController = require("../controllers/reportTools_Cont");

// ✅ GET all tools logs report (for resource log UI)
router.get("/", reportToolsController.getAllToolsReport);

module.exports = router;
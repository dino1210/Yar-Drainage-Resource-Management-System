const express = require("express");
const router = express.Router();
const { getAllConsumablesLogs } = require("../controllers/consumablesLogsController");

router.get("/", getAllConsumablesLogs);

module.exports = router;

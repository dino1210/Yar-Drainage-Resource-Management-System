const express = require("express");
const router = express.Router();
const { getAllConsumablesLogs } = require("../controllers/consumablesLogsController");

//GET all consumables
router.get("/", getAllConsumablesLogs);

module.exports = router;
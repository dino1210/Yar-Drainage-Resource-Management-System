const express = require("express");
const router = express.Router();
const reportConsumableController = require("../controllers/reportConsumable_Cont");

router.get(
  "/consumables-report",
  reportConsumableController.getAllConsumablesReport
);

module.exports = router;

const express = require("express");
const router = express.Router();
const reportVehiclesController = require("../controllers/reportVehicles_Cont");

router.get("/vehicles-report", reportVehiclesController.getAllVehiclesReport);

module.exports = router;

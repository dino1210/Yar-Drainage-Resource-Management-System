const express = require("express");
const router = express.Router();
const { addVehicle, deleteVehicle, updateVehicle, getAllVehicles, getVehicleById } = require("../controllers/vehiclesController"); 
const upload = require("../middleware/uploadVehicle")

router.post("/", upload.single("picture"), addVehicle);
router.put("/:id", upload.single("picture"), updateVehicle);

router.delete("/:id", deleteVehicle);
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

module.exports = router;
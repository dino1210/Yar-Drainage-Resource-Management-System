const express = require("express");
const router = express.Router();
const {
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
  searchVehicles
} = require("../controllers/vehiclesController");
const upload = require("../middleware/uploadVehicle");
const db = require("../config/db");

//  Upload Image and Add Vehicle
router.post("/", upload.single("picture"), addVehicle);

//  Update Vehicle Info
router.put("/:vehicle_id", upload.single("picture"), updateVehicle);

// Delete Vehicle
router.delete("/:vehicle_id", deleteVehicle);

//  Select Available Vehicle Names Only (for dropdowns)
router.get("/select/all", async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT name FROM vehicles WHERE status = "Available"'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching available vehicles:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//  Select Available Vehicle Full Details (for Projects modal table)
router.get("/select/details", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT name, plate_no, category, assigned_driver
       FROM vehicles
       WHERE status = "Available"`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching vehicle details:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Vehicles (Full List)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vehicles");
    res.json({ vehicles: rows });
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get Vehicle by QR Code
router.get("/qr/:qr", async (req, res) => {
  const qr = decodeURIComponent(req.params.qr);
  try {
    const [results] = await db.query(
      "SELECT * FROM vehicles WHERE qr_code_id = ?",
      [qr]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.error("QR fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search
router.get("/search", searchVehicles)

//  Get Single Vehicle by ID
router.get("/:vehicle_id", getVehicleById);

module.exports = router;

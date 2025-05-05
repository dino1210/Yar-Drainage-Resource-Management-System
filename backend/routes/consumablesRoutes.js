const express = require("express");
const router = express.Router();
const {
  addConsumable,
  deleteConsumable,
  updateConsumable,
  getAllConsumables,
  getConsumableById,
  searchConsumables,
  getAvailableConsumables,
} = require("../controllers/consumablesController");
const upload = require("../middleware/uploadConsumable");
const db = require("../config/db");

//  Upload Image for consumable
router.post("/", upload.single("picture"), addConsumable);

//  Update Consumable
router.put("/:consumable_id", upload.single("picture"), updateConsumable);

//  Delete consumable
router.delete("/:consumable_id", deleteConsumable);

//  Select consumables (names only, for dropdown)
router.get("/select/all", async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name FROM consumables WHERE quantity > 0');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching available consumables:", err);
    res.status(500).send("Server error");
  }
});

//  Select consumables (names only, by status)
router.get("/select/available", async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name FROM consumables WHERE status = "Available"');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching available consumables:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//  Select consumables with full details for searchable table
router.get("/select/details", getAvailableConsumables); // <--- ADD THIS

//  Get ALL consumables
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM consumables");
    res.json({ consumables: rows });
  } catch (err) {
    console.error("Error fetching all consumables:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// SEARCH
router.get("/search", searchConsumables);

//  Get single consumable by ID
router.get("/:consumable_id", getConsumableById);

module.exports = router;

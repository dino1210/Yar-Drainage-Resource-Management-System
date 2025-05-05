const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  addTool,
  deleteTool,
  updateTool,
  getToolById,
  searchTools,
} = require("../controllers/toolsController");
const upload = require("../middleware/uploadTool");

//  CREATE tool
router.post("/", upload.single("picture"), addTool);

//  UPDATE tool
router.put("/:tool_id", upload.single("picture"), updateTool);

// GET all tools 
router.get("/", async (req, res) => {
  try {
    const [tools] = await db.query(`
      SELECT tool_id, picture, name, brand, category, tag, description, purchase_date, warranty, status, remarks, qr, qr_code_id FROM tools`);
    res.json({ tools });
  } catch (error) {
    console.error(" FETCH ALL TOOLS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

//  GET tool by QR code
router.get("/qr/:qr", async (req, res) => {
  const qr = decodeURIComponent(req.params.qr);
  try {
    const [results] = await db.query("SELECT * FROM tools WHERE qr_code_id = ?", [qr]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Tool not found" });
    }
  } catch (error) {
    console.error("QR fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET tools logs
router.get("/logs", async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT 
        id, 
        tool_name,
        performed_by,
        issued_date,
        status,
        location
      FROM tools_logs
      ORDER BY issued_date DESC
    `);
    res.json(logs);
  } catch (error) {
    console.error(" FETCH TOOLS LOGS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tools logs" });
  }
});

//  GET only available tools for selection
router.get("/select/all", async (req, res) => {
  try {
    const [tools] = await db.query(`
      SELECT id, name
      FROM tools
      WHERE status = 'Available'
    `);
    res.json(tools);
  } catch (error) {
    console.error(" FETCH AVAILABLE TOOLS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch available tools" });
  }
});

//  DELETE tool
router.delete("/:tool_id", deleteTool);

// SEARCH
router.get("/search", searchTools);

//  GET single tool by ID
router.get("/:id", getToolById);


module.exports = router;

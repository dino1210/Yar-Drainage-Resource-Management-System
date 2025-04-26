const express = require("express");
const router = express.Router();
const {
    addTool,
    deleteTool,
    updateTool,
    getAllTools,
    getToolById
} = require("../controllers/toolsController");

const upload = require("../middleware/uploadTool");
const db = require("../config/db"); // Make sure to import your DB connection

// Accept image uploads in POST and PUT
router.post("/", upload.single("picture"), addTool);
router.put("/:id", upload.single("picture"), updateTool);
router.delete("/:id", deleteTool);

// ✅ QR route must go BEFORE :id route
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

router.get("/", getAllTools);
router.get("/:id", getToolById);

module.exports = router;

const express = require("express");
const router = express.Router();
const { addConsumable, deleteConsumable, updateConsumable, getAllConsumables, getConsumableById } = require("../controllers/consumablesController"); 
const upload = require("../middleware/uploadConsumable")

router.post("/", upload.single("picture"), addConsumable);
router.put("/:id", upload.single("picture"), updateConsumable);

router.delete("/:id", deleteConsumable);
router.get("/", getAllConsumables);
router.get("/:id", getConsumableById);

module.exports = router;
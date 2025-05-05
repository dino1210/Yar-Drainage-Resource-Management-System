const express = require("express");
const router = express.Router();
const {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoriesController");
const { searchConsumables } = require("../controllers/consumablesController");

// Get all categories
router.get("/", getAllCategories);

// Get a single category by ID
router.get("/:id", getCategoryById);

// Create a new category
router.post("/", addCategory);

// Update a category by ID
router.put("/:id", updateCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;

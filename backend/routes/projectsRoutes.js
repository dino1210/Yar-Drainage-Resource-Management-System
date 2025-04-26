const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectsController");

// GET all
router.get("/", projectController.getAllProjects);

// POST new 
router.post("/", projectController.createProject);

// PUT update
router.put("/:id", projectController.updateProject);

module.exports = router;

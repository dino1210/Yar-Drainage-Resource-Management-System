// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/", projectController.createProject);
router.put("/update/:project_id", projectController.updateProject)
router.get("/", projectController.getAllProjects);
router.get("/recent", projectController.getRecentProjects);
router.put("/update-status/:project_id", projectController.updateProjectStatus);
router.get("/:id", projectController.getProjectById);
router.delete("/delete/:project_id", projectController.deleteProject);

module.exports = router;

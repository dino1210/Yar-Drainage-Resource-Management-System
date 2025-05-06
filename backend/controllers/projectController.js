// controllers/projectController.js
const Project = require("../models/projectModel");

const createProject = async (req, res) => {
  try {
    const {
      name,
      person_in_charge,
      location,
      description,
      start_date,
      end_date,
      tool_ids,
      consumable_ids,
      created_by,
      vehicle_ids,
    } = req.body;

    if ( 
      !name ||
      !person_in_charge ||
      !description ||
      !location ||
      !start_date ||
      !end_date ||
      !created_by 
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new project
    const result = await Project.createProject({
      name,
      person_in_charge,
      location,
      description,
      start_date,
      end_date,
      created_by,
    });

    const projectId = result.insertId;
    console.log("Project created with ID:", projectId);
    console.log("Tool IDs received:", tool_ids); // already in your snippet

    if (tool_ids && tool_ids.length > 0) {
      try {
        await Project.linkToolsToProject(projectId, tool_ids, start_date);
      } catch (err) {
        console.error("Error in linkToolsToProject:", err);
        return res
          .status(500)
          .json({ message: "Failed to link tools to project." });
      }
    }

    // Link vehicles to the project
    if (consumable_ids && consumable_ids.length > 0) {
      try {
        await Project.linkConsumablesToProject(projectId, consumable_ids, start_date);
      } catch (err) {
        console.error("Error in linkConsumablesToProject:", err);
        return res
          .status(500)
          .json({ message: "Failed to link consumables to project." });
      }
    }

    // Link vehicles to the project
    if (vehicle_ids && vehicle_ids.length > 0) {
      try {
        await Project.linkVehiclesToProject(projectId, vehicle_ids, start_date);
      } catch (err) {
        console.error("Error in linkVehiclesToProject:", err);
        return res
          .status(500)
          .json({ message: "Failed to link vehicles to project." });
      }
    }

    res.status(201).json({
      message: "Project created successfully",
      projectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tool by ID
const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
};

const getRecentProjects = async (req, res) => {
  try {
    const recentProjects = await Project.getRecentProjects();
    res.status(200).json(recentProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProjectStatus = async (req, res) => {
  const { project_id } = req.params;
  const { manual_status } = req.body;

  try {
    await updateProjectStatus(project_id, manual_status); 
    await updateResourceStatus(project_id, manual_status);

    res.status(200).json({ message: `Project status updated to ${manual_status}` });
  } catch (error) {
    console.error("Error updating project status:", error.message);
    res.status(500).json({ message: "Failed to update project status", error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getRecentProjects,
  updateProjectStatus,
  getProjectById
};

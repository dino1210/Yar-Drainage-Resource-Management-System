const Tool = require("../models/toolsModel");

// Add New Tool
const addTool = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const toolData = {
      ...req.body,
      picture: file.filename,
    };

    const result = await Tool.addTool(toolData);
    res.status(201).json({ message: "Tool added successfully", data: result });
  } catch (err) {
    console.error("Error adding tool:", err.message);
    res.status(500).json({ message: "Error adding tool", error: err.message });
  }
};

// Delete Tool
const deleteTool = async (req, res) => {
  const toolId = req.params.tool_id;
  try {
    await Tool.deleteTool(toolId);
    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (err) {
    console.error("Error deleting tool:", err.message);
    res.status(500).json({ message: "Error deleting tool", error: err.message });
  }
};

// Update Tool
const updateTool = async (req, res) => {
  const toolId = req.params.tool_id;
  const toolData = {
    ...req.body,
    tool_id: toolId,
    picture: req.file ? req.file.filename : req.body.picture,
  };

  try {
    const result = await Tool.updateTool(toolData);
    res.status(200).json({ message: "Tool updated successfully", data: result });
  } catch (err) {
    console.error("Error updating tool:", err.message);
    res.status(500).json({ message: "Error updating tool", error: err.message });
  }
};

// Get All Tools
const getAllTools = async (req, res) => {
  try {
    const tools = await Tool.getAllTools();
    res.status(200).json(tools);
  } catch (err) {
    console.error("Error fetching tools:", err.message);
    res.status(500).json({ message: "Error fetching tools", error: err.message });
  }
};

// Search Tools by name
const searchTools = async (req, res) => {
  const query = req.query.q;

  try {
    const tools = await Tool.searchTools(query);
    res.status(200).json(tools);
  } catch (err) {
    console.error("Error searching tools:", err.message);
    res.status(500).json({ message: "Error searching tools", error: err.message });
  }
};

// Get Tool by ID
const getToolById = async (req, res) => {
  const toolId = req.params.id;
  try {
    const tool = await Tool.getToolById(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }
    res.status(200).json(tool);
  } catch (err) {
    console.error("Error fetching tool:", err.message);
    res.status(500).json({ message: "Error fetching tool", error: err.message });
  }
};

// Get Available Tools for Project Modal
const getAvailableTools = async (req, res) => {
  try {
    const tools = await Tool.getAllTools();
    const available = tools.filter((tool) => tool.status === "Available");
    res.status(200).json(available.map((tool) => ({ name: tool.name })));
  } catch (err) {
    console.error("Error fetching available tools:", err.message);
    res.status(500).json({ message: "Error fetching available tools", error: err.message });
  }
};



module.exports = {
  addTool,
  deleteTool,
  updateTool,
  getAllTools,
  getToolById,
  getAvailableTools,
  searchTools,
};

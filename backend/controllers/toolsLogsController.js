// controllers/toolLogController.js

const ToolLogs = require("../models/toolsLogsModel");

const getAllToolLogs = async (req, res) => {
  try {
    const toolLogs = await ToolLogs.getToolLogs();
    res.status(200).json({ toolLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllToolLogs,
};

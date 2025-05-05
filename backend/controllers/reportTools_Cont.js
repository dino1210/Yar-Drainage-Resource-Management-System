const reportToolsModel = require("../models/reportTools_Model");

const reportToolsController = {
  getAllToolsReport: async (req, res) => {
    try {
      const tools = await reportToolsModel.getAllTools();
      res.status(200).json(tools);
    } catch (error) {
      console.error("Error in getAllToolsReport:", error);
      res.status(500).json({ message: "Server error fetching tools report" });
    }
  },
};

module.exports = reportToolsController;

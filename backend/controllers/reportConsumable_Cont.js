const reportConsumableModel = require("../models/reportConsumable_Model");

const reportConsumableController = {
  getAllConsumablesReport: async (req, res) => {
    try {
      const consumables = await reportConsumableModel.getAllConsumables();
      res.status(200).json(consumables);
    } catch (error) {
      console.error("Error in getAllConsumablesReport:", error);
      res
        .status(500)
        .json({ message: "Server error fetching consumables report" });
    }
  },
};

module.exports = reportConsumableController;

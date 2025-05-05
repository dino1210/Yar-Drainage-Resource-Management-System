const reportVehiclesModel = require("../models/reportVehicles_Model");

const reportVehiclesController = {
  getAllVehiclesReport: async (req, res) => {
    try {
      const vehicles = await reportVehiclesModel.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (error) {
      console.error("Error in getAllVehiclesReport:", error);
      res
        .status(500)
        .json({ message: "Server error fetching vehicles report" });
    }
  },
};

module.exports = reportVehiclesController;

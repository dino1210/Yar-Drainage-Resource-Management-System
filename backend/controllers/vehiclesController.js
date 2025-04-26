const Vehicle = require("../models/vehiclesModel");

// Controller for ADD
const addVehicle = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const vehicleData = {
            ...req.body,
            picture: file.filename
        };
   
        const result = await Vehicle.addVehicle(vehicleData);
        res.status(201).json({ message: "Vehicle added successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Error adding vehicle", error: err.message });
    }
};
  
// Controller for DELETE
const deleteVehicle = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const result = await Vehicle.deleteVehicle(vehicleId);
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting vehicle", error: err.message });
    }
};

// Controller for UPDATE
const updateVehicle = async (req, res) => {
    const vehicleId = req.params.id;
    const vehicleData = req.body;
    vehicleData.id = vehicleId;

    try {
        const result = await Vehicle.updateVehicle(vehicleData);
        res.status(200).json({ message: "Vehicle updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Error updating vehicle", error: err.message });
    }
};

// Controller for GET ALL VEHICLES
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.getAllVehicles();
        res.status(200).json({ vehicles });
    } catch (err) {
        res.status(500).json({ message: "Error fetching vehicles", error: err.message });
    }
};

// Controller for GET VEHICLE BY ID
const getVehicleById = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const vehicle = await Vehicle.getVehicleById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ vehicle });
    } catch (err) {
        res.status(500).json({ message: "Error fetching vehicle", error: err.message });
    }
};

module.exports = { addVehicle, deleteVehicle, updateVehicle, getAllVehicles, getVehicleById };

const Consumable = require("../models/consumableModel");

// Controller for ADD
const addConsumable = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const consumableData = {
            ...req.body,
            picture: file.filename
        };
 
        const result = await Consumable.addConsumable(consumableData);
        res.status(201).json({ message: "Tool added successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Error adding tool", error: err.message });
    }
};
 
// Controller for DELETE
const deleteConsumable = async (req, res) => {
    const consumableId = req.params.id;
    try {
        const result = await Consumable.deleteConsumable(consumableId);
        res.status(200).json({ message: "Consumable deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting consumable", error: err.message });
    }
};

// Controller for UPDATE
const updateConsumable = async (req, res) => {
    const consumableId = req.params.id;
    const consumableData = req.body;
    consumableData.id = consumableId;

    try {
        const result = await Consumable.updateConsumable(consumableData);
        res.status(200).json({ message: "Consumable updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Error updating consumable", error: err.message });
    }
};

// Controller for GET ALL CONSUMABLES
const getAllConsumables = async (req, res) => {
    try {
        const consumables = await Consumable.getAllConsumables();
        res.status(200).json({ consumables });
    } catch (err) {
        res.status(500).json({ message: "Error fetching consumables", error: err.message });
    }
};

// Controller for GET TOOL BY ID
const getConsumableById = async (req, res) => {
    const consumableId = req.params.id;
    try {
        const consumable = await Consumable.getConsumableById(consumableId);
        if (!consumable) {
            return res.status(404).json({ message: "Consumable not found" });
        }
        res.status(200).json({ consumable });
    } catch (err) {
        res.status(500).json({ message: "Error fetching consumable", error: err.message });
    }
};

module.exports = { addConsumable, deleteConsumable, updateConsumable, getAllConsumables, getConsumableById };

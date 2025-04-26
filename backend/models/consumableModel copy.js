const db = require("../config/db");

// ADD
const addConsumable = async (consumableData) => {
    const { picture, tag, name, category, quantity, minStock, unit, location, date, status = "In Stock", qr } = consumableData;
    const query = `INSERT INTO consumables (picture, tag, name, category, quantity, minStock, unit, location, status, qr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(query, [picture, tag, name, category, quantity, minStock, unit, location, status, qr]);
        return result;
    } catch (err) {
        throw new Error('Error adding consumable: ' + err.message);
    }
};
 
// DELETE
const deleteConsumable = async (consumableID) => {
    const query = `DELETE FROM consumables WHERE id = ?`;

    try {
        const [result] = await db.query(query, [consumableID]);
        return result;
    } catch (err) {
        throw new Error('Error deleting consumable: ' + err.message);
    }
};

// UPDATE
const updateConsumable = async (consumableData) => {
    const { picture, tag, name, category, quantity, minStock, unit, location, status, qr, id } = consumableData;
    const query = `UPDATE consumables SET picture = ?, tag = ?, name = ?, category = ?, quantity = ?, minStock = ?, unit = ?, location = ?, status = ?, qr = ? WHERE id = ?`;


    try {
        const [result] = await db.query(query, [picture, tag, name, category, quantity, minStock, unit, location, status, qr, id]);
        return result;
    } catch (err) {
        throw new Error('Error updating consumable: ' + err.message);
    }
};

// GET ALL CONSUMABLES
const getAllConsumables = async () => {
    const query = `SELECT * FROM consumables`;

    try {
        const [results] = await db.query(query);
        return results;
    } catch (err) {
        throw new Error('Error fetching consumables: ' + err.message);
    }
};

// GET SINGLE TOOL BY ID
const getConsumableById = async (consumableId) => {
    const query = `SELECT * FROM consumables WHERE id = ?`;

    try {
        const [results] = await db.query(query, [consumableId]);
        return results[0]; 
    } catch (err) {
        throw new Error('Error fetching tool by ID: ' + err.message);
    }
};

module.exports = { addConsumable, deleteConsumable, updateConsumable, getAllConsumables, getConsumableById };

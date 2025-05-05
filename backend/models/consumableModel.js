const db = require("../config/db");

// ADD
const addConsumable = async (consumableData) => {
    const { picture, tag, name, category, quantity, minStock, unit, location, date, status = "In Stock", qr } = consumableData;
    const query = `INSERT INTO consumables (picture, tag, name, category, quantity, minStock, unit, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(query, [picture, tag, name, category, quantity, minStock, unit, location, status]);
        return result;
    } catch (err) {
        throw new Error('Error adding consumable: ' + err.message);
    }
};
 
// DELETE
const deleteConsumable = async (consumableID) => {
    const query = `DELETE FROM consumables WHERE consumable_id = ?`;

    try {
        const [result] = await db.query(query, [consumableID]);
        return result;
    } catch (err) {
        throw new Error('Error deleting consumable: ' + err.message);
    }
};

// UPDATE
const updateConsumable = async (consumableData) => {
    const { tag, name, category, quantity, minStock, unit, location, status, qr, consumable_id } = consumableData;
    const query = `UPDATE consumables SET tag = ?, name = ?, category = ?, quantity = ?, minStock = ?, unit = ?, location = ?, qr = ? WHERE consumable_id = ?`;


    try {
        const [result] = await db.query(query, [tag, name, category, quantity, minStock, unit, location, qr, consumable_id]);
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
    const query = `SELECT * FROM consumables WHERE consumable_id = ?`;

    try {
        const [results] = await db.query(query, [consumableId]);
        return results[0]; 
    } catch (err) {
        throw new Error('Error fetching tool by ID: ' + err.message);
    }
};

const searchConsumables = async (query) => {
    const [rows] = await db.query(
      `
      SELECT consumable_id, name, tag, quantity, unit 
      FROM consumables 
      WHERE status = 'In Stock'
        AND (
          LOWER(name) LIKE LOWER(?) OR 
          LOWER(tag) LIKE LOWER(?) OR 
          LOWER(quantity) LIKE LOWER(?) OR 
          LOWER(unit) LIKE LOWER(?)
        )
      LIMIT 3
      `,
      Array(4).fill(`%${query}%`)
    );
    return rows;
  };

module.exports = { addConsumable, deleteConsumable, updateConsumable, getAllConsumables, getConsumableById, searchConsumables };

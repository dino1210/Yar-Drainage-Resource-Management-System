const db = require("../config/db");

// ADD
const addCategory = async (categoryData) => {
    const { category_type, category_name } = categoryData;
    const query = `INSERT INTO categories ( category_type, category_name) VALUES (?, ?)`;

    try {
        const [result] = await db.query(query, [category_type, category_name]);
        return result;
    } catch (err) {
        throw new Error('Error adding category: ' + err.message);
    }
};
 
// DELETE
const deleteCategory = async (categoryID) => {
    const query = `DELETE FROM categories WHERE category_id = ?`;

    try {
        const [result] = await db.query(query, [categoryID]);
        return result;
    } catch (err) {
        throw new Error('Error deleting category: ' + err.message);
    }
};

// UPDATE
const updateCategory = async (categoryData) => {
    const { category_type, category_name } = categoryData;
    const query = `UPDATE categories SET category_type = ?, category_name = ? WHERE category_id = ?`;


    try {
        const [result] = await db.query(query, [category_type, category_name, category_id]);
        return result;
    } catch (err) {
        throw new Error('Error updating category: ' + err.message);
    }
};

// GET ALL CONSUMABLES
const getAllCategories = async () => {
    const query = `SELECT * FROM categories`;

    try {
        const [results] = await db.query(query);
        return results;
    } catch (err) {
        throw new Error('Error fetching categories: ' + err.message);
    }
};

// GET SINGLE TOOL BY ID
const getCategoryById = async (categoryId) => {
    const query = `SELECT * FROM categories WHERE category_id = ?`;

    try {
        const [results] = await db.query(query, [categoryId]);
        return results[0]; 
    } catch (err) {
        throw new Error('Error fetching category by ID: ' + err.message);
    }
};

module.exports = { addCategory, deleteCategory, updateCategory, getAllCategories, getCategoryById };

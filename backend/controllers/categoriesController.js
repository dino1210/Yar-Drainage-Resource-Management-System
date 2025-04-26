const db = require("../config/db")

const getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error categories", error })
    }
}; 

module.exports = { getAllCategories };
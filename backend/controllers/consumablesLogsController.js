const db = require("../config/db")

const getAllConsumablesLogs = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM consumables_logs");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching consumables logs", error })
    }
}; 

module.exports = { getAllConsumablesLogs };
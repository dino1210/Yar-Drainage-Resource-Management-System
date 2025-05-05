const db = require("../config/db");

exports.getAllConsumablesLogs = async (req, res) => {
  try {
    const [logs] = await db.query(
      `SELECT * FROM consumables_logs ORDER BY issued_date DESC`
    );
    res.json(logs);
  } catch (err) {
    console.error("GET CONSUMABLES LOGS ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch consumables logs" });
  }
};

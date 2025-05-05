const db = require("../config/db");

exports.getAllVehicleLogs = async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT 
        id, 
        vehicle_name,
        performed_by,
        issued_date,
        status
      FROM vehicles_logs
      ORDER BY issued_date DESC
    `);
    res.json(logs);
  } catch (err) {
    console.error("FETCH VEHICLE LOGS ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch vehicle logs" });
  }
};

// models/toolLogModel.js

const db = require("../config/db"); // Assuming you have a configured database connection

const getToolLogs = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM tool_logs ORDER BY date DESC");
    return rows;
  } catch (error) {
    throw new Error("Error fetching tool logs");
  }
};

module.exports = {
  getToolLogs,
};

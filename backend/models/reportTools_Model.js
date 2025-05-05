const db = require("../config/db");

const reportToolsModel = {
  getAllTools: async () => {
    const query = `
      SELECT 
        tr.id,
        tr.tool_tag,
        tr.tool_name,
        tr.performed_by,
        tr.issued_date,
        tr.status
      FROM 
        tools_logs AS tr
      ORDER BY tr.issued_date DESC
    `;

    const [rows] = await db.query(query); // ✅ Promise-style MySQL2
    return rows;
  },
};

module.exports = reportToolsModel;
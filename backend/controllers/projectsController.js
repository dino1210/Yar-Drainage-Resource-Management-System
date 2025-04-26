const db = require("../config/db");

//  GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects");
    res.json(rows);
  } catch (err) {
    console.error("❌ GET PROJECTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  POST new project
exports.createProject = async (req, res) => {
  const {
    title,
    manager,
    personInCharge,       // camelCase from frontend
    tools,                // camelCase from frontend
    startDate,
    endDate,
    status,
  } = req.body;

  const creator = "Yard Admin"; // default creator

  try {
    const query = `
      INSERT INTO projects 
      (title, manager, person_in_charge, creator, tools_equipment_used, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      title,
      manager,
      personInCharge,
      creator,
      tools,
      startDate,
      endDate,
      status,
    ]);

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT update project
exports.updateProject = async (req, res) => {
  const {
    title,
    manager,
    personInCharge,       // camelCase from frontend
    tools,                // camelCase from frontend
    startDate,
    endDate,
    status,
  } = req.body;

  const { id } = req.params;

  try {
    const query = `
      UPDATE projects 
      SET title = ?, manager = ?, person_in_charge = ?, tools_equipment_used = ?, start_date = ?, end_date = ?, status = ?
      WHERE id = ?
    `;
    await db.query(query, [
      title,
      manager,
      personInCharge,
      tools,
      startDate,
      endDate,
      status,
      id,
    ]);

    res.json({ message: "Project updated successfully" });
  } catch (err) {
    console.error(" UPDATE PROJECT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

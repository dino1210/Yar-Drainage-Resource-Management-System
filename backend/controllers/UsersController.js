const db = require("../config/db");
const bcrypt = require("bcryptjs");

//  Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role, status, DATE_FORMAT(date_created, '%Y-%m-%d %H:%i:%s') AS date_created FROM users");
    res.json(rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  Add new user (with password hash + status + date_created)
exports.createUser = async (req, res) => {
  const { name, email, role, status, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, role, status, password, date_created) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, email, role, status, hashedPassword]
    );

    const [user] = await db.query("SELECT id, name, email, role, status, DATE_FORMAT(date_created, '%Y-%m-%d %H:%i:%s') AS date_created FROM users WHERE id = ?", [result.insertId]);

    res.json(user[0]);
  } catch (err) {
    console.error("CREATE USER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?",
      [name, email, role, status, id]
    );
    res.json({ id, name, email, role, status });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

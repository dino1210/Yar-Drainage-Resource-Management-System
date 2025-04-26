const db = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows;
  },

  create: async (user) => {
    const { name, email, password, role } = user;
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
      [name, email, password, role]);
  },

  findById: async (userId) => {
    const [rows] = await db.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);
    return rows.length ? rows[0] : null;
  }
};

module.exports = User;

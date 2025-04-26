const express = require("express");
const router = express.Router();
const userController = require("../controllers/UsersController");

const authenticateUser = require("../middleware/authMiddleware");
const db = require("../config/db");

//  GET all users
router.get("/", userController.getAllUsers);

// Create new user
router.post("/", userController.createUser);

//  Update user by ID
router.put("/:id", userController.updateUser);

//  Delete user by ID
router.delete("/:id", userController.deleteUser);

// Get user role (protected route with JWT middleware)
router.get("/getUserRole", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role: rows[0].role });
  } catch (err) {
    console.error("GET USER ROLE ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

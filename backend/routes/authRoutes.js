const express = require("express");
const { register, login, getUserRole} = require("../controllers/authControllers");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user-role", getUserRole);
router.get("/profile", authenticate, getUserRole)


module.exports = router;




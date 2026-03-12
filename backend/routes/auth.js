const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserGarden = require("../models/UserGarden");


router.post("/signup", async (req, res) => {
  try {
    const { username, password, avatarUrl, email } = req.body;

    const normalized = String(username || "").trim().toLowerCase();
    if (!normalized) return res.status(400).json({ message: "Username is required" });
    
    if (!password) return res.status(400).json({ message: "Password is required" });

    const existingUser = await User.findOne({ username: normalized });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });
    
       // אם אימייל נשלח — נבדוק שהוא לא תפוס
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (normalizedEmail) {
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: normalized,
      email: normalizedEmail || undefined, 
      password: hashedPassword,
      avatarUrl: avatarUrl || "",
    });
    
    await UserGarden.create({
      userId: newUser._id,
      plants: [],
    });

     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
     return res.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        avatarUrl: newUser.avatarUrl || "",
      },
    });
   } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const normalized = String(username || "").trim().toLowerCase();
    const user = await User.findOne({ username: normalized });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName || "",
        avatarUrl: user.avatarUrl || "",
      },
    });
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  res.json({ message: "OK", userId: req.user.id });
});


module.exports = router;

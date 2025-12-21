const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.json({ token, user: { id: newUser._id, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // חיפוש המשתמש
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong password" });

    // JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("user is : ", user)
    console.log("process.env.JWT_SECRET is : ", process.env.JWT_SECRET)
    console.log("token is:", token);
    res.json({
      token,
      user: { id: user._id, email: user.email },
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

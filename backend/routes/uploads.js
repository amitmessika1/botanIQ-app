const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const auth = require("../middleware/auth");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed"));
  },
});

// POST /uploads  (field name: "image")
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // URL ציבורי לתמונה
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ ok: true, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

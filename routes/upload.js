// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Pastikan folder uploads ada
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDir(path.join(__dirname, "..", "uploads"));

// ---- File filters & limits ----
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Hanya file gambar yang diperbolehkan"), false);
  }
  cb(null, true);
};

// ---- Storage untuk gambar umum ----
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join("uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `img-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ---- Routes ----

// Upload gambar umum
router.post("/", upload.single("gambar"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Gagal upload" });

    // Kembalikan path relatif (frontend akan prefix window.location.origin)
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ imageUrl });
  } catch (err) {
    console.error("Upload gambar error:", err);
    return res.status(500).json({ error: "Gagal upload gambar" });
  }
});

// Upload gambar hero
router.post("/hero", upload.single("gambar"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Gagal upload" });

    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ imageUrl });
  } catch (err) {
    console.error("Upload hero error:", err);
    return res.status(500).json({ error: "Gagal upload hero" });
  }
});

module.exports = router;

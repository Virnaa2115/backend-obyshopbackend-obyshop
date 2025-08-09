const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// === 1. Konfigurasi Upload Gambar ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// === 2. Public: Ambil semua produk (dengan pencarian) ===
router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    let filter = {};

    if (q) {
      const keyword = new RegExp(q, "i");
      filter = {
        $or: [
          { nama: keyword },
          { deskripsi: keyword }
        ]
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Kirim array langsung agar cocok dengan fetch-data.js
    res.json(products);

  } catch (err) {
    console.error("❌ Gagal mengambil produk:", err);
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
});

// === 3. Admin: Tambah produk ===
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      nama,
      harga,
      deskripsi,
      produkBaru,
      produkUtama,
    } = req.body;

    const product = new Product({
      nama,
      harga,
      deskripsi,
      produkBaru: produkBaru === "true" || produkBaru === true,
      produkUtama: produkUtama === "true" || produkUtama === true,
      imageFilename: req.file?.filename || "",
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Gagal tambah produk:", err);
    res.status(500).json({ error: "Gagal menambahkan produk" });
  }
});

// === 4. Admin: Update produk ===
router.put("/:id", auth, async (req, res) => {
  try {
    const data = {
      ...req.body,
      produkBaru: req.body.produkBaru === "true" || req.body.produkBaru === true,
      produkUtama: req.body.produkUtama === "true" || req.body.produkUtama === true,
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate produk" });
  }
});

// === 5. Admin: Hapus produk ===
router.delete("/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});

// === 6. Optional: Get produk by ID (buat edit) ===
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil detail produk" });
  }
});

module.exports = router;

const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

// 🔍 Debug: cek apakah MONGO_URI terbaca
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI tidak ditemukan. Pastikan sudah ada di .env atau environment variables.");
  process.exit(1); // Hentikan proses
}

console.log("📦 MONGO_URI terbaca:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static folder untuk file uploads (gambar saja)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/content", require("./routes/content"));
app.use("/api/upload", require("./routes/upload"));

// Database Connection & Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

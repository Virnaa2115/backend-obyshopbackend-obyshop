const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    harga: Number,
    deskripsi: String,
    produkBaru: { type: Boolean, default: false },
    produkUtama: { type: Boolean, default: false },
    imageFilename: String,
  },
  { timestamps: true }
);

// ✅ Tambahkan index teks untuk pencarian nama produk
productSchema.index({ nama: "text" });

module.exports = mongoose.model("Product", productSchema);

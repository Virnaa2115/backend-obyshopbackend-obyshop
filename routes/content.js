const express = require("express");
const Content = require("../models/Content");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// === GET /api/content ===
router.get("/", async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) return res.json({});

    res.json({
      heroTitle: content.heroTitle || "",
      heroSubtitle: content.heroSubtitle || "",
      heroTitleColor: content.heroTitleColor || "",
      heroSubtitleColor: content.heroSubtitleColor || "",
      heroBackgroundImage: content.heroBackgroundImage || "",
      aboutText: content.aboutText || "",
      contactInfo: content.contactInfo || {},
      whatsapp: content.whatsapp || {},
      socialMedia: content.socialMedia || {},
      theme: content.theme || {},
    });
  } catch (err) {
    console.error("Gagal mengambil konten:", err);
    res.status(500).json({ error: "Gagal mengambil konten" });
  }
});

// === PUT /api/content ===
router.put("/", auth, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = new Content();

    const {
      heroTitle,
      heroSubtitle,
      heroTitleColor,
      heroSubtitleColor,
      heroBackgroundImage,
      aboutText,
      contactInfo,
      whatsapp,
      socialMedia,
      theme,
    } = req.body;

    content.heroTitle = heroTitle ?? content.heroTitle;
    content.heroSubtitle = heroSubtitle ?? content.heroSubtitle;
    content.heroTitleColor = heroTitleColor ?? content.heroTitleColor;
    content.heroSubtitleColor = heroSubtitleColor ?? content.heroSubtitleColor;
    content.heroBackgroundImage = heroBackgroundImage ?? content.heroBackgroundImage;
    content.aboutText = aboutText ?? content.aboutText;
    content.contactInfo = contactInfo || content.contactInfo || {};
    content.whatsapp = whatsapp || content.whatsapp || {};
    content.socialMedia = socialMedia || content.socialMedia || {};
    content.theme = theme || content.theme || {};

    const saved = await content.save();

    res.json({
      message: "Konten berhasil diperbarui",
      content: saved,
    });
  } catch (err) {
    console.error("❌ Gagal update konten:", err);
    res.status(500).json({ error: "Gagal menyimpan konten" });
  }
});

module.exports = router;

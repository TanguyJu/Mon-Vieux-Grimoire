const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}.webp`;
  const outputPath = path.join(__dirname, '../images', filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 500 })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    next();
  } catch (error) {
    console.error('Erreur Sharp :', error);
    res.status(500).json({ error: "Erreur lors du traitement de l'image" });
  }
};
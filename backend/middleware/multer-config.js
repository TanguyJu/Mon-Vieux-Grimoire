const multer = require('multer');

const MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.memoryStorage();

module.exports = multer({ storage }).single('image');
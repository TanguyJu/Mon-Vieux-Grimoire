const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpProcessor = require('../middleware/sharp-processor');
const bookController = require('../controllers/bookController');

router.post('/', auth, multer, sharpProcessor, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getBestRatedBooks);
router.get('/:id', bookController.getOneBook);
router.post('/:id/rating', auth, bookController.rateBook);
router.put('/:id', auth, multer, sharpProcessor, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
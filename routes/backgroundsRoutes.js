const express = require('express');
const router = express.Router();
const backgroundsController = require('../controllers/backgroundsController');

router.get('/', backgroundsController.getAllBackgrounds);
router.post('/add', backgroundsController.addBackground);
router.delete('/:id', backgroundsController.deleteBackground);
router.post('/select', backgroundsController.selectBackground);

module.exports = router;

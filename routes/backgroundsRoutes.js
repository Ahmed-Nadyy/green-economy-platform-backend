const express = require('express');
const router = express.Router();
const backgroundsController = require('../controllers/backgroundsController');
const { protected } = require("../middlewares/auth.middleware");

router.get('/', backgroundsController.getAllBackgrounds);

router.post('/add',protected, backgroundsController.addBackground);

router.post('/select',protected, backgroundsController.selectBackground);
router.post('/get-backgrounds-by-sections',backgroundsController.getSection);
module.exports = router;

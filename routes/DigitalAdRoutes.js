const router = require('express').Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/DigitalAdCtrl')

router.post('/', upload.array('images', 9), controller.createDigitalAd);
router.get('/', controller.getAllDigitalAds); // Get List
router.get('/:id', controller.getDigitalAdById); // Get Detail

module.exports = router;
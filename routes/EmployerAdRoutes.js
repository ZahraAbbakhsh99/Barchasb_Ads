const router = require('express').Router();
const upload = require('../middleware/upload');
const employerController = require('../controllers/EmployerAdCtrl');

router.post('/', upload.array('images', 9), employerController.createEmployerAd);
router.get('/', employerController.getAllEmployerAds); // Get List
router.get('/:id', employerController.getEmployerAdById); // Get Detail

module.exports = router;
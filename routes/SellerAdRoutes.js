const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const sellerController = require('../controllers/SellerAdCtrl');

// @route   POST /api/ads
// @desc    Create a new advertisement
router.post('/', upload.array('images', 9), sellerController.createSellerAd);

router.get('/', sellerController.getAllSellerAds); // Get List
router.get('/:id', sellerController.getSellerAdById); // Get Detail

module.exports = router;
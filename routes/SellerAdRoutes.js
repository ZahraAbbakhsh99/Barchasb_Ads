const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const sellerController = require('../controllers/SellerAdCtrl');

// @route   POST /api/ads
// @desc    Create a new advertisement
router.post('/', upload.array('images', 9), sellerController.createSellerAd);

module.exports = router;
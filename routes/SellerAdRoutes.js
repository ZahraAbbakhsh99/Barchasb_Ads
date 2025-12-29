const express = require('express');
const router = express.Router();
const SellerAd = require('../models/SellerAd');
const upload = require('../middleware/upload');


// @route   POST /api/ads
// @desc    Create a new advertisement
router.post('/', upload.array('images', 9), async (req, res) => {
    try {
        const images = req.files.map((file, index) => ({
            url: file.path,
            isMain: index === 0 // First image is main by default
        }));
        
        const ad = new SellerAd({ ...req.body, images });
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
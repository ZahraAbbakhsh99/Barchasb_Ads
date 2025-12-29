const SellerAd = require('../models/SellerAd');

// post seller ad
exports.createSellerAd = async (req, res) => {
    try {
        // Map the uploaded files to the image schema structure
        const images = req.files ? req.files.map((file, index) => ({
            url: file.path,
            isMain: index === 0 // Automatically set the first image as the main one
        })) : [];
        
        // Create the new ad using the request body and the processed images
        const ad = new SellerAd({ 
            ...req.body, 
            images 
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all seller ads
exports.getAllSellerAds = async (req, res) => {
    try {
        const ads = await SellerAd.find().populate('owner', 'fullName phoneNumber');
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single seller ad
exports.getSellerAdById = async (req, res) => {
    try {
        const ad = await SellerAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
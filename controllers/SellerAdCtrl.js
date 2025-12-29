const SellerAd = require('../models/SellerAd');

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
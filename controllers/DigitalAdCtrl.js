const DigitalAd = require('../models/DigitalAd');

// post digital ad
exports.createDigitalAd = async (req, res) => {
    try {
        // Handle images
        const images = req.files ? req.files.map((file, i) => ({ 
            url: file.path, 
            isMain: i === 0 
        })) : [];
        
        let requiredSkills = req.body.requiredSkills;
        if (typeof requiredSkills === 'string') {
            requiredSkills = JSON.parse(requiredSkills);
        }

        const ad = new DigitalAd({ 
            ...req.body, 
            images, 
            requiredSkills 
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all digital ads
exports.getAllDigitalAds = async (req, res) => {
    try {
        const ads = await DigitalAd.find().populate('owner', 'fullName');
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single digital ad
exports.getDigitalAdById = async (req, res) => {
    try {
        const ad = await DigitalAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
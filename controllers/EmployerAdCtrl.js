const EmployerAd = require('../models/EmployerAd');

// post employer ad
exports.createEmployerAd = async (req, res) => {
    try {
        // Map images from Multer
        const images = req.files ? req.files.map((file, i) => ({ 
            url: file.path, 
            isMain: i === 0 
        })) : [];
        
        // Securely parse nested jobDetails from form-data string
        let jobDetails = req.body.jobDetails;
        if (typeof jobDetails === 'string') {
            jobDetails = JSON.parse(jobDetails);
        }

        const ad = new EmployerAd({ 
            ...req.body, 
            images, 
            jobDetails 
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all employer ads
exports.getAllEmployerAds = async (req, res) => {
    try {
        const ads = await EmployerAd.find().populate('owner', 'fullName');
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single employer ad
exports.getEmployerAdById = async (req, res) => {
    try {
        const ad = await EmployerAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
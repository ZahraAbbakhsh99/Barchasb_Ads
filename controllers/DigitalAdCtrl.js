const DigitalAd = require('../models/DigitalAd');

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
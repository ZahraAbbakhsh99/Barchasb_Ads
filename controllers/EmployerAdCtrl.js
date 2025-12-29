const EmployerAd = require('../models/EmployerAd');

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
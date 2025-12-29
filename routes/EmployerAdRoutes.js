const router = require('express').Router();
const EmployerAd = require('../models/EmployerAd');
const upload = require('../middleware/upload');

router.post('/', upload.array('images', 9), async (req, res) => {
    try {
        const images = req.files.map((file, i) => ({ url: file.path, isMain: i === 0 }));
        
        // Handling the nested jobDetails if sent as a JSON string from frontend
        const jobDetails = typeof req.body.jobDetails === 'string' 
            ? JSON.parse(req.body.jobDetails) 
            : req.body.jobDetails;

        const ad = new EmployerAd({ ...req.body, images, jobDetails });
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
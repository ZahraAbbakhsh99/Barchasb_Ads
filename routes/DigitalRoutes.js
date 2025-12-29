const router = require('express').Router();
const DigitalAd = require('../models/DigitalAd');
const upload = require('../middleware/upload');

router.post('/', upload.array('images', 9), async (req, res) => {
    try {
        const images = req.files.map((file, i) => ({ url: file.path, isMain: i === 0 }));
        const requiredSkills = typeof req.body.requiredSkills === 'string' 
            ? JSON.parse(req.body.requiredSkills) 
            : req.body.requiredSkills;

        const ad = new DigitalAd({ ...req.body, images, requiredSkills });
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
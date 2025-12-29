const router = require('express').Router();
const JobSeekerAd = require('../models/JobSeekerAd');
const upload = require('../middleware/upload');

const seekerUpload = upload.fields([
    { name: 'images', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 },
    { name: 'workSampleFile', maxCount: 1 }
]);

router.post('/', seekerUpload, async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.files['images']) updateData.images = [{ url: req.files['images'][0].path, isMain: true }];
        if (req.files['resumeFile']) updateData.resumeFile = req.files['resumeFile'][0].path;
        if (req.files['workSampleFile']) updateData.workSampleFile = req.files['workSampleFile'][0].path;

        const ad = new JobSeekerAd(updateData);
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
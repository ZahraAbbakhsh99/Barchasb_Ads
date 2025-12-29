const JobSeekerAd = require('../models/JobSeekerAd');

exports.createJobSeekerAd = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Check and map specific fields from req.files
        if (req.files) {
            if (req.files['images']) {
                updateData.images = [{ 
                    url: req.files['images'][0].path, 
                    isMain: true 
                }];
            }
            
            if (req.files['resumeFile']) {
                updateData.resumeFile = req.files['resumeFile'][0].path;
            }
            
            if (req.files['workSampleFile']) {
                updateData.workSampleFile = req.files['workSampleFile'][0].path;
            }
        }

        const ad = new JobSeekerAd(updateData);
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
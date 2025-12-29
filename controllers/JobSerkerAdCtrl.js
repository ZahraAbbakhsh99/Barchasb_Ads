const JobSeekerAd = require('../models/JobSeekerAd');

// post job seeker ad
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

// Get all job seeker ads
exports.getAllJobSeekerAds = async (req, res) => {
    try {
        const ads = await JobSeekerAd.find().populate('owner', 'fullName');
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single job seeker ad
exports.getJobSeekerAdById = async (req, res) => {
    try {
        const ad = await JobSeekerAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
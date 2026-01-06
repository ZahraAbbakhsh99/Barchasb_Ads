const JobSeekerAd = require('../models/JobSeekerAd');

// Persian Time Ago Helper
const getPersianTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " ماه پیش";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " روز پیش";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " ساعت پیش";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " دقیقه پیش";
    return "لحظاتی پیش";
};

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

        if (typeof updateData.skills === 'string') {
        updateData.skills = JSON.parse(updateData.skills);
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
        // Get page and limit from frontend, set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; // Calculate how many ads to skip


        const { skill, hasWorkSample, city, time } = req.query;
        let queryCondition = { adStatus: 'approved' };

        // Filter by Skill
        if (skill) {
            queryCondition.skills = { $in: [skill] }; 
        }

        // Filter by City
        if (city) queryCondition.city = city;

        // Filter by Work Sample existence
        if (hasWorkSample === 'بله') {
            queryCondition.workSampleFile = { $exists: true, $ne: "" };
        }
        const ads = await JobSeekerAd.find(queryCondition)
            .select('name images city state skills workSampleFile createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)   // Skip previous pages
            .limit(limit) // Only take the next "chunk"
            .lean();

        // Get total count (Frontend needs this to know when to stop scrolling)
        const totalAds = await JobSeekerAd.countDocuments(queryCondition);
        
        const feedAds = ads.map(ad => {
            const mainImg = ad.images.find(img => img.isMain) || ad.images[0];
            return {
                _id: ad._id,
                name: ad.name,
                location: `${ad.state}، ${ad.city}`,
                skills: ad.skills,
                hasSample: !!ad.workSampleFile, // true/false
                imageUrl: mainImg ? mainImg.url : null,
                timeAgo: getPersianTimeAgo(ad.createdAt)
            };
        });
        res.json({
            ads: feedAds,
            currentPage: page,
            totalPages: Math.ceil(totalAds / limit),
            hasMore: skip + ads.length < totalAds // Tell frontend if more data exists
        });
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
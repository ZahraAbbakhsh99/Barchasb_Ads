const EmployerAd = require('../models/EmployerAd');

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

// post employer ad
exports.createEmployerAd = async (req, res) => {
    try {
        // Map images from Multer
        const images = req.files ? req.files.map((file, i) => ({ 
            url: file.path, 
            isMain: i === 0 
        })) : [];
        
        // Securely parse nested jobDetails from form-data string
        let { category, jobDetails } = req.body;
        if (typeof category === 'string') category = JSON.parse(category);
        if (typeof jobDetails === 'string') jobDetails = JSON.parse(jobDetails);

        const ad = new EmployerAd({ 
            ...req.body, 
            category,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { category, cooperationType, time } = req.query;
        let queryCondition = { adStatus: 'approved' };

        // Filter by Category (Handles single string or array)
        if (category) {
            queryCondition.category = { $in: Array.isArray(category) ? category : [category] };
        }

        // Filter by Cooperation Type (Full-time, Remote, etc.)
        if (cooperationType) {
            queryCondition.cooperationType = cooperationType;
        }

        // Filter by Time (Dynamic Date Logic)
        if (time) {
            const now = new Date();
            // Matching Persian strings exactly as they come from the Frontend
            if (time === 'امروز') { 
                queryCondition.createdAt = { $gte: new Date(now.setHours(0,0,0,0)) };
            } else if (time === 'این هفته') {
                const lastWeek = new Date(now.setDate(now.getDate() - 7));
                queryCondition.createdAt = { $gte: lastWeek };
            } else if (time === 'این ماه') {
                const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                queryCondition.createdAt = { $gte: lastMonth };
            }
        }

        const totalAds = await EmployerAd.countDocuments(queryCondition);

        // Execute optimized query
        const ads = await EmployerAd.find(queryCondition)
            .select('name images category state city createdAt cooperationType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const feedAds = ads.map(ad => {
            const mainImg = ad.images.find(img => img.isMain) || ad.images[0];
            return {
                _id: ad._id,
                name: ad.name,
                categories: ad.category,
                location: `${ad.state}، ${ad.city}`,
                cooperationType: ad.cooperationType,
                imageUrl: mainImg ? mainImg.url : null,
                timeAgo: getPersianTimeAgo(ad.createdAt)
            };
        });
        res.json({
            ads: feedAds,
            currentPage: page,
            totalPages: Math.ceil(totalAds / limit),
            hasMore: skip + ads.length < totalAds
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single employer ad
exports.getEmployerAdById = async (req, res) => {
    try {
        const ad = await EmployerAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        
        const result = ad.toObject();
        result.timeAgo = getPersianTimeAgo(ad.createdAt);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
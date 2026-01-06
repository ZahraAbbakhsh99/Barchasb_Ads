const DigitalAd = require('../models/DigitalAd');

// Helper for Persian Time Ago
const getPersianTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 2592000; // Months
    if (interval > 1) return Math.floor(interval) + " ماه پیش";
    
    interval = seconds / 86400; // Days
    if (interval > 1) return Math.floor(interval) + " روز پیش";
    
    interval = seconds / 3600; // Hours
    if (interval > 1) return Math.floor(interval) + " ساعت پیش";
    
    interval = seconds / 60; // Minutes
    if (interval > 1) return Math.floor(interval) + " دقیقه پیش";
    
    return "لحظاتی پیش";
};

// post digital ad
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

        let descriptionItems = req.body.descriptionItems;
        if (typeof descriptionItems === 'string') descriptionItems = JSON.parse(descriptionItems);
        
        const ad = new DigitalAd({ 
            ...req.body, 
            images, 
            requiredSkills,
            descriptionItems
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all digital ads
exports.getAllDigitalAds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { time } = req.query;
        let queryCondition = { adStatus: 'approved' };

        // Time Filter
        if (time) {
            const now = new Date();
            if (time === 'امروز') {
                queryCondition.createdAt = { $gte: new Date(now.setHours(0,0,0,0)) };
            } else if (time === ' این هفته') {
                const lastWeek = new Date(now.setDate(now.getDate() - 7));
                queryCondition.createdAt = { $gte: lastWeek };
            } else if (time === 'این ماه') {
                const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                queryCondition.createdAt = { $gte: lastMonth };
            }
        }
        const ads = await DigitalAd.find({ adStatus: 'approved' })
                    .select('title minBudget maxBudget images descriptionItems createdAt')
                    .sort({ createdAt: -1 }) // Newest first
                    .skip(skip)
                    .limit(limit)
                    .lean();

        const feedAds = ads.map(ad => {
            const mainImg = ad.images.find(img => img.isMain) || ad.images[0];
            return {
                _id: ad._id,
                title: ad.title,
                minBudget: ad.minBudget,
                maxBudget: ad.maxBudget,
                imageUrl: mainImg ? mainImg.url : null,
                itemsCount: ad.descriptionItems?.length || 0,
                // First item's description snippet
                shortDescription: ad.descriptionItems?.[0]?.content || "بدون توضیحات",
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

// Get single digital ad
exports.getDigitalAdById = async (req, res) => {
    try {
        const ad = await DigitalAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        const result = ad.toObject();
        result.timeAgo = getPersianTimeAgo(ad.createdAt);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
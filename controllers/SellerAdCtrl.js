const SellerAd = require('../models/SellerAd');

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

// post seller ad
exports.createSellerAd = async (req, res) => {
    try {
        // Map the uploaded files to the image schema structure
        const images = req.files ? req.files.map((file, index) => ({
            url: file.path,
            isMain: index === 0 // Automatically set the first image as the main one
        })) : [];
        
        // Create the new ad using the request body and the processed images
        const ad = new SellerAd({ 
            ...req.body, 
            images 
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all seller ads
exports.getAllSellerAds = async (req, res) => {
    try {
        // Pagination Parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // 20 ads per "scroll"
        const skip = (page - 1) * limit;

        const { minPrice, maxPrice, category, city, time } = req.query;
        let queryCondition = { adStatus: 'approved' };

        // Price Range Filter
        if (minPrice || maxPrice) {
            queryCondition.priceIRT = {};
            if (minPrice) queryCondition.priceIRT.$gte = Number(minPrice);
            if (maxPrice) queryCondition.priceIRT.$lte = Number(maxPrice);
        }

        // Category and City
        if (category) queryCondition.category = category;
        if (city) queryCondition.city = city;

        // Time Filter
        if (time) {
            const now = new Date();
            if (time === 'امروز') queryCondition.createdAt = { $gte: new Date(now.setHours(0,0,0,0)) };
            else if (time === 'این هفته') queryCondition.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
            else if (time === ' این ماه') queryCondition.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        }

        const totalAds = await SellerAd.countDocuments(queryCondition);

        const ads = await SellerAd.find(queryCondition)
            .select('title images city state priceIRT createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const feedAds = ads.map(ad => {
            const mainImg = ad.images.find(img => img.isMain) || ad.images[0];
            return {
                _id: ad._id,
                title: ad.title,
                price: ad.priceIRT,
                location: `${ad.state}، ${ad.city}`,
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

// Get single seller ad
exports.getSellerAdById = async (req, res) => {
    try {
        const ad = await SellerAd.findById(req.params.id).populate('owner', 'fullName phoneNumber');
        if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
        const result = ad.toObject();
        result.timeAgo = getPersianTimeAgo(ad.createdAt);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
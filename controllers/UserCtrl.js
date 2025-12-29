const User = require('../models/User');

// Logic for registering a new user
exports.registerUser = async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ message: "این کاربر از قبل وجود دارد." });
        }

        user = new User({ fullName, phoneNumber });
        await user.save();
        
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logic for getting a single user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "کاربر یافت نشد." });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
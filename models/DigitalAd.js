const mongoose = require('mongoose');

const digitalAdSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Media
    images: [{
        url: { type: String },
        isMain: { type: Boolean, default: false }
    }],

    // Basic Info
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Budget (Stored as strings as per your preference)
    minBudget: { type: String },
    maxBudget: { type: String },

    // Required Skills (Several Objects)
    requiredSkills: [{
        name: { type: String },
    }],

    // Verification & Communication
    isVerified: { type: Boolean, default: false },
    
    enableChat: { type: Boolean, default: true },
    enablePhone: { type: Boolean, default: true },

    // Ad Management
    paymentMethod: { 
        type: String, 
        enum: ['Subscription', 'Wallet', 'Bank card'], 
        default: 'Bank card' 
    },
    adStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },

    createdAt: { type: Date, default: Date.now }
});

// Standard Image Logic
digitalAdSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const main = this.images.filter(img => img.isMain);
        if (main.length !== 1) {
            this.images.forEach((img, i) => img.isMain = (i === 0));
        }
    }
});

module.exports = mongoose.model('DigitalAd', digitalAdSchema);
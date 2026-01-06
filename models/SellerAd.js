const mongoose = require('mongoose');

const sellerAdSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true}, 
    state: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    application: { type: String },
    status: { type: String },      // General status like "Used", "New"

    images: [{
        url: { type: String },
        isMain: { type: Boolean, default: false }
    }],

    priceIRT: { type: Number, default: 0, index: true },
    isFixedPrice: { type: Boolean, default: false },
    isNegotiable: { type: Boolean, default: false },
    hasWarranty: { type: Boolean, default: false },
    isShippable: { type: Boolean, default: false },

    // extraFeatures is a Map, allowing keys like "Color", "Mileage", etc.
    extraFeatures: { type: Map, of: String },

    isVerified: { type: Boolean, default: false },
    // verificationCode: { type: String },.

    enableChat: { type: Boolean, default: false },
    enablePhone: { type: Boolean, default: false },

    paymentMethod: { 
        type: String, 
        enum: ['Subscription', 'Wallet', 'Bank card'], 
        default: 'Bank card' 
    },
    adStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending',
        index: true 
    },

    createdAt: { type: Date, default: Date.now, index: true},

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'آگهی باید یک مالک داشته باشد.']
    },
});

// Logic: Ensure only one image is Main. If multiple are sent, pick the first one.
sellerAdSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const mainImages = this.images.filter(img => img.isMain);
        if (mainImages.length > 1) {
            this.images.forEach((img, index) => {
                img.isMain = index === 0; // Make only the first one main
            });
        } else if (mainImages.length === 0) {
            this.images[0].isMain = true; // Default first one to main
        }
    }
});

module.exports = mongoose.model('SellerAd', sellerAdSchema);
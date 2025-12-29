const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Media
    images: [{
        url: { type: String },
        isMain: { type: Boolean, default: false }
    }],
    
    // Personal Info
    name: { type: String, required: true },
    age: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    militaryStatus: { type: String },
    phoneNumber: { type: String, required: true },

    // Location & Category
    state: { type: String },
    city: { type: String },
    category: { type: String, required: true },

    // Files (Paths/URLs to the files)
    resumeFile: { type: String }, // Path to PDF
    workSampleFile: { type: String }, // Path to PDF/Zip

    // Professional Details
    education: { type: String },
    skills: { type: String },
    suggestedSalaryIRT: { type: String },
    aboutMe: { type: String },

    // Social & Professional Links
    instagram: { type: String },
    linkedIn: { type: String },
    gitHub: { type: String },

    // Career History (Array of Objects)
    // Structure: [{ title: "Graphic Designer", description: "Worked 2 years at X company" }]
    careerHistory: [{
        title: String,
        description: String
    }],

    // Verification & Settings
    isVerified: { type: Boolean, default: false },
    
    enableChat: { type: Boolean, default: true },
    enablePhone: { type: Boolean, default: false },

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

// Image Logic (Standardized)
jobSeekerSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const main = this.images.filter(img => img.isMain);
        if (main.length !== 1) {
            this.images.forEach((img, i) => img.isMain = (i === 0));
        }
    }
});

module.exports = mongoose.model('JobSeekerAd', jobSeekerSchema);
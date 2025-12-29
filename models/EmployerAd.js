const mongoose = require('mongoose');

const employerAdSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Media
    images: [{
        url: { type: String },
        isMain: { type: Boolean, default: false }
    }],

    // Basic Info
    name: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    
    // Job Details
    cooperationType: { type: String },
    gender: { type: String },
    militaryStatus: { type: String, default: 'None' }, // Default for women
    experience: { type: String },
    paymentMethod: { type: String }, // e.g., Monthly, Project-based
    
    // Work Conditions
    isRemote: { type: Boolean, default: false },
    thursdayUntilNoon: { type: Boolean, default: false },
    startTime: { type: String },
    endTime: { type: String },
    
    // Salary Range
    minSalary: { type: String },
    maxSalary: { type: String },

    // Company Information
    companyName: { type: String },
    companyType: { type: String },
    benefits: { type: String },
    insurance: { type: String },
    education: { type: String },
    companyDescription: { type: String },

    // Detailed Job Description (Array of Objects)
    // Structure: [{ title: "Backend Developer", description: "Node.js expert..." }]
    jobDetails: [{
        title: String,
        description: String
    }],

    isVerified: { type: Boolean, default: false },
    // verificationCode: { type: String },.
    
    // Contact & Ad Settings
    enableChat: { type: Boolean, default: false },
    enablePhone: { type: Boolean, default: false },

    // Enums (Matching your previous standard)
    adPaymentMethod: { 
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

employerAdSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const main = this.images.filter(img => img.isMain);
        if (main.length !== 1) {
            this.images.forEach((img, i) => img.isMain = (i === 0));
        }
    }
});

module.exports = mongoose.model('EmployerAd', employerAdSchema);
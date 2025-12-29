const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import all models
const User = require('../models/User');
const SellerAd = require('../models/SellerAd');
const EmployerAd = require('../models/EmployerAd');
const JobSeekerAd = require('../models/JobSeekerAd');
const DigitalAd = require('../models/DigitalAd');

const runSeed = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await SellerAd.deleteMany();
        await EmployerAd.deleteMany();
        await JobSeekerAd.deleteMany();
        await DigitalAd.deleteMany();

        console.log('Database cleared...');

        // Create a User (The Owner)
        const user = await User.create({
            fullName: "Ali Ahmadi",
            phoneNumber: "09121234567",
            walletBalance: 500000
        });

        const userId = user._id;
        console.log('User created...');

        // Seed Seller Ad (اگهی گذار)
        await SellerAd.create({
            owner: userId,
            title: "iPhone 13 Pro Max",
            category: "Digital",
            state: "Tehran",
            city: "Tehran",
            priceIRT: 55000000,
            images: [{ url: "uploads/iphone.jpg", isMain: true }],
            extraFeatures: { "Battery": "90%", "Color": "Blue" }
        });

        // Seed Employer Ad (اگهی کارفرما)
        await EmployerAd.create({
            owner: userId,
            name: "Mr. Rahimi",
            title: "Senior Node.js Developer",
            category: "IT",
            companyName: "Tech Solutions",
            minSalary: "30,000,000",
            maxSalary: "50,000,000",
            jobDetails: [{ title: "Responsibilities", description: "Design APIs and manage MongoDB" }],
            images: [{ url: "uploads/office.jpg", isMain: true }]
        });

        // 5. Seed Job Seeker Ad (اگهی کارجو)
        await JobSeekerAd.create({
            owner: userId,
            name: "Sara Moradi",
            category: "Graphic Design",
            phoneNumber: "09350001122",
            skills: "Photoshop, Illustrator",
            careerHistory: [{ title: "Designer at Agency X", description: "3 years experience" }],
            resumeFile: "uploads/resume_sara.pdf"
        });

        // Seed Digital Ad (آگهی دیجیتال)
        await DigitalAd.create({
            owner: userId,
            title: "Need a Website for Restaurant",
            minBudget: "5,000,000",
            maxBudget: "15,000,000",
            requiredSkills: [{ name: "WordPress", details: "Elementor expert" }],
            description: "I need a fast website with online ordering."
        });

        console.log('Seed Data Inserted Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

runSeed();
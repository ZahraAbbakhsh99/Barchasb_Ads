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
        console.log("Connected. Generating 320 diverse ads...");
        
        // Clear existing data
        await User.deleteMany();
        await SellerAd.deleteMany();
        await EmployerAd.deleteMany();
        await JobSeekerAd.deleteMany();
        await DigitalAd.deleteMany();

        console.log('Database cleared...');

        // Create a User (The Owner)
        const user = await User.create({
            fullName: "علی احمدی",
            phoneNumber: "09121234567",
            walletBalance: 500000
        });

        const userId = user._id;

        // --- RANDOMIZATION HELPERS ---
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        const getRandomDate = () => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 40));
            return date;
        };

        const locations = [
            { state: "تهران", cities: ["تهران", "شهریار", "اسلامشهر"] },
            { state: "اصفهان", cities: ["اصفهان", "کاشان", "مبارکه", "نجف‌آباد"] },
            { state: "فارس", cities: ["شیراز", "مرودشت", "جهرم"] },
            { state: "خوزستان", cities: ["اهواز", "دزفول", "آبادان"] },
            { state: "خراسان رضوی", cities: ["مشهد", "نیشابور", "سبزوار"] },
            { state: "آذربایجان شرقی", cities: ["تبریز", "مراغه", "مرند"] }
        ];

        const jobCats = ["برنامه‌نویسی", "گرافیک", "بازاریابی", "مدیریت", "حسابداری", "فروش"];
        const sellerCats = ["موبایل", "لپ‌تاپ", "لوازم خانگی", "خودرو", "املاک"];

        // 1. GENERATE 80 SELLER ADS
        const sellerData = Array.from({ length: 80 }).map((_, i) => {
            const loc = pick(locations);
            return {
                owner: userId,
                title: `آگهی فروش ${pick(sellerCats)} مدل ${i + 1}`,
                category: pick(sellerCats),
                state: loc.state,
                city: pick(loc.cities),
                priceIRT: 1000000 + Math.floor(Math.random() * 50000000),
                status: pick(["نو", "در حد نو", "کارکرده"]),
                isFixedPrice: Math.random() > 0.5,
                isNegotiable: Math.random() > 0.5,
                hasWarranty: Math.random() > 0.7,
                extraFeatures: new Map([["رنگ", "نقره‌ای"]]),
                images: [{ url: `https://picsum.photos/seed/s${i}/400/300`, isMain: true }],
                adStatus: "approved", // Matches your Enum
                createdAt: getRandomDate()
            };
        });

        // 2. GENERATE 80 EMPLOYER ADS
        const employerData = Array.from({ length: 80 }).map((_, i) => {
            const loc = pick(locations);
            return {
                owner: userId,
                name: `شرکت ${pick(["فن‌آوران", "دیجی‌سافت", "نوین‌تک"])}`,
                title: `استخدام ${pick(jobCats)}`,
                category: [pick(jobCats)],
                state: loc.state,
                city: pick(loc.cities),
                cooperationType: "تمام وقت",
                gender: "مهم نیست",
                militaryStatus: "پایان خدمت",
                experience: "۳ سال",
                isRemote: Math.random() > 0.8,
                minSalary: "۱۵,۰۰۰,۰۰۰",
                maxSalary: "۳۵,۰۰۰,۰۰۰",
                companyName: `برند ${i}`,
                jobDetails: [{ title: "شرح", description: "توضیحات شغل مورد نظر" }],
                images: [{ url: `https://picsum.photos/seed/e${i}/400/300`, isMain: true }],
                adStatus: "approved", // Matches your Enum
                createdAt: getRandomDate()
            };
        });

        // 3. GENERATE 80 JOB SEEKER ADS
        const seekerData = Array.from({ length: 80 }).map((_, i) => {
            const loc = pick(locations);
            return {
                owner: userId,
                name: `کارجو شماره ${i + 1}`,
                age: "25",
                phoneNumber: "09121234567",
                state: loc.state,
                city: pick(loc.cities),
                category: pick(jobCats),
                education: "کارشناسی",
                skills: ["React", "Node.js"],
                careerHistory: [{ title: "سابقه", description: "سابقه کار مرتبط" }],
                images: [{ url: `https://picsum.photos/seed/p${i}/300/300`, isMain: true }],
                adStatus: "approved", // Matches your Enum
                createdAt: getRandomDate()
            };
        });

        // 4. GENERATE 80 DIGITAL ADS
        const digitalData = Array.from({ length: 80 }).map((_, i) => ({
            owner: userId,
            title: `پروژه دیجیتال شماره ${i + 1}`,
            descriptionItems: [{ title: "هدف", content: "توضیح پروژه" }],
            minBudget: "5000000",
            maxBudget: "15000000",
            requiredSkills: [{ name: "WordPress" }],
            isVerified: true,
            
            // FIXED: Matches your Enum: ['Subscription', 'Wallet', 'Bank card']
            paymentMethod: "Bank card", 
            
            // FIXED: Matches your Enum: ['pending', 'approved', 'rejected']
            adStatus: "approved", 
            
            createdAt: getRandomDate(),
            images: [{ url: `https://picsum.photos/seed/d${i}/400/300`, isMain: true }]
        }));

        await Promise.all([
            DigitalAd.insertMany(digitalData),
            EmployerAd.insertMany(employerData),
            JobSeekerAd.insertMany(seekerData),
            SellerAd.insertMany(sellerData)
        ]);

        console.log("Database Updated with 320 unique Persian ads!");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

runSeed();
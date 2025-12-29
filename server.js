require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const fs = require('fs');
const path = require('path');

const app = express();

// Connect to Database
connectDB();


// Create Uploads Directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Created "uploads" folder');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/ads/seller', require('./routes/SellerAdRoutes'));
app.use('/api/ads/employer', require('./routes/EmployerAdRoutes'));
app.use('/api/ads/jobseeker', require('./routes/JobSeekerAdRoutes'));
app.use('/api/ads/digital', require('./routes/DigitalAdRoutes'));
app.use('/api/users', require('./routes/UserRoutes'));

// Global Error Handler for Multer
app.use((err, req, res, next) => {
    if (err instanceof require('multer').MulterError) {
        return res.status(400).json({ error: `Upload Error: ${err.message}` });
    }
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

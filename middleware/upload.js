const multer = require('multer');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be saved in an 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Create a unique name: timestamp-random-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Security)
const fileFilter = (req, file, cb) => {
    const allowedImages = /jpeg|jpg|png|webp/;
    const allowedDocs = /pdf/;
    
    const extname = allowedImages.test(path.extname(file.originalname).toLowerCase()) || 
                    allowedDocs.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = allowedImages.test(file.mimetype) || allowedDocs.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('ارور: فقط فایل pdf و عکس مورد قبول است.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
    fileFilter: fileFilter
});

module.exports = upload;
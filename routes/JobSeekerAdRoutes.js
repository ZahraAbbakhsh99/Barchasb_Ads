const router = require('express').Router();
const upload = require('../middleware/upload');
const jobSeekerController = require('../controllers/JobSerkerAdCtrl');

const seekerUpload = upload.fields([
    { name: 'images', maxCount: 9 },
    { name: 'resumeFile', maxCount: 1 },
    { name: 'workSampleFile', maxCount: 1 }
]);

router.post('/', seekerUpload, jobSeekerController.createJobSeekerAd);
router.get('/', jobSeekerController.getAllJobSeekerAds); // Get List
router.get('/:id', jobSeekerController.getJobSeekerAdById); // Get Detail

module.exports = router;

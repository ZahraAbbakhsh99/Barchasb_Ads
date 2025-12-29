const router = require('express').Router();
const userController = require('../controllers/UserCtrl');

// POST: Create/Register a new user
router.post('/register', userController.registerUser);

// GET: Get user by ID
router.get('/:id', userController.getUserProfile);

module.exports = router;
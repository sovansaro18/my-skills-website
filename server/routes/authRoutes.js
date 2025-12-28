const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Get current user
router.get('/me', protect, authController.getMe);
// Update profile
router.put('/update-profile', protect, authController.upload.single('avatar'), authController.updateProfile);
// Logout
router.post('/logout', authController.logout);
// Toggle save lesson
router.post('/toggle-save-lesson', protect, authController.toggleSaveLesson);

module.exports = router;

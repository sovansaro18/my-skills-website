const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/me', protect, authController.getMe);

router.put('/update-profile', protect, authController.upload.single('avatar'), authController.updateProfile);

router.post('/logout', authController.logout);

router.post('/toggle-save-lesson', protect, authController.toggleSaveLesson);

module.exports = router;
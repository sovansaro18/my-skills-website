const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markAllAsRead, markAsRead, createNotification } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

router.post('/', protect, createNotification);

module.exports = router;
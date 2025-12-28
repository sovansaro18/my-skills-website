const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
// ហៅ function មកប្រើ
const { getNotifications, markAllAsRead, markAsRead, createNotification } = require('../controllers/notificationController');

// កំណត់ផ្លូវ (Routes)
router.get('/', protect, getNotifications);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

// 👇 បន្ថែមបន្ទាត់នេះ ដើម្បីឱ្យយើងអាចបង្កើត Notification បាន
router.post('/', protect, createNotification);

module.exports = router;
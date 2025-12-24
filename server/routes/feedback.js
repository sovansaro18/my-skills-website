const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const existing = await Feedback.findOne({ user: req.user });
    if (existing) return res.status(400).json({ success: false, message: 'អ្នកបានបញ្ចេញមតិរួចហើយ' });

    const feedback = new Feedback({
      user: req.user,
      rating,
      comment
    });

    await feedback.save();
    
    await feedback.populate('user', 'name avatar');

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
const Notification = require('../models/Notification');
const User = require('../models/User');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); 
    
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error in getNotifications:", error); 
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in markAllAsRead:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in markAsRead:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createNotification = async (req, res) => {
  const { type, title, message } = req.body;

  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
        return res.status(404).json({ message: 'រកមិនឃើញអ្នកប្រើប្រាស់ទេ' });
    }

    const notifications = users.map(user => ({
      user: user._id,
      type,
      title,
      message,
      isRead: false
    }));

    await Notification.insertMany(notifications);

    console.log(`✅ បានផ្ញើ Notification ទៅកាន់អ្នកប្រើប្រាស់ចំនួន ${users.length} នាក់។`);

    res.status(201).json({ 
        success: true, 
        message: `បានផ្ញើជូនដំណឹងទៅកាន់សិស្ស ${users.length} នាក់ជោគជ័យ!` 
    });

  } catch (error) {
    console.error("❌ Error in createNotification:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAllAsRead,
  markAsRead,
  createNotification 
};
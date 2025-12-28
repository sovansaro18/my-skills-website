const Notification = require('../models/Notification');
const User = require('../models/User'); // 👈 សំខាន់៖ ត្រូវហៅ User មកប្រើដើម្បីផ្ញើទៅទាំងអស់គ្នា

// ១. ទាញយក Notification សម្រាប់ User ម្នាក់ៗ
const getNotifications = async (req, res) => {
  try {
    // req.user ត្រូវបានដាក់ដោយ authMiddleware រួចហើយ
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // យកថ្មីបំផុតដាក់លើ
      .limit(20); // យកតែ ២០ ដំណឹងចុងក្រោយ
    
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error in getNotifications:", error); 
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ២. កំណត់ថាបានអានទាំងអស់ (Mark All as Read)
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

// ៣. កំណត់ថាបានអានមួយ (Mark One as Read)
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in markAsRead:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ៤. បង្កើត Notification (ផ្ញើទៅសិស្សទាំងអស់ - Broadcast)
const createNotification = async (req, res) => {
  const { type, title, message } = req.body;

  try {
    // ១. ទាញយក User ទាំងអស់ពី Database
    const users = await User.find({});

    if (!users || users.length === 0) {
        return res.status(404).json({ message: 'រកមិនឃើញអ្នកប្រើប្រាស់ទេ' });
    }

    // ២. បង្កើតបញ្ជី Notification សម្រាប់ User ម្នាក់ៗ
    const notifications = users.map(user => ({
      user: user._id, // ដាក់ ID របស់ User ម្នាក់ៗ
      type,
      title,
      message,
      isRead: false
    }));

    // ៣. បញ្ចូលទាំងអស់ទៅក្នុង Database តែម្ដង (ប្រើ insertMany លឿនជាង create ម្ដងមួយ)
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
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'គ្មាន token ការអនុញ្ញាត' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'រកមិនឃើញអ្នកប្រើប្រាស់' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token មិនត្រឹមត្រូវ' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token បានផុតកំណត់' });
    }
    return res.status(401).json({ success: false, message: 'បរាជ័យក្នុងការផ្ទៀងផ្ទាត់' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false, 
      message: 'មិនអនុញ្ញាត! មុខងារនេះសម្រាប់តែ Admin ប៉ុណ្ណោះ' 
    });
  }
};

module.exports = { protect, admin };
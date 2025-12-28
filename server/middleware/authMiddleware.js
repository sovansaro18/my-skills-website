const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // ១. យក Token ចេញពី "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 🛡️ ២. ការពារកុំឱ្យ Error "jwt malformed" (សំខាន់ណាស់!)
      // ជួនកាល Frontend ផ្ញើមកជាអក្សរ "null" ឬ "undefined"
      if (!token || token === "null" || token === "undefined") {
         return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
      }

      // ៣. ពិនិត្យ Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ៤. រក User ក្នុង Database
      // ⚠️ ខ្ញុំដាក់ទាំងពីរ (id និង userId) ដើម្បីឱ្យប្រាកដថាវារកឃើញ ទោះបងបង្កើត Token របៀបណាក៏ដោយ
      req.user = await User.findById(decoded.id || decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error("Middleware Error:", error.message);
      // ផ្ញើ 401 ទៅវិញ កុំឱ្យ Server គាំង
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
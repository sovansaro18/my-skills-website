const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my-skills-avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
  },
});

const upload = multer({ storage: storage });

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

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
    
    const user = await User.findById(decoded.userId);
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'សូមបំពេញរាល់ព័ត៌មាន' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'អ៊ីមែលនេះបានប្រើរួចហើយ' });
    }

    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password 
    });
    
    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'ចុះឈ្មោះជោគជ័យ!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ success: false, message: 'មានបញ្ហាក្នុងការចុះឈ្មោះ' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'សូមបំពេញអ៊ីមែលនិងពាក្យសម្ងាត់' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'ចូលគណនីជោគជ័យ!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          progress: user.progress,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'មានបញ្ហាក្នុងការចូលគណនី' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

router.put('/update-profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = req.user; 
    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    
    if (password && password.trim() !== '') {
      user.password = password; 
    }

    // 👇 ៤. កែត្រង់នេះ៖ ប្រើ Link ផ្ទាល់ពី Cloudinary
    if (req.file) {
        // Cloudinary ផ្តល់ Link រូបភាពពេញលេញមកឱ្យស្រាប់តាមរយៈ req.file.path
        user.avatar = req.file.path; 
    }

    const updatedUser = await user.save();
    
    const token = generateToken(updatedUser._id);

    res.json({
      success: true,
      message: 'ព័ត៌មានត្រូវបានកែប្រែជោគជ័យ',
      token, 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'អ៊ីមែលនេះត្រូវបានប្រើប្រាស់ដោយគណនីផ្សេងហើយ' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'មានបញ្ហាក្នុងការកែប្រែព័ត៌មាន' 
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ចាកចេញជោគជ័យ' 
  });
});


router.post('/toggle-save-lesson', protect, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId, title } = req.body;
    const user = req.user;

    const existingIndex = user.savedLessons.findIndex(
      item => item.lessonId === lessonId && item.courseId === courseId
    );

    if (existingIndex > -1) {
      user.savedLessons.splice(existingIndex, 1);
    } else {
      user.savedLessons.push({ courseId, moduleId, lessonId, title });
    }

    await user.save();

    res.json({
      success: true,
      savedLessons: user.savedLessons,
      isSaved: existingIndex === -1 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការរក្សាទុក' });
  }
});

module.exports = router;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my-skills-avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage: storage });

const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'សូមបំពេញរាល់ព័ត៌មាន' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'អ៊ីមែលនេះបានប្រើរួចហើយ' });
    }

    let avatarUrl = "";

    if (avatar) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(avatar, {
          folder: 'my-skills-avatars',
          resource_type: 'image'
        });
        avatarUrl = uploadResponse.secure_url; 
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
      }
    }

    const user = new User({ 
        name, 
        email: email.toLowerCase(), 
        password,
        avatar: avatarUrl 
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
};

const login = async (req, res) => {
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
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    
    if (password && password.trim() !== '') {
      user.password = password;
    }

    if (req.file) {
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
      return res.status(400).json({ success: false, message: 'អ៊ីមែលនេះត្រូវបានប្រើប្រាស់ដោយគណនីផ្សេងហើយ' });
    }
    res.status(500).json({ success: false, message: 'មានបញ្ហាក្នុងការកែប្រែព័ត៌មាន' });
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'ចាកចេញជោគជ័យ' });
};

const toggleSaveLesson = async (req, res) => {
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
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  toggleSaveLesson,
  upload
};
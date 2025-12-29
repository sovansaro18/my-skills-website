const express = require('express');
const router = express.Router();
// 👇 Import មុខងារ Update និង Delete មកផង
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my-skills-courses',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage: storage });

// Route សម្រាប់ /api/courses
router.route('/')
  .get(getCourses)
  .post(protect, admin, upload.single('thumbnail'), createCourse);

// 👇 Route ថ្មីសម្រាប់ /api/courses/:id (កែ និង លុប)
router.route('/:id')
  .put(protect, admin, upload.single('thumbnail'), updateCourse) // កែប្រែ
  .delete(protect, admin, deleteCourse); // លុប

module.exports = router;
const express = require('express');
const router = express.Router();
// 👇 Import តែម្តងគត់ (រួមបញ្ចូលមុខងារទាំងអស់)
const { 
  createCourse, 
  getCourses, 
  updateCourse, 
  deleteCourse, 
  addModule, 
  addLesson 
} = require('../controllers/courseController');

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

// Route សម្រាប់ /api/courses/:id (កែ និង លុប)
router.route('/:id')
  .put(protect, admin, upload.single('thumbnail'), updateCourse)
  .delete(protect, admin, deleteCourse);

// Route សម្រាប់បន្ថែម Module
router.route('/:id/modules').post(protect, admin, addModule);

// Route សម្រាប់បន្ថែម Lesson ចូលក្នុង Module
router.route('/:id/modules/:moduleId/lessons').post(protect, admin, addLesson);

module.exports = router;
const express = require('express');
const router = express.Router();
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

const { 
  createCourse, getCourses, updateCourse, deleteCourse, 
  addModule, addLesson
} = require('../controllers/courseController');

const upload = multer({ storage: storage });

router.route('/')
  .get(getCourses)
  .post(protect, admin, upload.single('thumbnail'), createCourse);

router.route('/:id')
  .put(protect, admin, upload.single('thumbnail'), updateCourse) // កែប្រែ
  .delete(protect, admin, deleteCourse); // លុប

  router.route('/:id/modules').post(protect, admin, addModule);
  router.route('/:id/modules/:moduleId/lessons').post(protect, admin, addLesson);

module.exports = router;
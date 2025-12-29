const Course = require('../models/Course');

// @desc    បង្កើតវគ្គសិក្សាថ្មី
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, price, level } = req.body;

    let thumbnail = '';
    if (req.file) {
      thumbnail = req.file.path; 
    } else {
      return res.status(400).json({ success: false, message: 'សូមដាក់រូបភាពតំណាងវគ្គសិក្សា!' });
    }

    const course = await Course.create({
      title,
      description,
      price,
      level,
      thumbnail,
      modules: []
    });

    res.status(201).json({
      success: true,
      message: 'បង្កើតវគ្គសិក្សាជោគជ័យ!',
      data: course
    });

  } catch (error) {
    console.error('❌ Create Course Error:', error);
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការបង្កើតវគ្គសិក្សា' });
  }
};

// @desc    ទាញយកវគ្គសិក្សាទាំងអស់
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); 
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការទាញយកទិន្នន័យ' });
  }
};

// @desc    កែប្រែវគ្គសិក្សា (Update)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'រកមិនឃើញវគ្គសិក្សានេះទេ' });
    }

    const { title, description, price, level } = req.body;

    // Update ទិន្នន័យទូទៅ
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.level = level || course.level;

    // បើមានរូបថ្មី Update រូប, បើអត់ទេទុករូបចាស់
    if (req.file) {
      course.thumbnail = req.file.path;
    }

    const updatedCourse = await course.save();

    res.json({
      success: true,
      message: 'កែប្រែវគ្គសិក្សាជោគជ័យ',
      data: updatedCourse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការកែប្រែ' });
  }
};

// @desc    លុបវគ្គសិក្សា (Delete)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'រកមិនឃើញវគ្គសិក្សានេះទេ' });
    }

    await Course.deleteOne({ _id: req.params.id });

    res.json({ success: true, message: 'លុបវគ្គសិក្សាជោគជ័យ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការលុប' });
  }
};

// @desc    បន្ថែមជំពូកថ្មី (Add Module)
// @route   POST /api/courses/:id/modules
// @access  Private/Admin
const addModule = async (req, res) => {
  try {
    const { title } = req.body; // ទទួលយកចំណងជើងជំពូក
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'រកមិនឃើញវគ្គសិក្សានេះទេ' });
    }

    const newModule = {
      title,
      lessons: [] // ជំពូកថ្មី មិនទាន់មានមេរៀន
    };

    course.modules.push(newModule); // ដាក់ចូលក្នុង Array
    await course.save();

    res.json({ success: true, message: 'បន្ថែមជំពូកជោគជ័យ', data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការបន្ថែមជំពូក' });
  }
};

// @desc    បន្ថែមមេរៀនថ្មី (Add Lesson)
// @route   POST /api/courses/:id/modules/:moduleId/lessons
// @access  Private/Admin
const addLesson = async (req, res) => {
  try {
    const { title, videoUrl, duration, isFree } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'រកមិនឃើញវគ្គសិក្សានេះទេ' });
    }

    // រកមើល Module ដែលត្រូវដាក់មេរៀនចូល
    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'រកមិនឃើញជំពូកនេះទេ' });
    }

    const newLesson = {
      title,
      videoUrl,
      duration, // ឧ. "10:00"
      isFree: isFree === 'true' || isFree === true // កែប្រែ string ទៅ boolean
    };

    module.lessons.push(newLesson);
    await course.save();

    res.json({ success: true, message: 'បន្ថែមមេរៀនជោគជ័យ', data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការបន្ថែមមេរៀន' });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  addModule, // ថែមថ្មី
  addLesson  // ថែមថ្មី
};
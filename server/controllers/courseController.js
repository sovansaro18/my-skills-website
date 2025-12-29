const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, description, price, level } = req.body;

    let thumbnail = '';
    if (req.file) {
      thumbnail = req.file.path; 
    } else {
      return res.status(400).json({ success: false, message: 'សូមដាក់រូបភាពតំណាងវគ្គសិក្សា (Thumbnail)' });
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

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); 
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'បរាជ័យក្នុងការទាញយកទិន្នន័យ' });
  }
};

module.exports = {
  createCourse,
  getCourses
};
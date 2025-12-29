const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String, required: true },
  isFree: { type: Boolean, default: false }, 
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'ចំណងជើងវគ្គសិក្សា'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'ការពិពណ៌នា'] 
  },
  thumbnail: { 
    type: String, 
    required: true,
    default: ''
  },
  price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  modules: [moduleSchema], 
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Course', courseSchema);
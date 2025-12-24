const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'ត្រូវបំពេញឈ្មោះ'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'ត្រូវបំពេញអ៊ីមែល'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'អ៊ីមែលមិនត្រឹមត្រូវ']
  },
  password: {
    type: String,
    required: [true, 'ត្រូវបំពេញពាក្យសម្ងាត់'],
    minlength: [6, 'ពាក្យសម្ងាត់ត្រូវតែយ៉ាងហោច ៦ តួ']
  },
  avatar: {
    type: String,
    default: '/assets/default-avatar.png'
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },

  savedLessons: [{
    courseId: String,
    moduleId: String,
    lessonId: String,
    title: String,
    savedAt: { type: Date, default: Date.now }
  }],

  progress: {
    completedLessons: [{
      lessonId: String,
      completedAt: { type: Date, default: Date.now }
    }],
    quizScores: [{
      quizId: String,
      score: Number,
      total: Number,
      percentage: Number,
      date: { type: Date, default: Date.now }
    }],
    lastViewed: {
      courseId: String,
      moduleId: String,
      lessonId: String,
      timestamp: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    this.updatedAt = Date.now()
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
  this.updatedAt = Date.now()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema)

const mongoose = require('mongoose')
//const { ObjectId } = mongoose.Schema.Types

const guestSchema = new mongoose.Schema({
  label: {
    type: String,
    unique: true,
    required: true,
  },
  active: {
				type: Boolean,
				default: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    unique: true,
  },
})

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  guests: {
				type: [guestSchema],
				default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('User', userSchema)
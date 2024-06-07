const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

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
  ownerId: ObjectId,
  active: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('User', userSchema)
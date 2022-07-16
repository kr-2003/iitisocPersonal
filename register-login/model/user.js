const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
  username: {
    type: String,
  },
  password: {
    type: String,
  }
}, {
  collection: 'users'
})

const model = mongoose.model('UserSchema' , UserSchema)

module.exports = model

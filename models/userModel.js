const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
  },
  username: {
    type: String,
    required: [true, 'Please enter your username'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  passwordConfirm: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

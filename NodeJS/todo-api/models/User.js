// models/User.js
const mongoose = require('mongoose');

// 定義 User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// 建立 User model
const User = mongoose.model('User', userSchema);

module.exports = User;

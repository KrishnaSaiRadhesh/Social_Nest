const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  image: {
    type: String,
    default: '/Profile.png'
  },
  googleImage: {
    type: String // New field for Google profile image
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: []
  },
  savedPosts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
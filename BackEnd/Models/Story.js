const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  media: {
    type: String, // URL or base64 string for image/video
    required: true,
  },
  description: { type: String, maxlength: 200 },
  mediaType: {
    type: String, // 'image' or 'video'
    enum: ['image', 'video'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, // Auto-delete after 24 hours
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('Story', storySchema);
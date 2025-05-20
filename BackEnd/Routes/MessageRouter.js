const express = require('express');
const router = express.Router();
const Message = require('../Models/Message');
const { protectRoute } = require('../Middleware/Protect');
const cloudinary = require('../Config/cloudinary');

// Get messages with a friend
router.get('/:friendId', protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message (text or image)
router.post('/', protectRoute, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    let imageUrl = null;

    // Check if an image was uploaded
    if (req.files && req.files.image) {
      // console.log('File received:', req.files.image); // Debug
      const file = req.files.image;

      // Validate file type
      if (!/jpeg|jpg|png/.test(file.mimetype)) {
        return res.status(400).json({ message: 'Only JPEG, JPG, or PNG images are allowed' });
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size must be less than 5MB' });
      }

      // Convert file to base64 and upload to Cloudinary
      const base64Image = file.data.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64Image}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'chat_images',
      });

      imageUrl = result.secure_url;
    
    }

    // Require either content or image
    if (!content && !imageUrl) {
      return res.status(400).json({ message: 'Message must contain text or an image' });
    }

    const message = new Message({
      senderId: req.user.id,
      receiverId,
      content: content || '',
      image: imageUrl,
    });

    await message.save();
    // console.log('Saved message:', message); // Debug
    res.status(201).json(message);
  } catch (error) {
    console.error('Error:', error.message); // Debug
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
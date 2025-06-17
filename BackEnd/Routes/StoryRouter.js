const express = require('express');
const Story = require('../Models/Story');
const User = require('../Models/Auth');
const { protectRoute } = require('../Middleware/Protect');
const cloudinary = require('../Config/cloudinary');

module.exports = (io) => {
  const router = express.Router();

  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Create a story
  router.post('/create', protectRoute, async (req, res) => {
    try {
      const { media, mediaType, description } = req.body;
      const userId = req.user.id;

      if (!media || !mediaType) {
        return res.status(400).json({ message: 'Please provide media and media type.' });
      }
      if (mediaType !== 'image') {
        return res.status(400).json({ message: 'Only images are supported for stories.' });
      }
      if (media.length > 7 * 1024 * 1024) {
        return res.status(400).json({ message: 'Media file is too large. Maximum size is ~5MB.' });
      }
      if (description && description.length > 200) {
        return res.status(400).json({ message: 'Description must be 200 characters or less.' });
      }

      // console.log('Creating story:', { userId, mediaType, description, media: media.slice(0, 50) + '...' });
      const mediaUpload = await cloudinary.uploader.upload(media, {
        resource_type: 'image',
        timeout: 60000,
      });
      // console.log('Cloudinary response:', {
      //   secure_url: mediaUpload.secure_url,
      //   public_id: mediaUpload.public_id,
      //   resource_type: mediaUpload.resource_type,
      //   format: mediaUpload.format,
      // });

      const story = new Story({
        userId,
        media: mediaUpload.secure_url,
        mediaType,
        mediaPublicId: mediaUpload.public_id,
        description,
      });

      await story.save();
      await User.findByIdAndUpdate(
        userId,
        { $push: { stories: story._id } },
        { new: true }
      );

      const populatedStory = await Story.findById(story._id)
        .populate('userId', 'name image username')
        .populate('viewers', 'username image');

      req.io.emit('newStory', { userId, storyId: story._id });
      res.status(201).json({ message: 'Story created', story: populatedStory });
    } catch (error) {
      console.error('Error creating story:', error.message, error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update a story
  router.put('/:id', protectRoute, async (req, res) => {
    try {
      const { media, mediaType, description } = req.body;
      const { id } = req.params;
      const userId = req.user.id;

      if (!media || !mediaType) {
        return res.status(400).json({ message: 'Please provide media and media type.' });
      }
      if (mediaType !== 'image') {
        return res.status(400).json({ message: 'Only images are supported for stories.' });
      }
      if (media.length > 7 * 1024 * 1024) {
        return res.status(400).json({ message: 'Media file is too large. Maximum size is ~5MB.' });
      }
      if (description && description.length > 200) {
        return res.status(400).json({ message: 'Description must be 200 characters or less.' });
      }

      const story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      if (String(story.userId) !== String(userId)) {
        return res.status(403).json({ message: 'You can only update your own stories' });
      }

      // console.log('Updating story:', { id, userId, mediaType, description, media: media.slice(0, 50) + '...' });
      const mediaUpload = await cloudinary.uploader.upload(media, {
        resource_type: 'image',
        timeout: 60000,
      });
      // console.log('Cloudinary response:', {
      //   secure_url: mediaUpload.secure_url,
      //   public_id: mediaUpload.public_id,
      //   resource_type: mediaUpload.resource_type,
      //   format: mediaUpload.format,
      // });

      if (story.mediaPublicId) {
        await cloudinary.uploader.destroy(story.mediaPublicId, { resource_type: 'image' });
        // console.log('Deleted old media from Cloudinary:', story.mediaPublicId);
      }

      story.media = mediaUpload.secure_url;
      story.mediaType = mediaType;
      story.mediaPublicId = mediaUpload.public_id;
      story.description = description || ''; // Allow clearing description
      await story.save();

      const populatedStory = await Story.findById(id)
        .populate('userId', 'name image username')
        .populate('viewers', 'username image');

      req.io.emit('updateStory', { userId, storyId: id });
      res.status(200).json({ message: 'Story updated', story: populatedStory });
    } catch (error) {
      console.error('Error updating story:', error.message, error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete a story
  router.delete('/:id', protectRoute, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      if (String(story.userId) !== String(userId)) {
        return res.status(403).json({ message: 'You can only delete your own stories' });
      }

      if (story.mediaPublicId) {
        await cloudinary.uploader.destroy(story.mediaPublicId, { resource_type: 'image' });
        // console.log('Deleted media from Cloudinary:', story.mediaPublicId);
      }

      await Story.findByIdAndDelete(id);
      await User.findByIdAndUpdate(
        userId,
        { $pull: { stories: id } },
        { new: true }
      );

      req.io.emit('deleteStory', { userId, storyId: id });
      res.status(200).json({ message: 'Story deleted' });
    } catch (error) {
      console.error('Error deleting story:', error.message, error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Fetch stories from followed users and self
  router.get('/', protectRoute, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('following');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const followingIds = user.following.map(id => id.toString());

      const stories = await Story.find({
        userId: { $in: [...followingIds, userId] },
      })
        .populate('userId', 'name image username')
        .populate('viewers', 'username image')
        .sort({ createdAt: -1 });

      res.status(200).json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error.message, error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Mark story as viewed
  router.post('/:storyId/view', protectRoute, async (req, res) => {
    try {
      const story = await Story.findById(req.params.storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      if (!story.viewers.includes(req.user.id)) {
        story.viewers.push(req.user.id);
        await story.save();
      }

      res.status(200).json({ message: 'Story viewed' });
    } catch (error) {
      console.error('Error viewing story:', error.message, error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
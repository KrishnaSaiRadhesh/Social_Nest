const express = require('express');
const router = express.Router();
const { SIGNUP, LOGIN, LOGOUT, GETALLUSER, USERSTHATFOLLOW, SUGGESTEDUSERS, GETPROFILE } = require('../Controllers/AuthContoller');
const { protectRoute } = require('../Middleware/Protect');
const PostModel = require('../Models/PostModel');
const userModel = require('../Models/Auth');

router.post('/Signup', SIGNUP);
router.post('/login', LOGIN);
router.post('/logout', LOGOUT);
router.get('/allUsers', protectRoute, GETALLUSER);
router.get('/friends', protectRoute, USERSTHATFOLLOW);
router.get('/suggested', protectRoute, SUGGESTEDUSERS);
router.get('/Profile', protectRoute, GETPROFILE);

router.post('/:id/save', protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await userModel.findById(req.user._id);

    // Avoid saving duplicate post IDs
    if (!user.savedPosts.includes(post._id)) {
      user.savedPosts.push(post._id);
      await user.save();
    }

    // Populate saved posts with full data including user and comments' user
    const updatedUser = await userModel
      .findById(req.user._id)
      .populate({
        path: 'savedPosts',
        populate: [
          { path: 'user', select: 'name image' }, // populate post author
          { path: 'comments.user', select: 'name image' } // populate commenters
        ]
      });

    console.log('updatedposts', updatedUser.savedPosts);
    res.status(200).json({ saved: true, savedPosts: updatedUser.savedPosts });
  } catch (err) {
    console.error('Error in /:id/save:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/unsave', protectRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    // Validate postId
    if (!postId || postId === 'undefined') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: 'Post not saved' });
    }

    user.savedPosts.pull(postId);
    await user.save();

    res.status(200).json({ saved: false });
  } catch (err) {
    console.error('Error in /:id/unsave:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/saved-posts', protectRoute, async (req, res) => {
  try {
    // Fetch the user and populate their saved posts
    const user = await userModel
      .findById(req.user._id)
      .populate({
        path: 'savedPosts',
        populate: [
          { path: 'user', select: 'name image' }, // Populate post author
          { path: 'comments.user', select: 'name image' } // Populate commenters
        ],
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ savedPosts: user.savedPosts || [] });
  } catch (err) {
    console.error('Error in /user/saved-posts:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add route to handle Google profile data explicitly
router.get('/google-profile', protectRoute, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    // Return Google profile data if available, otherwise fallback to DB data
    const user = await userModel.findById(req.user._id).select('-password');
    const response = {
      googleId: req.user.googleId || user.googleId,
      name: req.user.displayName || user.name,
      email: req.user.email,
      image: req.user.image || user.image || './Profile.png'
    };

    console.log("pppprrrooro",response)
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching Google profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

module.exports = router;

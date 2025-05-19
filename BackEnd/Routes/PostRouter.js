const express = require("express");
const router = express.Router();

const { CREATEPOST, GETALLPOSTS, commentOnPost, UPDATEPOST, DELETEPOST } = require("../Controllers/PostController");
const { protectRoute } = require("../Middleware/Protect");
const PostModel = require("../Models/PostModel");
const userModel = require("../Models/Auth");

router.post("/CreatePost", protectRoute, CREATEPOST);
router.get("/", protectRoute, GETALLPOSTS);
router.post("/:id/like", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    if (!post.likes) {
      post.likes = [];
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: post.likes.includes(userId) });
  } catch (err) {
    console.error("Error in /:id/like:", err);
    res.status(500).json({ message: err.message });
  }
});
router.post("/:id/comment", protectRoute, commentOnPost);
router.put("/:id", protectRoute, UPDATEPOST);
router.delete("/:id", protectRoute, DELETEPOST);

// New routes for saving and unsaving posts
router.post("/:id/save", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await userModel.findById(req.user._id);
    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    if (user.savedPosts.includes(req.params.id)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    user.savedPosts.push(req.params.id);
    await user.save();

    res.status(200).json({ saved: true, savedPosts: user.savedPosts });
  } catch (err) {
    console.error("Error in /:id/save:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/unsave", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await userModel.findById(req.user._id);
    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    if (!user.savedPosts.includes(req.params.id)) {
      return res.status(400).json({ message: "Post not saved" });
    }

    user.savedPosts = user.savedPosts.filter(
      (postId) => postId.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({ saved: false, savedPosts: user.savedPosts });
  } catch (err) {
    console.error("Error in /:id/unsave:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
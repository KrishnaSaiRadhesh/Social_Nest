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




router.post("/:id/save", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

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
        path: "savedPosts",
        populate: [
          { path: "user", select: "name image" }, // populate post author
          { path: "comments.user", select: "name image" } // populate commenters
        ]
      });

    res.status(200).json({ saved: true, savedPosts: updatedUser.savedPosts });
  } catch (err) {
    console.error("Error in /:id/save:", err);
    res.status(500).json({ message: err.message });
  }
});




router.post("/:id/unsave", protectRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    // Validate postId
    if (!postId || postId === "undefined") {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post not saved" });
    }

    user.savedPosts.pull(postId);
    await user.save();

    res.status(200).json({ saved: false });
  } catch (err) {
    console.error("Error in /:id/unsave:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
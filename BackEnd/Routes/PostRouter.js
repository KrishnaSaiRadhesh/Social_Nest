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
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already liked the post
    const hasLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      // Unlike: Remove user from likes
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like: Add user to likes
      post.likes.push(userId);
    }

    await post.save();

    // Populate user and comments data for response
    const updatedPost = await PostModel.findById(postId)
      .populate("user", "name image")
      .populate({
        path: "comments.user",
        select: "name image",
      });

    res.status(200).json({
      message: hasLiked ? "Post unliked" : "Post liked",
      success: true,
      post: updatedPost,
      liked: !hasLiked,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
});
router.post("/:id/comment", protectRoute, commentOnPost);
router.put("/:id", protectRoute, UPDATEPOST);
router.delete("/:id", protectRoute, DELETEPOST);









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
const cloudinary = require("../Config/cloudinary");
const PostModel = require("../Models/PostModel");
const userModel = require("../Models/Auth");


exports.CREATEPOST = async (req, res) => {
  const { image, description, mediaType } = req.body;
  const user_id = req.user._id;

  try {
    // Validate input
    if (!image || !description || !mediaType) {
      return res.status(400).json({ message: "Please provide media, description, and media type." });
    }
    if (!['image', 'video'].includes(mediaType)) {
      return res.status(400).json({ message: "Invalid media type. Must be 'image' or 'video'." });
    }

    // Validate Data URL size (rough estimate: 6.7MB for ~5MB file)
    if (image.length > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "Media file is too large. Maximum size is ~5MB." });
    }

    // Log payload for debugging
    console.log('Received:', {
      user_id,
      description,
      mediaType,
      image: image.slice(0, 50) + '...',
    });

    // Upload media to Cloudinary
    let mediaUpload;
    try {
      mediaUpload = await cloudinary.uploader.upload(image, {
        resource_type: mediaType === 'video' ? 'video' : 'image',
        timeout: 120000, // 120 seconds for videos
      });
      console.log('Cloudinary response:', {
        secure_url: mediaUpload.secure_url,
        resource_type: mediaUpload.resource_type,
        format: mediaUpload.format,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError.message, uploadError);
      return res.status(500).json({
        message: "Failed to upload media.",
        error: uploadError.message,
      });
    }

    // Create new post
    const newPost = await PostModel.create({
      image: mediaUpload.secure_url,
      mediaType,
      description,
      user: user_id,
    });

    // Update user's posts array
    await userModel.findByIdAndUpdate(
      user_id,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    // Populate the user field for the response
    const populatedPost = await PostModel.findById(newPost._id).populate(
      "user",
      "name image"
    );

    return res.status(200).json({
      message: "Post created successfully",
      newPost: populatedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error.message, error);
    return res.status(500).json({ message: "Error creating post." });
  }
};


exports.GETALLPOSTS = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("user", "name image")
      .populate("comments.user", "name image")
      .sort({ createdAt: -1 });
    const postsWithLiked = posts.map((post) => ({
      ...post._doc,
      likes: post.likes || [],
      liked: post.likes ? post.likes.some((id) => id.equals(req.user._id)) : false,
    }));
    res.status(200).json(postsWithLiked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { commentText } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;

    if (!commentText) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, commentText };
    post.comments.push(comment);
    await post.save();

    const populatedPost = await PostModel.findById(postId)
      .populate("comments.user", "name image")
      .sort({ createdAt: -1 });

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];
    res.status(200).json({
      message: "Commented on a post",
      comment: newComment,
      success: true,
    });
  } catch (error) {
    console.error("Error in commentOnPost controller:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.UPDATEPOST = async (req, res) => {
  const { id: postId } = req.params;
  const { description, image, mediaType } = req.body;
  const userId = req.user._id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    if (!description || !image || !mediaType) {
      return res.status(400).json({ message: "Description, media, and media type are required." });
    }
    if (!['image', 'video'].includes(mediaType)) {
      return res.status(400).json({ message: "Invalid media type. Must be 'image' or 'video'." });
    }

    let imageUrl = post.image;
    if (image !== post.image) {
      try {
        const imageUpload = await cloudinary.uploader.upload(image, {
          resource_type: mediaType === 'video' ? 'video' : 'image',
        });
        imageUrl = imageUpload.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed: ", uploadError);
        return res.status(500).json({ error: "Failed to upload media" });
      }
    }

    post.description = description;
    post.image = imageUrl;
    post.mediaType = mediaType;
    await post.save();

    const populatedPost = await PostModel.findById(postId).populate("user", "name image");

    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost: populatedPost,
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    return res.status(500).json({ message: "Error updating post." });
  }
};

exports.DELETEPOST = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await PostModel.findByIdAndDelete(postId);
    await userModel.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } },
      { new: true }
    );

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Error deleting post." });
  }
};
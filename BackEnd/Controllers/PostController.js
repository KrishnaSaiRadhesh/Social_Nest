const cloudinary = require("../Config/cloudinary");
const PostModel = require("../Models/PostModel");

exports.CREATEPOST = async (req, res) => {
  const { image, description } = req.body;
  const user_id = req.user._id;

  try {
    if (!image || !description) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    let imageUpload;
    try {
      imageUpload = await cloudinary.uploader.upload(image);
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return res.status(500).json({ message: "Failed to upload image." });
    }

    const NewPost = await PostModel.create({
      image: imageUpload.secure_url,
      description,
      user: user_id,
    });

    return res.status(200).json({ message: "Post created successfully", NewPost });
  } catch (error) {
    console.error("Error creating post:", error);
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

    const populatedPost = await PostModel.findById(postId).populate(
      "comments.user",
      "name image"
    ).sort({createdAt:-1})

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
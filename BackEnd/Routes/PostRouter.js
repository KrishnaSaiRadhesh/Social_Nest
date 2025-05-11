const express = require("express")
const router = express.Router()

const {CREATEPOST,GETALLPOSTS, commentOnPost} = require("../Controllers/PostController")
const {protectRoute} = require("../Middleware/Protect")
const PostModel = require("../Models/PostModel")

router.post("/CreatePost", protectRoute, CREATEPOST)
router.get("/", protectRoute, GETALLPOSTS)




// router.post("/:id/like", protectRoute, async (req, res) => {
//   try {
//     const post = await PostModel.findById(req.params.id); // Use req.params.id
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const userId = req.user._id;

//     // Initialize likes array if undefined
//     if (!post.likes) {
//       post.likes = [];`
//     }

//     if (post.likes.includes(userId)) {
//       post.likes.pull(userId); // Unlike
//     } else {
//       post.likes.push(userId); // Like
//     }

//     await post.save();
//     res.status(200).json({ likes: post.likes.length, liked: post.likes.includes(userId) });
//   } catch (err) {
//     console.error("Error in /:id/like:", err);
//     res.status(500).json({ message: err.message });
//   }
// }); 


router.post("/:id/like", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    // Ensure likes is an array
    if (!post.likes) {
      post.likes = [];
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: post.likes.includes(userId) });
  } catch (err) {
    console.error("Error in /:id/like:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/comment", protectRoute, commentOnPost)


  

module.exports = router
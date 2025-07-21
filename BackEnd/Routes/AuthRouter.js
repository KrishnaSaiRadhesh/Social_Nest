const express = require("express");
const router = express.Router();
const { SIGNUP, LOGIN, LOGOUT, GETALLUSER, USERSTHATFOLLOW, SUGGESTEDUSERS, GETPROFILE} = require("../Controllers/AuthContoller");
const { protectRoute } = require("../Middleware/Protect");
const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/Auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");


router.get("/user", protectRoute, GETPROFILE);
router.post("/Signup", SIGNUP);
router.post("/login", LOGIN);
router.post("/logout", LOGOUT);
router.get("/allUsers", protectRoute, GETALLUSER);
router.get("/friends", protectRoute, USERSTHATFOLLOW);
router.get("/suggested", protectRoute, SUGGESTEDUSERS);

router.post("/posts/:id/save", protectRoute, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedPosts.includes(post._id)) {
      user.savedPosts.push(post._id);
      await user.save();
    }

    const updatedUser = await UserModel.findById(req.user._id).populate({
      path: "savedPosts",
      populate: [
        { path: "user", select: "name image" },
        { path: "comments.user", select: "name image" },
      ],
    });

    console.log("updatedposts", updatedUser.savedPosts);
    res.status(200).json({ saved: true, savedPosts: updatedUser.savedPosts });
  } catch (err) {
    console.error("Error in /posts/:id/save:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/posts/:id/unsave", protectRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId || postId === "undefined") {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post not saved" });
    }

    user.savedPosts.pull(postId);
    await user.save();

    res.status(200).json({ saved: false });
  } catch (err) {
    console.error("Error in /posts/:id/unsave:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/saved-posts", protectRoute, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "savedPosts",
      populate: [
        { path: "user", select: "name image" },
        { path: "comments.user", select: "name image" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedPosts: user.savedPosts || [] });
  } catch (err) {
    console.error("Error in /saved-posts:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/google-profile", protectRoute, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    const user = await UserModel.findById(req.user._id).select("-password");
    const response = {
      googleId: req.user.googleId || user.googleId,
      name: req.user.displayName || user.name,
      email: req.user.email,
      image: req.user.image || user.image || "./Profile.png",
    };

    console.log("profile", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching Google profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Add Google Auth Routes under /api/auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user;
      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });
      // Redirect to frontend with token in URL
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? "https://social-nest-ivory.vercel.app/?token=" + token
          : "http://localhost:5173/?token=" + token;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(
        process.env.NODE_ENV === "production"
          ? "https://social-nest-ivory.vercel.app/login"
          : "http://localhost:5173/login"
      );
    }
  }
);

module.exports = router;
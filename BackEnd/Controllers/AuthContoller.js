// const userModel = require("../Models/Auth");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.SIGNUP = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all the fields.", success: false });
//     }

//     const existingEmail = await userModel.findOne({ email });
//     if (existingEmail) {
//       return res
//         .status(400)
//         .json({ message: "User already exists with this email", success: false });
//     }

//     const existingUser = await userModel.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ error: "Username already exists" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ error: "Password must be at least 6 characters long" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await userModel.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     return res.status(201).json({
//       message: "User created successfully",
//       success: true,
//       _id: newUser._id,
//       name: newUser.name,
//       email: newUser.email
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Signup error" });
//   }
// };

// exports.LOGIN = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required", success: false });
//     }

//     // Find user
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password", success: false });
//     }

//     // Check password if not a Google-authenticated user
//     if (user.password) {
//       const isPasswordMatch = await bcrypt.compare(password, user.password);
//       if (!isPasswordMatch) {
//         return res.status(400).json({ message: "Invalid credentials", success: false });
//       }
//     } else {
//       // If user has no password (Google auth), deny traditional login
//       return res.status(400).json({ message: "Please use Google Sign-In for this account", success: false });
//     }

//     // Generate JWT
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "10d"
//     });

//     // Prepare user data
//     const UserData = {
//       _id: user._id,
//       name: user.name,
//       email: user.email
//     };

//     // Set cookie and respond
//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // Secure in production
//         sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust for dev/prod
//         maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
//       })
//       .json({
//         message: `Welcome back ${UserData.name}`,
//         success: true,
//         user: UserData,
//         token
//       });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Login error", success: false });
//   }
// };

// exports.LOGOUT = async (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
//     });

//     res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.set("Pragma", "no-cache");
//     res.set("Expires", "0");

//     return res.status(200).json({ message: "Logged out successfully", success: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Logout error" });
//   }
// };

// exports.GETALLUSER = async (req, res) => {
//   try {
//     const currentUserId = req.user?._id;
//     if (!currentUserId) {
//       return res.status(401).json({ error: "Unauthorized: User not authenticated" });
//     }

//     const allUsers = await userModel
//       .find({ _id: { $ne: currentUserId } }) // Exclude current user
//       .select("-password");
    
//     return res.status(200).json(allUsers);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Fetch error" });
//   }
// };

// exports.USERSTHATFOLLOW = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized: User not authenticated" });
//     }

//     const users = await userModel.find({ followers: userId });
//     return res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ message: "Unable to fetch" });
//   }
// };

// exports.SUGGESTEDUSERS = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized: User not authenticated" });
//     }

//     const users = await userModel.find({ 
//       _id: { $ne: userId }, // Exclude current user
//       followers: { $ne: userId } // Exclude users already followed
//     });
    
//     return res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ message: "Unable to fetch" });
//   }
// };

// exports.GETPROFILE = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized: User not authenticated" });
//     }

//     let user = await userModel
//       .findById(userId)
//       .select("-password")
//       .populate("following", "name image")
//       .populate("followers", "name image")
//       .populate({
//         path: "savedPosts",
//         select: "description image mediaType user createdAt",
//         populate: { path: "user", select: "name image" }
//       });
    
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Filter out invalid savedPosts entries
//     user.savedPosts = user.savedPosts.filter(
//       (post) =>
//         post &&
//         post._id &&
//         post.createdAt &&
//         post.user &&
//         post.user._id &&
//         post.user.name
//     );

//     // Update the user's savedPosts in the database to remove invalid entries
//     user.savedPosts = user.savedPosts.map((post) => post._id);
//     await user.save();

//     // Repopulate savedPosts for the response
//     user = await userModel
//       .findById(userId)
//       .select("-password")
//       .populate("following", "name image")
//       .populate("followers", "name image")
//       .populate({
//         path: "savedPosts",
//         select: "description image mediaType user createdAt",
//         populate: { path: "user", select: "name image" }
//       });
    
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ message: "Error fetching profile." });
//   }
// };


const userModel = require("../Models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.SIGNUP = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields.", success: false });
    }

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User already exists with this email", success: false });
    }

    const existingUser = await userModel.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Signup error" });
  }
};

exports.LOGIN = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password", success: false });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message: "Please use Google Sign-In for this account",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    const UserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.googleId ? user.googleImage : user.image,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${UserData.name}`,
        success: true,
        user: UserData,
        token,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login error", success: false });
  }
};

exports.LOGOUT = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Logout error" });
  }
};

exports.GETALLUSER = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const allUsers = await userModel
      .find({ _id: { $ne: currentUserId } })
      .select("-password");

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Fetch error" });
  }
};

exports.USERSTHATFOLLOW = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const users = await userModel.find({ followers: userId });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Unable to fetch" });
  }
};

exports.SUGGESTEDUSERS = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const users = await userModel.find({
      _id: { $ne: userId },
      followers: { $ne: userId },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Unable to fetch" });
  }
};

exports.GETPROFILE = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    let user = await userModel
      .findById(userId)
      .select("-password")
      .populate("following", "name image")
      .populate("followers", "name image")
      .populate({
        path: "savedPosts",
        select: "description image mediaType user createdAt",
        populate: { path: "user", select: "name image" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter and map savedPosts for the response without saving
    const filteredSavedPosts = user.savedPosts
      .filter(
        (post) =>
          post &&
          post._id &&
          post.createdAt &&
          post.user &&
          post.user._id &&
          post.user.name
      )
      .map((post) => post._id);

    // Create a new object or modify user object for response
    const responseUser = {
      ...user.toObject(),
      savedPosts: filteredSavedPosts, // Use the filtered/mapped IDs
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile." });
  }
};
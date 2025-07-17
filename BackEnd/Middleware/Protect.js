// const userModel = require("../Models/Auth");
// const jwt = require("jsonwebtoken");

// exports.protectRoute = async (req, res, next) => {
//   try {
//     // Check for session-based authentication (e.g., from Google OAuth via Passport)
//     if (req.user) {
//       // User is authenticated via Passport session (Google login)
//       next();
//       return;
//     }

//     // Fallback to JWT-based authentication
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized: No Token Provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(401).json({ error: "Unauthorized: Invalid Token" });
//     }

//     const user = await userModel.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Unauthorized: Invalid Token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Unauthorized: Token Expired" });
//     }
//     next(error); // Pass other errors to Express error handler
//   }
// };

// // Here this middleware is used to check whether the user is available or not...
// // It is used get user id as a middleware
// // It is used to control the current user...



// const userModel = require("../Models/Auth");
// const jwt = require("jsonwebtoken");

// exports.protectRoute = async (req, res, next) => {
//   try {
//     let token;

//     // Check Authorization header (Bearer token)
//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer")) {
//       token = authHeader.split(" ")[1];
//     } else {
//       // Fallback to cookie-based token (if used)
//       token = req.cookies.token;
//     }

//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     // Verify JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded || !decoded.userId) {
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }

//     // Fetch user from database
//     const user = await userModel.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Attach user to request object
//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Unauthorized: Token expired" });
//     }
//     console.error("Authentication error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


// Middleware/Protect.js
const UserModel = require("../Models/Auth");
const jwt = require("jsonwebtoken");

exports.protectRoute = async (req, res, next) => {
  console.log("Middleware triggered for path:", req.path); // New log
  console.log("Request headers:", req.headers); // Your log
  try {
    let token;

    // Prefer Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      console.log("Token from header:", token); // Debug log
    }

    // Fallback to cookie only if header is absent
    if (!token) {
      token = req.cookies.token;
      console.log("Token from cookie (fallback):", token); // Debug log
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch user from database
    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
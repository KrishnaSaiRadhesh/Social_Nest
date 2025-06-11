const userModel = require("../Models/Auth");
const jwt = require("jsonwebtoken");

exports.protectRoute = async (req, res, next) => {
  try {
    // Check for session-based authentication (e.g., from Google OAuth via Passport)
    if (req.user) {
      // User is authenticated via Passport session (Google login)
      next();
      return;
    }

    // Fallback to JWT-based authentication
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token Expired" });
    }
    next(error); // Pass other errors to Express error handler
  }
};

// Here this middleware is used to check whether the user is available or not...
// It is used get user id as a middleware
// It is used to control the current user...
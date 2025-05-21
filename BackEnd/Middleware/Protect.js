const userModel = require("../Models/Auth");
const jwt = require("jsonwebtoken");

exports.protectRoute = async (req, res, next) => {
    try {
        // Get token from various sources
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token && req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        if (!token && req.query.token) {
            token = req.query.token;
        }

        if (!token && req.body.token) {
            token = req.body.token;
        }

        // If still no token, return unauthorized
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Find user by ID from token
        const user = await userModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized: Token verification failed", details: error.message });
    }
};

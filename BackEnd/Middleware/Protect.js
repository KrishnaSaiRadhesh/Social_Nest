const userModel = require("../Models/Auth")
const jwt = require("jsonwebtoken")

exports.protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.token

        if(!token){
            return res.status.json({ error: "Unauthorized: No Token Provied"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECERT)
        if(!decoded){
            return res.status.json({ error: "Unauthorized: Invalid Token"});
        }

        const user = await userModel.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        req.user = user
        next()
    }
    catch(error){
        next(error)
    }
}

// Here this middleware is used to check whether the user is available or not...
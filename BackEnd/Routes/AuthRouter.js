const express = require("express")
const router = express.Router()
const {SIGNUP, LOGIN, LOGOUT, GETALLUSER, USERSTHATFOLLOW, SUGGESTEDUSERS, GETPROFILE} = require("../Controllers/AuthContoller")
const {protectRoute} = require("../Middleware/Protect")


router.post("/Signup", SIGNUP)
router.post("/login", LOGIN)
router.post("/logout", LOGOUT)
router.get("/allUsers",protectRoute, GETALLUSER)
router.get("/friends", protectRoute, USERSTHATFOLLOW)
router.get("/suggested", protectRoute, SUGGESTEDUSERS)
router.get("/profile", protectRoute, GETPROFILE)

module.exports = router
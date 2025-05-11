const express = require("express")
const router = express.Router()
const {UPDATEPROFILE, PROFILE, FOLLOW, UNFOLLOW} = require("../Controllers/UserController")
const {protectRoute} = require("../Middleware/Protect")


router.get("/Profile", protectRoute,PROFILE)
router.put("/UpdateProfile",protectRoute,UPDATEPROFILE)
router.post("/follow/:id",protectRoute, FOLLOW)
router.post("/Unfollow/:id", protectRoute, UNFOLLOW)

module.exports = router;
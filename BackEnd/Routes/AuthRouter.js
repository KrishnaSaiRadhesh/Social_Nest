const express = require("express")
const router = express.Router()
const {SIGNUP, LOGIN, LOGOUT, GETALLUSER} = require("../Controllers/AuthContoller")
const {protectRoute} = require("../Middleware/Protect")


router.post("/Signup", SIGNUP)
router.post("/login", LOGIN)
router.post("/logout", LOGOUT)
router.get("/allUsers",protectRoute, GETALLUSER)


module.exports = router
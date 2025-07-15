// const express = require("express");
// const router = express.Router();
// const { UPDATEPROFILE, PROFILE, FOLLOW, UNFOLLOW, GET_USER_PROFILE} = require("../Controllers/UserController");
// const { protectRoute } = require("../Middleware/Protect");

// router.get("/Profile", protectRoute, PROFILE);
// router.put("/UpdateProfile", protectRoute, UPDATEPROFILE);
// router.post("/follow/:id", protectRoute, FOLLOW);
// router.post("/unfollow/:id", protectRoute, UNFOLLOW);
// router.get("/:id", protectRoute, GET_USER_PROFILE); 


// module.exports = router;

const express = require("express");
const router = express.Router();
const { UPDATEPROFILE, PROFILE, FOLLOW, UNFOLLOW, GET_USER_PROFILE } = require("../Controllers/UserController");
const { protectRoute } = require("../Middleware/Protect");

router.get("/user", protectRoute, PROFILE); // Changed from /Profile to /user
router.put("/UpdateProfile", protectRoute, UPDATEPROFILE);
router.post("/follow/:id", protectRoute, FOLLOW);
router.post("/unfollow/:id", protectRoute, UNFOLLOW);
router.get("/:id", protectRoute, GET_USER_PROFILE); // Ensure this uses req.params.id

module.exports = router;
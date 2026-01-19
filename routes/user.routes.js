const express = require("express");
const { userSignup, userLogin, userProfile } = require("../controllers/user.controller");
const jwtAuthMiddleware = require("../middleware/jwtauth.middleware");
const router = express.Router();

router.post("/signup",userSignup);
router.post("/login",userLogin);
router.get("/profile",jwtAuthMiddleware,userProfile)

module.exports = router;
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadProfilePic");
const { userSignIn, userSignup } = require("../controllers/auth");
const routeConfig = require("./routes.config");

// User Signin
router.post(routeConfig.SIGN_IN, userSignIn);

// User Signup
router.post(routeConfig.SIGN_UP, upload.single("avatar"), userSignup);

module.exports = router;

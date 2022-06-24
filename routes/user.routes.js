const express = require("express");
const router = express.Router();
const { checkIfLoggedIn } = require("../middlewares/auth");
const { checkIfAdminOrowner } = require("../middlewares/checkIfAdminOrOwner");
const { upload } = require("../middlewares/uploadProfilePic");
const {
  getLeavesApplied,
  getApprovedLeaves,
  getLeavesToApprove,
  editProfile,
  deleteProfile,
  getProfileById,
  editProfileProfile,
  getAllUsers,
} = require("../controllers/user");

const routeConfig = require("./routes.config");

router.post(routeConfig.GET_LEAVES, checkIfLoggedIn, getLeavesApplied);

router.post(
  routeConfig.GET_APPROVED_LEAVES,
  checkIfLoggedIn,
  getApprovedLeaves
);

router.post(
  routeConfig.GET_LEAVES_TO_APPROVE,
  checkIfLoggedIn,
  getLeavesToApprove
);

router.post(routeConfig.EDIT_PROFILE, checkIfLoggedIn, editProfile);

router.post(
  routeConfig.EDIT_PROFILE_PICTURE,
  upload.single("avatar"),
  checkIfLoggedIn,
  editProfileProfile 
);

router.post(routeConfig.GET_PROFILE_BY_ID, checkIfLoggedIn, getProfileById);

router.post(
  routeConfig.GET_ALL_USERS,
  checkIfLoggedIn,
  checkIfAdminOrowner,
  getAllUsers
);

router.post(routeConfig.DELETE_PROFILE, checkIfLoggedIn, deleteProfile);

module.exports = router;
const express = require("express");
const router = express.Router();
const { checkIfLoggedIn } = require("../middlewares/auth");
const {
  applyLeaves,
  leaveUpdate,
  leaveCancel,
  leaveApprove,
} = require("../controllers/leaves");
const routeConfig = require("./routes.config");

router.post(routeConfig.APPLY_LEAVE, checkIfLoggedIn, applyLeaves);
router.put(routeConfig.UPDATE_LEAVE, checkIfLoggedIn, leaveUpdate);
router.post(routeConfig.APPROVE_LEAVE, checkIfLoggedIn, leaveApprove);
router.post(routeConfig.CANCEL_LEAVE, checkIfLoggedIn, leaveCancel);

module.exports = router;

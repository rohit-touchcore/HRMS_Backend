const express = require("express");
const router = express.Router();
const { checkIfLoggedIn } = require("../middlewares/auth");
const {
  checkIn,
  checkOut,
  approvePastCheckout,
} = require("../controllers/attendance");
const routeConfig = require("./routes.config");

router.post(routeConfig.CHECKIN, checkIfLoggedIn, checkIn);
router.post(routeConfig.CHECKOUT, checkIfLoggedIn, checkOut);
router.post(routeConfig.APPROVE_CHECKOUT, checkIfLoggedIn, approvePastCheckout);

module.exports = router;

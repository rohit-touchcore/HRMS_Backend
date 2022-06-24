const userSchema = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../uploads/");

exports.checkIfLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let id;
    if (token === null) {
      return res.status(401).json({
        message: "You are not authorized",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({
            message: "You are not authorized",
          });
        } else {
          id = user.id;
        }
      });
      let nextUser = await userSchema.findById(id);
      if (!nextUser) {
        return res
          .status(401)
          .json({ status: "error", error: "User not found" });
      }
      if (req.body.userid == id) {
        req.user = nextUser;
        next();
      } else {
        return res.status(401).json({
          message: "You are not authorized",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

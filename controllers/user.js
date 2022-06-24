const userSchema = require("../models/userSchema");

// Get Leaves To Approve
exports.getLeavesToApprove = async (req, res) => {
  try {
    userSchema
      .findOne({ _id: req.body.userid })
      .select("leaveToApprove")
      .populate({
        path: "leaveToApprove",
        populate: [
          {
            path: "appliedBy",
            model: "User",
            select: "avatar firstname lastname phone email role",
          },
        ],
      })
      .exec(function (err, leaves) {
        if (err) return err;
        // console.log(product);
        res.status(200).json({
          message: "Leaves Fetched",
          data: leaves,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get Approved Leaves (Leaves History)
exports.getApprovedLeaves = async (req, res) => {
  try {
    userSchema
      .findOne({ _id: req.body.userid })
      .select("leaveApproved")
      .populate({
        path: "leaveApproved",
        populate: [
          {
            path: "reviewers",
            model: "User",
            select: "avatar firstname lastname phone email role",
          },
        ],
      })
      .exec(function (err, leaves) {
        if (err) return err;
        // console.log(product);
        res.status(200).json({
          message: "Leaves Fetched",
          data: leaves,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get Leave Applied
exports.getLeavesApplied = async (req, res) => {
  try {
    userSchema
      .findOne({ _id: req.body.userid })
      .select("leaveApplied")
      .populate({
        path: "leaveApplied",
        populate: [
          {
            path: "reviewers",
            model: "User",
            select: "avatar firstname lastname phone email role",
          },
        ],
      })
      .exec(function (err, leaves) {
        if (err) return err;
        // console.log(product);
        res.status(200).json({
          message: "Leaves Fetched",
          data: leaves,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Edit User profile
exports.editProfile = async (req, res) => {
  try {
    let update = await userSchema.findByIdAndUpdate(req.user.id, req.body);
    console.log(update)
    res.status(200).json({
      message: "Profile Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Edit User profile picture
exports.editProfileProfile = async (req, res) => {
  try {
    await userSchema.findByIdAndUpdate(req.user.id, {
      avatar: `/images/${req.file.originalname}`,
    });
    res.status(200).json({
      message: "Profile Picture Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get User profile
exports.getProfileById = async (req, res) => {
  try {
    let user = await userSchema.findById(req.user.id);
    if (user) {
      res.status(200).json({
        status: "ok",
        data: user,
      });
    } else {
      res.status(500).json({
        message: "User does not exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get All profile
exports.getAllUsers = async (req, res) => {
  try {
    let users = await userSchema.find({});
    if (users) {
      res.status(200).json({
        status: "ok",
        data: users,
      });
    } else {
      res.status(500).json({
        message: "User does not exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Delete User profile
exports.deleteProfile = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.user.id);
    res.status(200).json({
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
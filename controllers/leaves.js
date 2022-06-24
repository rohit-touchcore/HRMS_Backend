const leavesSchema = require("../models/leavesSchema");
const userSchema = require("../models/userSchema");
const mongoose = require("mongoose");
const rolesConfig = require("./roles.config");
const moment = require("moment");
exports.applyLeaves = async (req, res) => {
  try {
    let startdate = moment(req.body.startdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let enddate = moment(req.body.enddate, "DD-MM-YYYY").format("YYYY-MM-DD");
    let leave = new leavesSchema({
      appliedBy: req.user.id,
      reviewers: req.body.managerids,
      leaveStart: new Date(startdate),
      leaveEnd: new Date(enddate),
    });

    let finalLeave = await leave.save();
    await userSchema.updateMany(
      { _id: { $in: req.body.managerids } },
      {
        $push: {
          leaveToApprove: finalLeave._id,
        },
      }
    );
    await userSchema.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          leaveApplied: finalLeave._id,
        },
      }
    );
    return res.status(201).json({
      message: "Leave Applied",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Update Leave
exports.leaveUpdate = async (req, res) => {
  try {
    let startdate = moment(req.body.startdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let enddate = moment(req.body.enddate, "DD-MM-YYYY").format("YYYY-MM-DD");
    let updatedManagerIds = req.body.managerids.map((el) =>
      mongoose.Types.ObjectId(el)
    );
    let leave = {
      reviewers: updatedManagerIds,
      leaveStart: new Date(startdate),
      leaveEnd: new Date(enddate),
    };
    let leaveToUpdate = await leavesSchema.findById(req.query.id);
    let manageridsupdate = leaveToUpdate.reviewers.map((el) => el.toString());

    let toBePushed = [];
    let toBePulled = [];
    req.body.managerids.forEach((el) => {
      if (!manageridsupdate.includes(el)) {
        toBePushed.push(el);
      }
    });
    manageridsupdate.forEach((el) => {
      if (!req.body.managerids.includes(el)) {
        toBePulled.push(el);
      }
    });
    if (toBePushed.length) {
      await userSchema.updateMany(
        { _id: { $in: toBePushed } },
        {
          $push: {
            leaveToApprove: req.query.id,
          },
        }
      );
    }
    if (toBePulled.length) {
      await userSchema.updateMany(
        { _id: { $in: toBePulled } },
        {
          $pull: {
            leaveToApprove: req.query.id,
          },
        }
      );
    }
    await leavesSchema.findByIdAndUpdate(req.query.id, leave);
    return res.status(200).json({
      message: "Leave Updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Cancel Leave
exports.leaveCancel = async (req, res) => {
  try {
    let leaveToCacel = await leavesSchema.findById(req.query.leaveid);
    // let startdate = moment(leaveToCacel.leaveStart).format("YYYY-MM-DD");
    // let enddate = moment(leaveToCacel.leaveEnd).format("YYYY-MM-DD");
    console.log(startdate);
    if (leaveToCacel.leaveStatus === 0) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already cancelled",
      });
    }
    if (req.user.id == leaveToCacel.appliedBy.toString()) {
      await leavesSchema.findByIdAndUpdate(req.query.leaveid, {
        leaveStatus: rolesConfig.leaves.CANCELLED,
      });
      return res.status(200).json({
        status: "error",
        message: "Leave Cancelled",
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "You are not authorized for this action",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Approve Leave
exports.leaveApprove = async (req, res) => {
  try {
    let leaveToCacel = await leavesSchema.findById(req.query.leaveid);
    // let startdate = moment(leaveToCacel.leaveStart).format("YYYY-MM-DD");
    // let enddate = moment(leaveToCacel.leaveEnd).format("YYYY-MM-DD");
    // console.log(startdate);
    if (leaveToCacel.leaveStatus === 2) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already approved",
      });
    }
    // console.log();
    if (leaveToCacel.reviewers.includes(req.user.id)) {
      await leavesSchema.findByIdAndUpdate(req.query.leaveid, {
        leaveStatus: rolesConfig.leaves.APPROVED,
      });
      return res.status(200).json({
        status: "error",
        message: "Leave Approved",
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "You are not authorized for this action",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Reject Leave
exports.leaveApprove = async (req, res) => {
  try {
    let leaveToCacel = await leavesSchema.findById(req.query.leaveid);
    // let startdate = moment(leaveToCacel.leaveStart).format("YYYY-MM-DD");
    // let enddate = moment(leaveToCacel.leaveEnd).format("YYYY-MM-DD");
    // console.log(startdate);
    if (leaveToCacel.leaveStatus === 2) {
      return res.status(200).json({
        status: "ok",
        message: "Leave is already approved",
      });
    }
    if (leaveToCacel.reviewers.includes(req.user.id)) {
      await leavesSchema.findByIdAndUpdate(req.query.leaveid, {
        leaveStatus: rolesConfig.leaves.REJECTED,
      });
      return res.status(200).json({
        status: "error",
        message: "Leave Approved",
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "You are not authorized for this action",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

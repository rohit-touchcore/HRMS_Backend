const mongoose = require("mongoose");
const rolesConfig = require("../controllers/roles.config");

const leavesSchema = new mongoose.Schema(
  {
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    leaveStatus: {
      type: Number, // Could be one of these four 0 --> Cancelled by Employee , 1 --> Applied ,2 --> Approved 3 --> Rejected
      required: true,
      default: rolesConfig.leaves.APPLIED,
    },
    leaveStart: {
      type: Date,
      required: true,
    },
    leaveEnd: {
      type: Date,
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Leaves = mongoose.model("Leaves", leavesSchema);

module.exports = Leaves;

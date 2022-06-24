const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "/images/user-avatar.png",
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    designation: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number, // Could be one of these three 1 --> Owner , 2 --> Admin/HR , 3 --> Manager , 4 --> Employee
      required: true,
    },
    leaveApplied: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
    leaveApproved: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
    leaveToApprove: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

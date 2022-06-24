const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  matchingId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isCheckedOut: {
    type: Boolean,
    default: false,
  },
});

const checkOutSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  isLastCheckOut: {
    type: Boolean,
    default: false,
  },
  matchingId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    fullDate: {
      type: String,
      required: true,
    },
    checkIn: {
      type: [checkInSchema],
      required: true,
      default: [],
    },
    checkOut: {
      type: [checkOutSchema],
      required: true,
      default: [],
    },
    totalHoursSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    attendanceStatus: {
      type: Number, // 0 --> Present , 1 --> Absent, 2 --> Half Day
      default: 1,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;

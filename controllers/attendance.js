const attendanceSchema = require("../models/attendanceSchema");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;

exports.checkIn = async (req, res) => {
  try {
    let fullDate = `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }/${new Date().getFullYear()}`;

    let attendanceExists = await attendanceSchema.findOne({
      user: req.user.id,
      fullDate: fullDate,
    });

    if (attendanceExists) {
      attendanceExists.checkIn.forEach((el) => {
        if (!el.isCheckedOut) {
          return res.status(201).json({
            message: "To check in again, You have to check out first.",
          });
        }
      });
      await attendanceSchema.updateOne(
        {
          user: req.user.id,
          fullDate: fullDate,
        },
        {
          $push: {
            checkIn: {
              time: new Date().toLocaleTimeString(),
            },
          },
        }
      );
      await attendanceSchema.updateMany(
        {
          user: req.user.id,
          fullDate: fullDate,
          "checkOut.isLastCheckOut": true,
        },
        {
          $set: {
            "checkOut.$.isLastCheckOut": false,
          },
        },
        { multi: true }
      );
      return res.status(201).json({
        message: "Attendance saved",
      });
    } else {
      const checkIn = new attendanceSchema({
        user: req.user.id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        fullDate: fullDate,
        checkIn: {
          time: new Date().toLocaleTimeString(),
        },
      });
      await checkIn.save();
      return res.status(201).json({
        message: "Attendance saved",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.checkOut = async (
  req,
  res,
  approval = false,
  fullDateForApproval = null,
  checkoutTime = null
) => {
  try {
    let prevAttendance = false;
    let fullDate;
    let prevTime;
    let updatePrev = false;
    let hoursOfCheckin;
    let prevAttendanceExists;
    if (approval !== true) {
      let currentDate = `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`;
      let prevDate = moment().subtract(1, "days").format("DD/M/YYYY");

      prevAttendanceExists = await attendanceSchema.findOne({
        user: req.user.id,
        fullDate: prevDate,
      });

      if (prevAttendanceExists) {
        prevAttendanceExists.checkIn.forEach((ele) => {
          if (!ele.isCheckedOut) {
            prevAttendance = true;
            prevTime = ele.time;
          }
        });
      }

      if (prevAttendance) {
        const yesterday = moment(prevTime, "hh:mm:ss a").subtract(24, "hour");
        const current = moment();
        hoursOfCheckin = moment.duration(current.diff(yesterday)).asHours();
        if (hoursOfCheckin < 24) {
          fullDate = prevDate;
          updatePrev = true;
        } else {
          fullDate = currentDate;
        }
      } else if (!prevAttendance) {
        fullDate = currentDate;
      }
    } else if (approval === true) {
      fullDate = fullDateForApproval;
    }

    let startTime;
    let endTime;

    if (approval == true) {
      endTime = moment(checkoutTime, "hh:mm:ss a");
    } else {
      endTime = new Date().toLocaleTimeString();
    }
    let AttendanceStatus;
    let attendanceExists = await attendanceSchema.findOne({
      user: req.user.id,
      fullDate: fullDate,
    });

    if (attendanceExists) {
      let executable = false;
      attendanceExists.checkIn.forEach((ele) => {
        if (!ele.isCheckedOut) {
          startTime = moment(ele.time, "hh:mm:ss a");
          executable = true;
        }
      });
      if (executable) {
        let totalHours = null;
        if (prevAttendance && approval == false) {
          totalHours = parseInt(hoursOfCheckin);
        } else {
          let tempStartTime = moment(startTime, "h:mm:ss A").format("H:mm:ss");
          let tempEndTime = moment(endTime, "h:mm:ss A").format("H:mm:ss");
          let startHour = moment(tempStartTime, "H:mm:ss").hours();
          let endHour = moment(tempEndTime, "H:mm:ss").hours();
          if (endHour > startHour && endHour < 24) {
            totalHours = moment(tempEndTime, "H:mm:ss").diff(
              moment(tempStartTime, "H:mm:ss"),
              "hours"
            );
          } else {
            let startMinutes = moment(tempStartTime, "H:mm:ss").minutes();
            let endMinutes = moment(tempEndTime, "H:mm:ss").minutes();
            if (endMinutes < startMinutes) {
              totalHours = 24 + endHour - startHour;
            }
            if (endMinutes >= startMinutes) {
              totalHours = 25 + endHour - startHour;
            }
          }
        }
        let finalTotalHours = attendanceExists.totalHoursSpent + totalHours;
        let matchingId = new ObjectID();
        if (finalTotalHours < 4) {
          AttendanceStatus = 1;
        } else if (finalTotalHours > 4 && finalTotalHours < 8) {
          AttendanceStatus = 2;
        } else if (finalTotalHours >= 8) {
          AttendanceStatus = 0;
        } else {
          AttendanceStatus = 1;
        }
        let isFirstCheckout = await attendanceSchema.findOne({
          user: req.user.id,
          fullDate: fullDate,
          "checkOut.isLastCheckOut": true,
        });
        if (isFirstCheckout) {
          await attendanceSchema.findOneAndUpdate(
            {
              user: req.user.id,
              fullDate: fullDate,
              "checkOut.isLastCheckOut": true,
            },
            {
              $set: {
                "checkOut.$.isLastCheckOut": false,
              },
            }
          );
        }
        if (updatePrev) {
          await attendanceSchema.findOneAndUpdate(
            {
              user: req.user.id,
              fullDate: fullDate,
            },
            {
              $set: {
                checkOut: {
                  time: endTime,
                  matchingId: matchingId,
                  isLastCheckOut: true,
                },
                totalHoursSpent: finalTotalHours,
                attendanceStatus: AttendanceStatus,
              },
            }
          );
        } else {
          await attendanceSchema.findOneAndUpdate(
            {
              user: req.user.id,
              fullDate: fullDate,
            },
            {
              $push: {
                checkOut: {
                  time: endTime,
                  matchingId: matchingId,
                  isLastCheckOut: true,
                },
              },
              $set: {
                totalHoursSpent: finalTotalHours,
                attendanceStatus: AttendanceStatus,
              },
            }
          );
        }

        await attendanceSchema.findOneAndUpdate(
          {
            "checkIn.isCheckedOut": false,
          },
          {
            $set: {
              "checkIn.$.isCheckedOut": true,
              "checkIn.$.matchingId": matchingId,
            },
          }
        );
        return res.status(201).json({
          message: "Attendance saved",
        });
      } else {
        if (prevAttendance) {
          return res.status(200).json({
            message:
              "In order to checkout you need to checkin first for today and for yesterday please take approval from manager",
          });
        } else {
          return res.status(200).json({
            message: "In order to checkout you need to checkin first",
          });
        }
      }
    } else {
      if (prevAttendance) {
        return res.status(200).json({
          message:
            "In order to checkout you need to checkin first for today and for yesterday please take approval from manager",
        });
      } else {
        return res.status(200).json({
          message: "In order to checkout you need to checkin first",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.approvePastCheckout = async (req, res) => {
  try {
    let attendanceExists = await attendanceSchema.findOne({
      user: req.user.id,
      fullDate: req.body.fullDate,
    });
    if (attendanceExists) {
      let isLastCheckoutDone = attendanceExists.checkOut.filter(
        (ele) => ele.isLastCheckOut == true
      );
      if (!isLastCheckoutDone.length) {
        this.checkOut(req, res, true, req.body.fullDate, req.body.checkoutTime);
      } else {
        return res.status(200).json({
          message: "Already checkedout for the date" + " " + req.body.fullDate,
        });
      }
    } else {
      return res.status(200).json({
        message: "No record found for the date" + " " + req.body.fullDate,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user sign in
exports.userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ message: "User is not registered" });
    }
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        throw err;
      } else if (!isMatch) {
        return res.status(403).json({
          message: "The password is not correct",
        });
      } else {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET
        );
        const FinalUserData = {
          id: user._id,
          avatar: user.avatar,
          firstname: user.firstname,
          lastname: user.lastname,
          designation: user.designation,
          phone: user.phone,
          email: user.email,
          role: user.role,
          leaveApplied: user.leaveApplied,
          leaveApproved: user.leaveApproved,
          leaveToApprove: user.leaveToApprove,
        };
        return res.status(200).json({
          message: "Logged in!",
          data: FinalUserData,
          token: token,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

// user sign up
exports.userSignup = async (req, res) => {
  try {
    // Phone number and email validation
    // Phone Number Validation
    const { phone, email } = req.body;
    const emailExists = await userSchema.exists({ email: email }).lean();
    const phoneExists = await userSchema.exists({ phone: phone }).lean();
    const phoneNo = /^[6-9]\d{9}$/.test(phone); //Only for indian numbers
    const emailAddr = /^\S+@\S+\.\S+$/.test(email);
    if (emailExists) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with the same email.",
      });
    } else if (phoneExists) {
      res.status(409).json({
        status: "error",
        message: "User already exists with the same phone number.",
      });
    } else if (!phoneNo) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Phone Number",
      });
    }
    // Email validation
    else if (!emailAddr) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Email Address",
      });
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      designation: req.body.designation,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
      role: req.body.role,
    };
    if (req.file) {
      newUser["avatar"] = `/images/${req.file.originalname}`;
    }
    const user = new userSchema(newUser);
    await user.save();
    return res.status(201).json({
      message: "The user successfully registered",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();

app.use(cors())

const connectDB = require("./db/connection");
dotenv.config({ path: "./.env" });
connectDB();
// Express Configurations
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving the static folder for user profile pictures
app.use("/images", express.static("uploads"));

const auth = require("./routes/auth.routes");
const leave = require("./routes/leave.routes");
const user = require("./routes/user.routes");
const attendance = require("./routes/attendance.routes");

// Routes
app.use("/api/auth", auth);
app.use("/api/leave", leave);
app.use("/api/user", user);
app.use("/api/attendance", attendance);

app.listen(port, () => {
  console.log(`Connected on ${port} `);
});

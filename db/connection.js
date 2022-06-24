const mongoose = require("mongoose");

require('dotenv').config();
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected to database: "+connection.connection.host)
    }
    catch(E) {
        console.log(`Can't Connect ${E}`)
    }
};
connectDB()
module.exports = connectDB; 
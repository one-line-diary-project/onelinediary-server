const mongoose = require("mongoose");
const config = require("../config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.database);
    console.log("mongoose connect ! ");
  } catch (err) {
    console.log("mongoose err ! ");
    console.log(err);
  }
};

module.exports = connectDB;

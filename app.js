const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const config = require("./config");
const connectDB = require("./db/database");

const tRoute = require("./routes/route");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트의 도메인으로 변경
    credentials: true,
  })
);

if (config.debug) app.use(morgan("tiny"));

app.use("/", tRoute);

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "오류가 발생했습니다. ";
  res.status(statusCode).json({ error: err.message });
});

app.listen(config.port, () => {
  console.log("connect");
  connectDB();
});

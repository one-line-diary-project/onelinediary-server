const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const connectDB = require("./db/database");
const app = express();

const DiaryModel = require("./seeds/diaryModel");

app.use(
  cors({
    origin: "*", // 이후 수정
    credentials: true,
  })
);
app.use(express.json());

if (config.debug) app.use(morgan("tiny"));

app.get("/test", async (req, res) => {
  const diary = await DiaryModel.find({
    author: "64e3498a7e3ffce4e9a5183f",
  });
  console.log(diary);
  res.status(201).json(diary);
});

app.listen(config.port, () => {
  console.log("connect");
  connectDB();
});

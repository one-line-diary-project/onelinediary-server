const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment");

const config = require("./config");
const connectDB = require("./db/database");
const DiaryModel = require("./models/diaryModel");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*", // 이후 수정
    credentials: true,
  })
);

if (config.debug) app.use(morgan("tiny"));

app.get("/diary", async (req, res) => {
  const { startDate, endDate, currentPage } = req.query;

  const perPage = 4;

  let diary = [];

  console.log(startDate);
  console.log(endDate);

  const toDate = endDate
    ? new Date(endDate)
    : new Date(moment().format("YYYY-MM-DD"));
  toDate.setDate(toDate.getDate() + 1);

  const query = {
    // author: sessionValue,
    createdAt: {
      $gte: moment(startDate).format("YYYY-MM-DD"),
      $lt: moment(toDate).format("YYYY-MM-DD"),
    },
  };

  if (startDate && endDate) {
    diary = await DiaryModel.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: 1 });
  } else {
    diary = await DiaryModel.findOne(query);
  }
  res.status(201).json(diary);
});

app.put("/diary", async (req, res) => {
  const { _id, contents } = req.body;

  let newDiary;

  if (_id === 1) {
    newDiary = new DiaryModel();
    newDiary.author = "38749fufaaTester";
    newDiary.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    newDiary.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    newDiary.contents = contents.map((it) => ({
      content: it.content,
      postTime: it.postTime,
    }));
    await newDiary.save();
  } else {
    newDiary = await DiaryModel.findByIdAndUpdate(
      _id,
      {
        contents: contents.map((it) => ({
          _id: it._id !== 1 ? it._id : new mongoose.Types.ObjectId(),
          content: it.content,
          postTime: it.postTime,
        })),
      },
      { new: true }
    );

    if (newDiary.contents.length === 0) {
      await DiaryModel.findByIdAndDelete(_id);
      newDiary = [];
    }
  }

  res.status(201).json(newDiary);
});

app.listen(config.port, () => {
  console.log("connect");
  connectDB();
});

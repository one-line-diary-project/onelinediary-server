const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

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
  const { startDate, endDate } = req.query;

  let diary = [];

  const fromDate = startDate ? new Date(startDate) : new Date();
  const toDate = endDate ? new Date(endDate) : new Date();
  toDate.setDate(toDate.getDate() + 1);

  const query = {
    // author: sessionValue,
    createdAt: {
      $gte: fromDate.toISOString().slice(0, -1),
      $lt: toDate.toISOString().slice(0, -1),
    },
  };
  if (startDate && endDate) {
    diary = await DiaryModel.find(query).sort({ createdAt: -1 });
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

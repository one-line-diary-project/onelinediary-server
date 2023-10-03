const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const config = require("./config");
const connectDB = require("./db/database");
const DiaryModel = require("./models/diaryModel");
const AppError = require("./utils/appError");
const { getGoogleUserInfo, getGoogleToken } = require("./service/authService");
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

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return next(new AppError("Authorization code not provided!", 401));
  }
  const {
    id_token: idToken,
    access_token: accessToken,
    expires_in: expiresIn,
  } = await getGoogleToken({ code });

  const cookieOption = {
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
  };

  res.cookie("idToken", idToken, cookieOption);
  res.cookie("accessToken", accessToken, cookieOption);
  return res.redirect(config.loginAfterUrl);
});

app.post("/logout", (req, res) => {
  res.clearCookie("idToken");
  res.clearCookie("accessToken");
  res.status(200).json({ result: "success" });
});

app.get("/diary", async (req, res) => {
  const { startDate, endDate, currentPage, perPage } = req.query;
  const { idToken, accessToken } = req.cookies;

  console.log(accessToken);
  // 오류 처리 필요 (로그인 안한 경우..)
  let id;
  try {
    id = await getGoogleUserInfo(idToken, accessToken);
  } catch (error) {
    id = "";
  }
  let diary;

  const toDate = endDate
    ? new Date(endDate)
    : new Date(moment().format("YYYY-MM-DD"));
  toDate.setDate(toDate.getDate() + 1);

  const query = {
    // author: id,
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
    if (diary === null) {
      diary = {};
    }
    diary.loginId = id;
  }

  res.status(201).json(diary);
});

app.put("/diary", async (req, res) => {
  const { _id, contents } = req.body;
  const { idToken, accessToken } = req.cookies;

  // 오류 처리 필요
  // const { id } = await getGoogleUserInfo(idToken, accessToken);

  let newDiary;

  if (_id === 1) {
    newDiary = new DiaryModel();
    newDiary.author = id;
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

  console.log(newDiary);
  res.status(201).json(newDiary);
});

app.listen(config.port, () => {
  console.log("connect");
  connectDB();
});

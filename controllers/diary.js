const mongoose = require("mongoose");
// const moment = require("moment-timezone");
const DiaryModel = require("../models/diaryModel");
const { getGoogleUserInfo } = require("../service/authService");

module.exports.showDiary = async (req, res) => {
  const { startDate, endDate, currentPage, perPage } = req.query;
  const { idToken, accessToken } = req.cookies;
  let id = "";

  try {
    const userInfo = await getGoogleUserInfo(idToken, accessToken);
    id = userInfo.id;
  } catch (err) {
    if (idToken && accessToken) {
      return res.status(err.status).json({ err: err.message });
    }
    return res.status(201).json({});
  }

  let diary;

  const query = {
    author: id,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  };

  diary = await DiaryModel.findOne(query);

  return res.status(201).json(diary);
};

module.exports.showDiaryList = async (req, res) => {
  const { startDate, endDate, currentPage, perPage } = req.query;
  const { idToken, accessToken } = req.cookies;
  let id = "";

  try {
    const userInfo = await getGoogleUserInfo(idToken, accessToken);
    id = userInfo.id;
  } catch (err) {
    if (idToken && accessToken) {
      return res.status(err.status).json({ err: err.message });
    }
    return res.status(201).json({});
  }

  let diary;

  const query = {
    author: id,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  };

  console.log(query);
  diary = await DiaryModel.find(query)
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: 1 });

  return res.status(201).json(diary);
};

module.exports.creatDiary = async (req, res) => {
  const { _id, contents } = req.body;
  const { idToken, accessToken } = req.cookies;

  const { id } = await getGoogleUserInfo(idToken, accessToken);

  let newDiary;

  if (_id === 1) {
    newDiary = new DiaryModel();
    newDiary.author = id;
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
};

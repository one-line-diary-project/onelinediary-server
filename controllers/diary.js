const mongoose = require("mongoose");
const moment = require("moment");
const DiaryModel = require("../models/diaryModel");

const { getGoogleUserInfo } = require("../service/authService");

module.exports.showDiary = async (req, res) => {
  const { startDate, endDate, currentPage, perPage } = req.query;
  const { idToken, accessToken } = req.cookies;

  let id = "";
  if (idToken && accessToken) {
    const userInfo = await getGoogleUserInfo(idToken, accessToken);
    id = userInfo.id;
  }

  if (!id) {
    return res.status(201).json({});
  }

  let diary;

  const toDate = endDate
    ? new Date(endDate)
    : new Date(moment().format("YYYY-MM-DD"));
  toDate.setDate(toDate.getDate() + 1);

  const query = {
    //author: id,
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
};

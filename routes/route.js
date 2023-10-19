const express = require("express");
const router = express.Router();
const user = require("../controllers/users");
const diary = require("../controllers/diary");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn } = require("../service/loginService");

router.get("/auth/google/callback", catchAsync(user.googleLoginCallback));

router.get("/checkLogin", catchAsync(user.checkLogin));

router.post("/logout", user.logout);

router
  .route("/diary")
  .get(catchAsync(diary.showDiary))
  .put(isLoggedIn, catchAsync(diary.creatDiary));

router.route("/diaryList").get(catchAsync(diary.showDiaryList));

module.exports = router;

const config = require("../config");
const { getGoogleToken, getGoogleUserInfo } = require("../service/authService");
const AppError = require("../utils/appError");

module.exports.googleLoginCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return next(new AppError("Authorization code not provided!", 401));
  }
  const {
    id_token: idToken,
    access_token: accessToken,
    expires_in: expiresIn,
  } = await getGoogleToken({ code });

  const cookie = {
    httpOnly: true,
    expires: Date.now() + expiresIn * 1000,
    maxAge: expiresIn * 1000,
  };
  res.cookie("idToken", idToken, cookie); // config.cookie
  res.cookie("accessToken", accessToken, cookie); // config.cookie
  return res.redirect(config.loginAfterUrl);
};

module.exports.logout = (req, res) => {
  res.clearCookie("idToken");
  res.clearCookie("accessToken");
  res.status(200).json({ result: "success" });
};

module.exports.checkLogin = async (req, res) => {
  const { idToken, accessToken } = req.cookies;
  let id = "";

  try {
    const userInfo = await getGoogleUserInfo(idToken, accessToken);
    id = userInfo.id;
  } catch (err) {
    return res.status(200).json({ id: "" });
  }

  return res.status(200).json({ id });
};

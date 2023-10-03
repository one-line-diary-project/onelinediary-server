const { getGoogleUserInfo } = require("./authService");

module.exports.isLoggedIn = async (req, res, next) => {
  const { idToken, accessToken } = req.cookies;
  let id = "";
  let userInfo;
  if (idToken && accessToken) {
    userInfo = await getGoogleUserInfo(idToken, accessToken);
  }
  if (!userInfo) {
    return res.status(401).json({ result: "fail" });
  }
  next();
};

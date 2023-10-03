const axios = require("axios");
const config = require("../config");
const AppError = require("../utils/appError");

module.exports.getGoogleToken = async ({ code }) => {
  const rootURl = "https://oauth2.googleapis.com/token";

  const options = {
    code,
    client_id: config.clientID,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
    withCredentials: true,
  };

  try {
    const { data } = await axios.post(rootURl, options, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error) {
    throw new AppError(error);
  }
};

module.exports.getGoogleUserInfo = async (idToken, accessToken) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    throw new AppError(error, 401);
  }
};

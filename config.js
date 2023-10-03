const dotenv = require("dotenv");

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
}

const config = {
  database: process.env.DATABASE || "",
  port: process.env.PORT,
  debug: process.env.DEBUG,
  session: {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure:true, //https only
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  },
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT,
  loginAfterUrl: process.env.LOGIN_AFTER_URL,
};

module.exports = config;

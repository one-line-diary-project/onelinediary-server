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
};

module.exports = config;

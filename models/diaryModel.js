const mongoose = require("mongoose");
const schema = mongoose.Schema;

const diarySchema = new schema(
  {
    contents: [
      {
        content: String,
        postTime: String,
      },
    ],
    author: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("diarySchema", diarySchema); // 모델 생성 및 export

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
    createdAt: {
      type: String,
      default: Date.now,
    },
    updateAt: {
      type: String,
      default: Date.now,
    },
  }
  //{ timestamps: true }
);

module.exports = mongoose.model("diarySchema", diarySchema); // 모델 생성 및 export

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
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
  }
  //{ timestamps: true }
);

module.exports = mongoose.model("diarySchema", diarySchema);

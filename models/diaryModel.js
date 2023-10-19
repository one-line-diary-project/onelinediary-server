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
    offset: Number,
  },
  { toJSON: { virtuals: true } }
  //{ timestamps: true }
);

diarySchema.virtual("localDate").get(function () {
  return new Date(this.createdAt.getTime() - this.offset * 60000);
});

module.exports = mongoose.model("diarySchema", diarySchema);

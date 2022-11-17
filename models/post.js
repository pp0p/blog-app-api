const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imgCover: {
    type: String,
    default: "",
    // required,
  },
  Comments: {
    type: Array,
  },
});

module.exports = mongoose.model("Posts", postSchema);

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: "",
  },
});
UserSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      fullName: this.fullName,
      email: this.email,
      photo: this.photo,
      _id: this._id,
    },
    process.env.jwtSecret
  );
  return token;
};

module.exports = mongoose.model("Users", UserSchema);

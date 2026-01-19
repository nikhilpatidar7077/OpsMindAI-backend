const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum:['user','admin'],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = model("users", userSchema);

module.exports = userModel;

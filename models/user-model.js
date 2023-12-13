const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    required: true,
    unique: true,
    type: String,
  },
  favorites: Array,
  token: String,
  salt: String,
  hash: String,
});

module.exports = User;

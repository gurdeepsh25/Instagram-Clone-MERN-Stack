const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Instagram", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usersSchema = new mongoose.Schema({
  email: String,
  mobile: String,
  fullName: String,
  username: String,
  hashedPassword: String,
  profileImage: String,
});

const User = mongoose.model("User", usersSchema);

module.exports = { mongoose, User };

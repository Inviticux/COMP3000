//file to define and deal with the users schema on the mongo database
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String,},
  role: { type: String, required: true },
  modules: { type: [String], default: [] },
});

const User = mongoose.model("User", userSchema);
module.exports = User;


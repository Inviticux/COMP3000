//file to define and deal with the users schema on the mongo database
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    isLecturer: Boolean
  });

const User = mongoose.model("User", userSchema);
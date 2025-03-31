//Defining the mongo schema for the modules model
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    teacher: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    weeks: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true, enum: ['red', 'green', 'yellow', 'orange', 'blue', 'purple', 'black'] },
    status: { type: String, default: 'Waiting to Commence', enum: ['Waiting to Commence', 'Ongoing', 'Completed'] }
});

const Module = mongoose.model("Module", moduleSchema);
module.exports = { Module };
//file to deal with the questions schema in mongo
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizID: { type: String, required: true },
    quizTitle: { type: String, required: true },
    quizQuestionIds: { type: [String]},
    modulecode: { type: String, required: true },
    year: { type: String, required: true },
    week: { type: Number, required: true }
});

const Quizzes = mongoose.model("Quizzes", quizSchema);
module.exports = { Quizzes };
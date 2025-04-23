//file to deal with the questions schema in mongo
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionID: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    answers: { type: [String], required: true },
    correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    modulecode: { type: String, required: true },
    year: { type: String, required: true },
    week: { type: Number, required: true }
});

const Question = mongoose.model("Questions", questionSchema);
module.exports = { Question };
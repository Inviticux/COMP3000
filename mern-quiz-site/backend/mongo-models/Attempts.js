//defining the mongo schema for the attempted questions model
const mongoose = require('mongoose');

const attemptedQuestionSchema = new mongoose.Schema({
    questionID: { type: String, required: true },
    email: { type: String, required: true },
    userAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    iscorrect: { type: String, enum: ['Correct', 'Incorrect'], required: true },
});

const AttemptedQuestion = mongoose.model("AttemptedQuestion", attemptedQuestionSchema);
module.exports = { AttemptedQuestion };
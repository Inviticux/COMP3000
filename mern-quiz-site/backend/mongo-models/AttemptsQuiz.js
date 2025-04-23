//defining the mongo schema for the attempted quizzes model
const mongoose = require('mongoose');

const attemptedQuizSchema = new mongoose.Schema({
    quizID: { type: String, required: true },
    email: { type: String, required: true },
    userScore : { type: Number, required: true },
    week: { type: Number, required: true },
    module: { type: String, required: true },
    year: { type: String, required: true },
    feedback : { type: String, default: "feedback not generated" }
});

const AttemptedQuiz = mongoose.model("AttemptedQuiz", attemptedQuizSchema);
module.exports = { AttemptedQuiz };
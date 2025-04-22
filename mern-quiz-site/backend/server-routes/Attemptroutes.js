const express = require('express');
const router = express.Router();
const { AttemptedQuestion } = require('../mongo-models/Attempts');
const { AttemptedQuiz } = require('../mongo-models/AttemptsQuiz');
const { Question } = require('../mongo-models/Questions');

//create a new attempt
router.post('/newattempt', async (req, res) => {
    const { questionID, questionNumber, email, userAnswer, week, module, year } = req.body;

    //validate required fields
    if (!questionID || !questionNumber || !email || !userAnswer || !week || !module || !year) {
        return res.status(406).send('406-not acceptable: missing required fields');
    }

    try {
        //check if an attempt already exists for this question and user
        const existingAttempt = await AttemptedQuestion.findOne({ questionID, email });
        if (existingAttempt) {
            return res.status(409).send('409-conflict: attempt for this question by this user already exists');
        }

        //create a new attempt
        const newAttempt = new AttemptedQuestion({
            questionID,
            questionNumber,
            email,
            userAnswer,
            week,
            module,
            year
        });
        await newAttempt.save();

        res.status(201).send(`201-created: attempt for question "${questionID}" recorded successfully.`);
        console.log(`new attempt recorded for question "${questionID}" by user "${email}".`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//delete an attempt
router.delete('/deleteattempt', async (req, res) => {
    const { questionID, email } = req.body;

    //validate required fields
    if (!questionID || !email) {
        return res.status(406).send('406-not acceptable: missing question id or email');
    }

    try {
        const result = await AttemptedQuestion.deleteOne({ questionID, email });
        if (result.deletedCount === 0) {
            return res.status(404).send('404-not found: attempt does not exist');
        }

        res.status(200).send(`200-ok: attempt for question "${questionID}" by user "${email}" deleted successfully.`);
        console.log(`attempt for question "${questionID}" by user "${email}" deleted successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//check score
router.get('/checkscore', async (req, res) => {
    const { questionID, email } = req.body;

    //validate required fields
    if (!questionID || !email) {
        return res.status(406).send('406-not acceptable: missing question id or email');
    }

    try {
        //find the user's attempt
        const attempt = await AttemptedQuestion.findOne({ questionID, email });
        if (!attempt) {
            return res.status(404).send('404-not found: attempt does not exist');
        }

        //find the correct answer for the question
        const question = await Question.findOne({ questionID });
        if (!question) {
            return res.status(404).send('404-not found: question does not exist');
        }

        //compare the user's answer with the correct answer
        const isCorrect = attempt.userAnswer === question.correctAnswer ? 1 : 0;

        res.status(200).json({ score: isCorrect });
        console.log(`score for question "${questionID}" by user "${email}": ${isCorrect}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//get quiz attempts for a user using email and quizID, return the userScore
router.post('/quizattempts', async (req, res) => {
    const { email, quizID } = req.body;

    //validate required fields
    if (!email || !quizID) {
        return res.status(406).send('406-not acceptable: missing email or quizID');
    }

    try {
        //find the quiz attempt for the user and quiz
        const quizAttempt = await AttemptedQuiz.findOne({ email, quizID });
        if (!quizAttempt) {
            return res.status(200).json({ userScore: "Not Attempted" });
        }

        //return the stored userScore
        res.status(200).json({ userScore: quizAttempt.userScore });
        console.log(`userScore for quiz "${quizID}" by user "${email}": ${quizAttempt.userScore}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

module.exports = router;
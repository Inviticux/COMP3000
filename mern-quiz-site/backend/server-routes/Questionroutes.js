const express = require('express');
const { Question } = require('../mongo-models/Questions.js');
const { Quizzes } = require('../mongo-models/Quizzes.js');
const router = express.Router();

//endpoint to add a new question
router.post('/newquestion', async (req, res) => {
    const { questionID, questionNumber, question, answers, correctAnswer, modulecode, year, week, quizID } = req.body;

    //validate required fields
    if (!questionID || !questionNumber || !question || !answers || !correctAnswer || !modulecode || !year || !week || !quizID) {
        return res.status(406).send('406-not acceptable: missing required fields');
    }

    try {
        //check if the question already exists
        const existingQuestion = await Question.findOne({ questionID });
        if (existingQuestion) {
            return res.status(409).send('409-conflict: question with this id already exists');
        }

        //create a new question
        const newQuestion = new Question({
            questionID,
            questionNumber,
            question,
            answers,
            correctAnswer,
            modulecode,
            year,
            week
        });

        //save the question to the database
        await newQuestion.save();

        //update the quiz to include the new question ID
        const quiz = await Quizzes.findOne({ quizID, modulecode, year, week });
        if (!quiz) {
            return res.status(404).send('404-not found: quiz does not exist');
        }

        //add the question ID to the quiz's question list
        quiz.quizQuestionIds.push(questionID);
        await quiz.save();

        res.status(201).send(`201-created: question "${questionID}" added successfully and quiz "${quizID}" updated`);
        console.log(`question "${questionID}" added successfully and quiz "${quizID}" updated`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to get question details for display
router.get('/getquestion', async (req, res) => {
    const { questionID } = req.query;

    // validate required fields
    if (!questionID) {
        return res.status(406).send('406-not acceptable: missing questionID');
    }

    try {
        //find the question by questionID
        const question = await Question.findOne({ questionID });
        if (!question) {
            return res.status(404).send('404-not found: question does not exist');
        }

        //return the question details excluding the correct answer
        const questionDetails = {
            questionID: question.questionID,
            questionNumber: question.questionNumber,
            question: question.question,
            answers: question.answers,
        };

        res.status(200).json(questionDetails);
        console.log(`returned details for question "${questionID}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

module.exports = router;
const express = require('express');
const { Quizzes } = require('../mongo-models/Quizzes.js');
const router = express.Router();

//endpoint to add a new quiz
router.post('/newquiz', async (req, res) => {
    const { quizID, quizTitle, quizQuestionIds, modulecode, year, week } = req.body;

    //validate required fields
    if (!quizID || !quizTitle || !modulecode || !year || !week) {
        return res.status(406).send('406-not acceptable: missing required fields');
    }

    try {
        //check if the quiz already exists
        const existingQuiz = await Quizzes.findOne({ quizID });
        if (existingQuiz) {
            return res.status(409).send('409-conflict: quiz with this id already exists');
        }

        //create a new quiz
        const newQuiz = new Quizzes({
            quizID,
            quizTitle,
            quizQuestionIds,
            modulecode,
            year,
            week
        });

        //save the quiz to the database
        await newQuiz.save();

        res.status(201).send(`201-created: quiz "${quizID}" added successfully`);
        console.log(`quiz "${quizID}" added successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to get all questionIDs from a quizID
router.get('/getquestions', async (req, res) => {
    const { quizID } = req.query;

    //validate required fields
    if (!quizID) {
        return res.status(406).send('406-not acceptable: missing quizID');
    }

    try {
        //find the quiz by quizID
        const quiz = await Quizzes.findOne({ quizID });
        if (!quiz) {
            return res.status(404).send('404-not found: quiz does not exist');
        }

        //return the question IDs
        res.status(200).json({ questionIDs: quiz.quizQuestionIds });
        console.log(`returned questionIDs for quiz "${quizID}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to remove a question from a quiz
router.delete('/removequestion', async (req, res) => {
    const { quizID, questionID } = req.body;

    //validate required fields
    if (!quizID || !questionID) {
        return res.status(406).send('406-not acceptable: missing quizID or questionID');
    }

    try {
        //find the quiz by quizID
        const quiz = await Quizzes.findOne({ quizID });
        if (!quiz) {
            return res.status(404).send('404-not found: quiz does not exist');
        }

        //check if the questionID exists in the quiz
        const questionIndex = quiz.quizQuestionIds.indexOf(questionID);
        if (questionIndex === -1) {
            return res.status(404).send('404-not found: questionID does not exist in the quiz');
        }

        //remove the questionID from the quizQuestionIds array
        quiz.quizQuestionIds.splice(questionIndex, 1);
        await quiz.save();

        res.status(200).send(`200-ok: question "${questionID}" removed from quiz "${quizID}" successfully`);
        console.log(`question "${questionID}" removed from quiz "${quizID}" successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

module.exports = router;
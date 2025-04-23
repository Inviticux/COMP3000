const express = require('express');
const router = express.Router();
const axios = require('axios');
const { AttemptedQuestion } = require('../mongo-models/Attempts');
const { AttemptedQuiz } = require('../mongo-models/AttemptsQuiz');
const { Question } = require('../mongo-models/Questions');
const { Quizzes } = require('../mongo-models/Quizzes');

//create a new attempt
router.post('/newattempt', async (req, res) => {
    const { questionID, email, userAnswer, isCorrect} = req.body;

    //validate required fields
    if (!questionID || !email || !userAnswer || !isCorrect) {
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
            email,
            userAnswer,
            isCorrect
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

//endpoint to check if a user has attempted a quiz, returns true or false
router.post('/hasattemptedquiz', async (req, res) => {
    const { email, quizID } = req.body;

    //validate required fields
    if (!email || !quizID) {
        return res.status(406).send('406-not acceptable: missing email or quizID');
    }

    try {
        //check if the quiz attempt exists for the user
        const quizAttempt = await AttemptedQuiz.findOne({ email, quizID });
        const hasAttempted = !!quizAttempt;

        res.status(200).json({ hasAttempted });
        console.log(`hasAttempted for quiz "${quizID}" by user "${email}": ${hasAttempted}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to check a users whole quiz and score it
router.post('/logattempts', async (req, res) => {
    const { email, attemptedIDs, userAnswer, quizID } = req.body;

    //validate required fields
    if (!email || !attemptedIDs || !userAnswer || !quizID) {
        return res.status(406).send('406-not acceptable: missing questionIDs or AttemptedIDs');
    }

    let score = 0;
    try {
        incorrectQuestions = [];

        //loop through attemptedIDs and compare answers
        for (let i = 0; i < attemptedIDs.length; i++) {
            const questionID = attemptedIDs[i];
            const userAnswerForQuestion = userAnswer[i];

            //fetch the correct answer for the question
            const question = await Question.findOne({ questionID });
            if (!question) {
                console.log(`Question with ID "${questionID}" not found.`);
                continue; //skip if question does not exist
            }

            //compare users answer with the correct answer
            if (question.correctAnswer === userAnswerForQuestion) {
                score++;
            } else {
                //add question to an array for the LLM to geenerate feedback
                incorrectQuestions.push(question.question);
            }

            //save the attempt
            const newAttempt = new AttemptedQuestion({
                questionID,
                email,
                userAnswer: userAnswerForQuestion,
                iscorrect: question.correctAnswer === userAnswerForQuestion ? 'Correct' : 'Incorrect'
            });
            await newAttempt.save();
        }

        //set the prompt for ollama and the feedback for the save later
        const prompt = "i got these questions wrong: " + incorrectQuestions + ". Can you give me three bullet points maximum on how i can improve? 200 words maximum and in a friendly tone";
        let fullResponse = '';
        //send the prompt to ollama locally and ensure that the response is in full by append the individual parts into one
        try {
            const response = await axios.post('http://ollama:11434/api/generate', {
                model: "llama3.2:1b",  
                prompt: prompt
            }, {
                responseType: 'stream' 
            });
            fullResponse = ''; 
            response.data.on('data', (chunk) => {
                try {
                    const chunkData = JSON.parse(chunk.toString()); 
                    fullResponse += chunkData.response;
                } catch (error) {
                    console.error("[Llama] Error parsing chunk:", error);
                    res.status(500).send('Error processing the response chunk.');
                }
            });

            //wait for the full response
            await new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    console.log("[Llama] Feedback request fulfilled!");
                    resolve();
                });
                response.data.on('error', (error) => {
                    console.error("[Llama] Stream error:", error);
                    reject(error);
                });
            });

        } catch (error) {
            console.error("[Llama] Ollama API error:", error);
            res.status(500).send('500-internal server error');
        }    

        //calculate score as a percentage
        const totalQuestions = attemptedIDs.length;
        const percentageScore = ((score / totalQuestions) * 100).toFixed(2);


        //get other quiz info from the quizID
        const tosavequiz = await Quizzes.findOne({ quizID });

        //save the quiz attempt
        const newQuizAttempt = new AttemptedQuiz({
            email,
            quizID,
            userScore: percentageScore,
            week: tosavequiz.week,
            module: tosavequiz.modulecode,
            year: tosavequiz.year,
            feedback: fullResponse
        });
        await newQuizAttempt.save();

        res.status(200).send(`200-ok: attempt for quiz "${quizID}" by user "${email}" recorded successfully`);
        console.log(`attempt for quiz "${quizID}" by user "${email}" recorded successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint for reviewing a quiz attempt
router.post('/reviewattempt', async (req, res) => {
    const { email, quizID } = req.body;

    //validate required fields
    if (!email || !quizID) {
        return res.status(406).send('406-not acceptable: missing email or quizID');
    }

    try {
        //find the quiz attempt for the user and quiz
        const quizAttempt = await AttemptedQuiz.findOne({ email, quizID });
        if (!quizAttempt) {
            return res.status(404).send('404-not found: quiz attempt does not exist');
        }

        //find the question IDs for the quiz
        const relatedQuiz = await Quizzes.findOne({ quizID });
        if (!relatedQuiz) {
            return res.status(404).send('404-not found: quiz does not exist');
        }
        const questionIDs = relatedQuiz.quizQuestionIds;
        const endTitle = relatedQuiz.quizTitle;
        console.log(endTitle);
        const quizWeek = relatedQuiz.week;

        //get the iscorrect for the question attempts
        let iscorrect = [];
        for (let i = 0; i < questionIDs.length; i++) {
            const assignvalue = await AttemptedQuestion.findOne({ questionID: questionIDs[i], email });
            iscorrect[i] = assignvalue.iscorrect;
        }
        
        //return the retrieved data
        res.status(200).json({ 
            userScore: quizAttempt.userScore,
            feedback: quizAttempt.feedback,
            week: quizWeek,
            title: relatedQuiz.quizTitle,
            questionIDs,
            iscorrect
        });
        console.log(`review attempt for quiz "${quizID}" by user "${email}" retrieved successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to get the specific question attempt
router.post('/reviewquestionattempt', async (req, res) => {
    const { questionID, email } = req.body;

    //validate required fields
    if (!questionID || !email) {
        return res.status(406).send('406-not acceptable: missing questionID or email');
    }

    try {
        //find the users attempt for the question
        const questionAttempt = await AttemptedQuestion.findOne({ questionID, email });
        if (!questionAttempt) {
            return res.status(404).send('404-not found: question attempt does not exist');
        }

        //find the question details
        const questioninfo = await Question.findOne({ questionID });
        if (!questioninfo) {
            return res.status(404).send('404-not found: question does not exist');
        }

        //return the retrieved data
        res.status(200).json({ 
            question: questioninfo.question,
            answers: questioninfo.answers,
            correctAnswer: questioninfo.correctAnswer,
            userAnswer: questionAttempt.userAnswer
        });
        console.log(`review attempt for question "${questionID}" by user "${email}" retrieved successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});

//endpoint to check if a user got a question correct
router.post('/checkquestioncorrect', async (req, res) => {
    const { questionID, email } = req.body;

    //validate required fields
    if (!questionID || !email) {
        return res.status(406).send('406-not acceptable: missing questionID or email');
    }

    try {
        //find the users attempt for the question
        const questionAttempt = await AttemptedQuestion.findOne({ questionID, email });
        if (!questionAttempt) {
            return res.status(404).send('404-not found: question attempt does not exist');
        }

        //return the retrieved data
        res.status(200).json({ 
            iscorrect: questionAttempt.iscorrect
        });
        console.log(`review attempt for question "${questionID}" by user "${email}" retrieved successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-internal server error');
    }
});


module.exports = router;
const mongoose = require('mongoose');
const User = require('./mongo-models/Userlist');
const { Module } = require('./mongo-models/Modules');
const { Quizzes } = require('./mongo-models/Quizzes');
const { AttemptedQuiz } = require('./mongo-models/AttemptsQuiz');
const { Question } = require('./mongo-models/Questions');
const express = require('express');
const router = express.Router();

//might comment this properly later.... 
router.post('/populate', async (req, res) => {
  try {
    await User.deleteMany({});
    await Module.deleteMany({});
    await Quizzes.deleteMany({});
    await AttemptedQuiz.deleteMany({});
    await Question.deleteMany({});

    const user = await User.create({
      email: 'sop@email.com',
      password: 'pass1',
      name: 'Sophie',
      role: 'student',
      modules: ['COMP30042025', 'LAW-01012024', 'PHYS50062025'],
    });

    await Module.create([
      {
        title: 'Advanced Programming',
        teacher: 'Agent Smith',
        code: 'COMP3004',
        weeks: 12,
        year: 2025,
        color: 'blue',
        status: 'Ongoing',
      },
      {
        title: 'Introduction to Law',
        teacher: 'Mr. Harvey Specter',
        code: 'LAW-0101',
        weeks: 12,
        year: 2024,
        color: 'green',
        status: 'Completed',
      },
      {
        title: 'Quantum Physics',
        teacher: 'Dr. Emmett Brown',
        code: 'PHYS5006',
        weeks: 14,
        year: 2025,
        color: 'purple',
        status: 'Ongoing',
      },
      {
        title: 'Marine Ecology',
        teacher: 'Dr. Jane Goodall',
        code: 'MBIO1001',
        weeks: 12,
        year: 2026,
        color: 'red',
        status: 'Waiting to Commence',
      },
    ]);

    await Quizzes.create([
      {
        quizID: 'COMP3004-Q1',
        quizTitle: 'Intro to Advanced Programming',
        quizQuestionIds: ['Q1', 'Q2', 'Q3'],
        modulecode: 'COMP3004',
        year: '2025',
        week: 1,
      },
      {
        quizID: 'COMP3004-Q2',
        quizTitle: 'Programming Quantum Mechanics',
        quizQuestionIds: ['Q4', 'Q5', 'Q6'],
        modulecode: 'COMP3004',
        year: '2025',
        week: 2,
      },
      {
        quizID: 'LAW-0101-Q1',
        quizTitle: 'Introduction to Law',
        quizQuestionIds: ['Q7', 'Q8', 'Q9'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 1,
      },
      {
        quizID: 'LAW-0101-Q2',
        quizTitle: 'Ethical Dilemmas in Law',
        quizQuestionIds: ['Q10', 'Q11', 'Q12'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 2,
      },
      {
        quizID: 'LAW-0101-Q3',
        quizTitle: 'Insider Trading',
        quizQuestionIds: ['Q19', 'Q20', 'Q21'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 3,
      },
      {
        quizID: 'LAW-0101-Q4',
        quizTitle: 'Legal Systems Around the World',
        quizQuestionIds: ['Q22', 'Q23', 'Q24'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 4,
      },
      {
        quizID: 'LAW-0101-Q5',
        quizTitle: 'Corporate Law Basics',
        quizQuestionIds: ['Q25', 'Q26', 'Q27'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 5,
      },
      {
        quizID: 'LAW-0101-Q6',
        quizTitle: 'Criminal Law Fundamentals',
        quizQuestionIds: ['Q28', 'Q29', 'Q30'],
        modulecode: 'LAW-0101',
        year: '2024',
        week: 6,
      },
      {
        quizID: 'PHYS5006-Q1',
        quizTitle: 'Quantum Physics Quiz 1',
        quizQuestionIds: ['Q13', 'Q14', 'Q15'],
        modulecode: 'PHYS5006',
        year: '2025',
        week: 1,
      },
      {
        quizID: 'PHYS5006-Q2',
        quizTitle: 'Quantum Physics Quiz 2',
        quizQuestionIds: ['Q16', 'Q17', 'Q18'],
        modulecode: 'PHYS5006',
        year: '2025',
        week: 2,
      },
    ]);

    await AttemptedQuiz.create([
      {
        quizID: 'LAW-0101-Q1',
        email: user.email,
        userScore: '19.2',
        week: '1',
        module: 'LAW-0101',
        year: '2024',
      },
      {
        quizID: 'LAW-0101-Q2',
        email: user.email,
        userScore: '35.65',
        week: '2',
        module: 'LAW-0101',
        year: '2024',
      },
      {
        quizID: 'LAW-0101-Q3',
        email: user.email,
        userScore: '39.98',
        week: '3',
        module: 'LAW-0101',
        year: '2024',
      },
      {
        quizID: 'LAW-0101-Q4',
        email: user.email,
        userScore: '67',
        week: '4',
        module: 'LAW-0101',
        year: '2024',
      },
      {
        quizID: 'LAW-0101-Q5',
        email: user.email,
        userScore: '87.85',
        week: '5',
        module: 'LAW-0101',
        year: '2024',
      },
      {
        quizID: 'PHYS5006-Q1',
        email: user.email,
        userScore: '39',
        week: '1',
        module: 'PHYS5006',
        year: '2025',
      },
    ]);
    
    await Question.create([
        {
            questionID: 'Q1',
            questionNumber: 1,
            question: 'What is polymorphism in programming?',
            answers: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
            correctAnswer: 'C',
            modulecode: 'COMP3004',
            year: '2025',
            week: 1,
        },
        {
            questionID: 'Q2',
            questionNumber: 2,
            question: 'Which of the following is a valid JavaScript data type?',
            answers: ['String', 'Integer', 'Character', 'Decimal'],
            correctAnswer: 'A',
            modulecode: 'COMP3004',
            year: '2025',
            week: 1,
        },
        {
            questionID: 'Q3',
            questionNumber: 3,
            question: 'What does the "this" keyword refer to in JavaScript?',
            answers: ['Global object', 'Current object', 'Parent object', 'None of the above'],
            correctAnswer: 'B',
            modulecode: 'COMP3004',
            year: '2025',
            week: 1,
        },
        {
            questionID: 'Q4',
            questionNumber: 1,
            question: 'What is a closure in JavaScript?',
            answers: ['A function inside another function', 'A function with access to its outer scope', 'A function that returns another function', 'None of the above'],
            correctAnswer: 'B',
            modulecode: 'COMP3004',
            year: '2025',
            week: 2,
        },
        {
            questionID: 'Q5',
            questionNumber: 2,
            question: 'What is the purpose of the "use strict" directive in JavaScript?',
            answers: ['Enable strict mode', 'Disable strict mode', 'Enable debugging', 'None of the above'],
            correctAnswer: 'A',
            modulecode: 'COMP3004',
            year: '2025',
            week: 2,
        },
        {
            questionID: 'Q6',
            questionNumber: 3,
            question: 'What is the output of "typeof null" in JavaScript?',
            answers: ['null', 'object', 'undefined', 'string'],
            correctAnswer: 'B',
            modulecode: 'COMP3004',
            year: '2025',
            week: 2,
        },
    ]);

    console.log('Database seeded successfully!');
    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (err) {
    console.error('Error seeding database:', err);
    res.status(500).json({ error: 'Error seeding database' });
  }
});

module.exports = router;
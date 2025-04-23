import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/quiz.css';
import logo from '../assets/logo.svg';

const QuizPage = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [isSubmitted, setSubmitState] = useState('');
    const [timer, setTimer] = useState(0);
    const [currentQuizID, setCurrentQuiz] = useState('');
    const [currentQuizTitle, setCurrentQuizTitle] = useState(''); 
    const [quizWeek , setQuizWeek] = useState('');
    const [currentNumQuizQuestions, setCurrentNumQuizQuestions] = useState('');
    const [currentQuestionID, setCurrentQuestionID] = useState('');
    const [currentQuestionNumb, setCurrentQuestionNumb] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswers, setCurrentAnswers] = useState([]);

    //states for key array elements
    const [quizQuestionIDs, setQuizQuestionIDs] = useState([]);
    const [quizQuestionAttempts, setQuizQuestionAttempts] = useState([]);


    //fetch quiz data on page load
    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        setCurrentQuiz(localStorage.getItem('selectedQuizID'));
        
        //get quiz data from api
        const fetchQuizData = async () => {
            try {
                const response = await fetch("http://localhost:82/api/quiz/getquizdetails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ quizID: localStorage.getItem('selectedQuizID') }),
                });
                const data = await response.json();
                
                setCurrentQuizTitle(data.title);
                setQuizWeek((data.week).toString());
                setQuizQuestionIDs(data.questionIDs);
                setCurrentNumQuizQuestions(data.questionIDs.length);

                //set the first question as the current question
                if (data.questionIDs.length > 0) {
                    setCurrentQuestionID(data.questionIDs[0]);
                    setCurrentQuestionNumb(1);
                    fetchQuestionData(data.questionIDs[0]);
                }

            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        fetchQuizData();
    }, []);

    const fetchQuestionData = async (questionID) => {
        try {
            const response = await fetch("http://localhost:82/api/question/getquestion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ questionID }),
            });
            const data = await response.json();

            //update state with the fetched question data
            setCurrentQuestion(data.question);
            setCurrentAnswers(data.answers || []);
        } catch (error) {
            console.error("Error fetching question data:", error);
        }
    };

    const handleQuestionClick = async (questionID) => {
        //save the current selection to quizQuestionAttempts
        const currentIndex = quizQuestionIDs.indexOf(currentQuestionID);
        if (currentIndex !== -1) {
            const selectedOption = document.querySelector('input[name="answer"]:checked')?.value || '';
            const updatedAttempts = [...quizQuestionAttempts];
            updatedAttempts[currentIndex] = selectedOption;
            setQuizQuestionAttempts(updatedAttempts);
        }

        //load the new question and its saved selection
        setCurrentQuestionID(questionID);
        const questionIndex = quizQuestionIDs.indexOf(questionID);
        setCurrentQuestionNumb(questionIndex + 1);

        const savedAnswer = quizQuestionAttempts[questionIndex] || '';
        document.querySelectorAll('input[name="answer"]').forEach((input) => {
            input.checked = input.value === savedAnswer;
        });

        //fetch and update question data
        await fetchQuestionData(questionID);
    };

    const handleSubmit = () => {
        //save the current selection to quizQuestionAttempts
        const currentIndex = quizQuestionIDs.indexOf(currentQuestionID);
        if (currentIndex !== -1) {
            const selectedOption = document.querySelector('input[name="answer"]:checked')?.value || '';
            const updatedAttempts = [...quizQuestionAttempts];
            updatedAttempts[currentIndex] = selectedOption;
            setQuizQuestionAttempts(updatedAttempts);
        }

        //move to the next question
        if (currentIndex + 1 < quizQuestionIDs.length) {
            const nextQuestionID = quizQuestionIDs[currentIndex + 1];
            handleQuestionClick(nextQuestionID);
        }
    };

    const handleFinalizeQuiz = async () => {
        if (quizQuestionAttempts.length !== quizQuestionIDs.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        setSubmitState('Marking');
        try {
            const response = await fetch("http://localhost:82/api/attempt/logattempts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                    attemptedIDs: quizQuestionIDs,
                    userAnswer: quizQuestionAttempts,
                    quizID: currentQuizID,
                }),
            });

            if (response.status === 200) {
                console.log("Attempts logged successfully");
                localStorage.setItem('selectedQuizID', currentQuizID);
                navigate('/review');
            } else {
                throw new Error("Failed to log attempts");
            }
        } catch (error) {
            console.error("Error logging attempts:", error);
        }
    };

    //colors for the questions, normal grey for not attempted, green for attempted, orange for currently selected
    const colorMap = {
        red: '#F9B9B9',
        orange: '#FBD2B1',
        yellow: '#F4ECC9',
        green: '#CBE9A7',
        blue: '#91DDD4',
    };

    const getButtonColor = (index) => {
        if (index === quizQuestionIDs.indexOf(currentQuestionID)) {
            return colorMap.orange;
        } else if (quizQuestionAttempts[index]) {
            return colorMap.green;
        } else {
        }
    };

    return (
        <div>
            <header className="header">
                <div className="header-logo-container" onClick={() => navigate('/dashboard')}>
                    <img src={logo} alt="Logo" className="logo" />
                    <h4 className="logo-text">Llamalyze</h4>
                </div>
                <div className="header-buttons">
                    {userRole === 'lecturer' && (
                        <button onClick={() => navigate('/editor')}>Editor</button>
                    )}
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button onClick={() => navigate('/profile')}>Profile</button>
                </div>
            </header>

            <div className="quiz-main">
                {isSubmitted === 'Marking' ? (
                    <section className="quiz-marking">
                        <h6>Finalizing Your Quiz...</h6>
                        <h7>Please wait while we process your answers and get you some feedback!</h7>
                        <div className='timing-container'>
                            <div className='timing-item'>
                                <h3>Estimated Wait time</h3>
                                <p2 className='time-item'>35</p2>
                                <p className='sub-time'>Seconds</p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="quiz-sidebar">
                            <div className='sidebar-header'>
                                <h1>Week {quizWeek} - {currentQuizTitle}</h1>
                                <h2>{quizQuestionAttempts.length} / {currentNumQuizQuestions}</h2>
                            </div>
                            <div className='sidebar-divider'></div>
                            <div className='sidebar-content'>
                                {quizQuestionIDs.map((id, index) => (
                                    <button 
                                        key={id} 
                                        className='sidebar-item' 
                                        onClick={() => handleQuestionClick(id)}
                                        style={{ backgroundColor: getButtonColor(index) }}
                                    >
                                        Question {index + 1}
                                    </button>
                                ))}
                            </div>
                            <button className='quiz-finalsubmit' onClick={handleFinalizeQuiz}>Finalize Quiz</button>
                        </section>

                        <section className="quiz-container">
                            <h3>Question {currentQuestionNumb}</h3>
                            <div className="quiz-content">
                                <p1 className="question-title">{currentQuestion}</p1>
                                <div className='question-options'>
                                    <p2 className="question-option-1">A. {currentAnswers[0]}</p2>
                                    <p2 className="question-option-2">B. {currentAnswers[1]}</p2>
                                    <p2 className="question-option-3">C. {currentAnswers[2]}</p2>
                                    <p2 className="question-option-4">D. {currentAnswers[3]}</p2>
                                </div>
                                <div className='options-select'>
                                    <label>
                                        <input type="radio" name="answer" value="A" /> A
                                    </label>
                                    <label>
                                        <input type="radio" name="answer" value="B" /> B
                                    </label>
                                    <label>
                                        <input type="radio" name="answer" value="C" /> C
                                    </label>
                                    <label>
                                        <input type="radio" name="answer" value="D" /> D
                                    </label>
                                </div>
                                <button className='submit-button' onClick={handleSubmit}>Submit</button>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizPage;
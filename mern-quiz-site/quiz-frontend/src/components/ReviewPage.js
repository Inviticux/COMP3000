import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/review.css';
import logo from '../assets/logo.svg';

const ReviewPage = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [currentQuizID, setCurrentQuiz] = useState('');
    const [currentQuizTitle, setCurrentQuizTitle] = useState(''); 
    const [quizWeek , setQuizWeek] = useState('');
    const [quizScore, setQuizScore] = useState('86');
    const [feedback, setFeedback] = useState('');
    const [currentQuestionID, setCurrentQuestionID] = useState('');
    const [currentQuestionNumb, setCurrentQuestionNumb] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswers, setCurrentAnswers] = useState([]);

    //states for key array elements
    const [quizQuestionIDs, setQuizQuestionIDs] = useState([]);
    const [quizQuestionAttempts, setQuizQuestionAttempts] = useState([]);
    const [quizQuestionIsCorrect, setQuizQuestionIsCorrect] = useState([]);


    //fetch quiz data on page load
    useEffect(() => {
        setCurrentQuiz(localStorage.getItem('selectedQuizID'));
        
        //get quiz data from api
        const fetchAttemptData = async () => {
            try {
                const response = await fetch("http://localhost:82/api/attempt/reviewattempt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: localStorage.getItem('userEmail'), quizID: localStorage.getItem('selectedQuizID') }),
                });
                const data = await response.json();
                
                setCurrentQuizTitle(data.title);
                setQuizWeek((data.week).toString());
                setQuizScore(data.userScore);
                setQuizQuestionIDs(data.questionIDs);
                setFeedback(data.feedback);
                setQuizQuestionIsCorrect(data.questionIsCorrect);


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

        fetchAttemptData();
    }, []);

    const fetchQuestionData = async (questionID) => {
        try {
            const response = await fetch("http://localhost:82/api/attempt/reviewquestionattempt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ questionID, email: localStorage.getItem('userEmail') }),
            });
            const data = await response.json();

            //update state with the fetched question data
            setCurrentQuestion(data.question);
            setCurrentAnswers(data.answers || []);

            //logic to set the colours of the items, corrent answer and users answer



        } catch (error) {
            console.error("Error fetching question data:", error);
        }
    };

    const handleQuestionClick = async (questionID, index) => {
        setCurrentQuestionNumb(index);
        await fetchQuestionData(questionID);
    };

    //colour map for the questions, green for 
    const colorMap = {
        red: '#F9B9B9',
        orange: '#FBD2B1',
        yellow: '#F4ECC9',
        green: '#CBE9A7',
        blue: '#91DDD4',
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
                <section className="quiz-sidebar">
                    <div className='sidebar-header'>
                        <h1>Week {quizWeek} - {currentQuizTitle}</h1>
                        <h2>{quizScore}%</h2>
                    </div>
                    <div className='sidebar-divider'></div>
                    <div className='sidebar-content'>
                        {quizQuestionIDs.map((id, index) => (
                            <button 
                                key={id} 
                                className='sidebar-item' 
                                onClick={() => handleQuestionClick(id, index + 1)}
                            >
                                Question {index + 1}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="quiz-container">
                    <h3>Question {currentQuestionNumb}</h3>
                    <div className="quiz-content">
                        <p1 className="question-title">{currentQuestion}</p1>
                        <div className='question-options'>
                            <p2 className="question-option-a">A. {currentAnswers[0]}</p2>
                            <p2 className="question-option-b">B. {currentAnswers[1]}</p2>
                            <p2 className="question-option-c">C. {currentAnswers[2]}</p2>
                            <p2 className="question-option-d">D. {currentAnswers[3]}</p2>
                        </div>
                        <div className='quiz-feedback'>
                            <h8>AI Feedback</h8>
                            <p3>{feedback}</p3>
                        </div>
                        
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReviewPage;
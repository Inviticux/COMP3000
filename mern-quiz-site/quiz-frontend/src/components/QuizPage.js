import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/quiz.css';
import logo from '../assets/logo.svg';

const QuizPage = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [currentQuizID, setCurrentQuiz] = useState('');
    const [currentQuestionID, setCurrentQuestionID] = useState('');
    const [currentQuestionNumb, setCurrentQuestionNumb] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswers, setCurrentAnswers] = useState([]);

    //fetch quiz data on page load
    useEffect(() => {
        //logic to fetch quiz question ids from api, then store the ids in an array. 
    }, []);

    const handleQuestionClick = (questionID) => {
        setCurrentQuestionID(questionID);
        //logic to fetch quiz question from api, then set the question information in state
    }

    //colors for the questions, grey for not attempted, green for attempted, orange for currently selected
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
                    
                </section>

                <section className="quiz-container">
                    <h3>{currentQuestionNumb}</h3>
                    <div className="quiz-content"></div>
                </section>
            </div>
        </div>
    );
};

export default QuizPage;
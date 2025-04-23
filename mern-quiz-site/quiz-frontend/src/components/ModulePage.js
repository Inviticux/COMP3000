import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/module.css';
import logo from '../assets/logo.svg';

const ModulePage = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('User');
    const [moduleCode, setModuleCode] = useState('modulecode');
    const [moduleTitle, setModuleTitle] = useState('Module Title');
    const [moduleTeacher, setModuleTeacher] = useState('Module Teacher');
    const [moduleYear, setModuleYear] = useState('');
    const [currentQuizzes, setCurrentQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);

    const colorMap = {
        red: '#F9B9B9',
        orange: '#FBD2B1',
        green: '#CBE9A7',
    };

    //get the users score for a quiz
    const fetchUserScore = async (quizID) => {
        try {
            const response = await fetch('http://localhost:82/api/attempt/quizattempts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                    quizID,
                }),
            });

            if (response.ok) {
                const { userScore } = await response.json();

                let scoreColor;
                if (userScore === 'Not Attempted') {
                    scoreColor = colorMap.orange;
                } else if (userScore >= 40) {
                    scoreColor = colorMap.green;
                } else {
                    scoreColor = colorMap.red;
                }

                return { userScore: userScore === 'Not Attempted' ? 'Not Attempted' : `${userScore.toFixed(2)}%`, scoreColor };
            } else {
                console.error('Failed to fetch user score:', response.statusText);
                return { userScore: 'Not Attempted', scoreColor: colorMap.orange };
            }
        } catch (error) {
            console.error('Error fetching user score:', error);
            return { userScore: 'Not Attempted', scoreColor: colorMap.orange };
        }
    };

    //fetch user data on page load
    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        setModuleCode(localStorage.getItem('selectedModuleCode'));
        setModuleTitle(localStorage.getItem('selectedModuleTitle'));
        setModuleTeacher(localStorage.getItem('selectedModuleTeacher'));
        setModuleYear(localStorage.getItem('selectedModuleYear'));

        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:82/api/quiz/getmodulequizzes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        modulecode: localStorage.getItem('selectedModuleCode'),
                        year: localStorage.getItem('selectedModuleYear'),
                    }),
                });
                if (response.ok) {
                    const quizzes = await response.json();

                    const current = [];
                    const completed = [];

                    for (let i = 0; i < quizzes.length; i++) {
                        const { userScore, scoreColor } = await fetchUserScore(quizzes[i].quizID);
                        quizzes[i].userScore = userScore;
                        quizzes[i].scoreColor = scoreColor;

                        if (userScore !== 'Not Attempted') {
                            completed.push(quizzes[i]);
                        } else {
                            current.push(quizzes[i]);
                        }
                    }

                    setCurrentQuizzes(current);
                    setCompletedQuizzes(completed);
                } else {
                    console.error('Failed to fetch quizzes:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleQuizClick = (quizID) => {
        localStorage.setItem('selectedQuizID', quizID);
        navigate('/quiz');
    }

    const handleCompleteQuizClick = (quizID) => {
        localStorage.setItem('selectedQuizID', quizID);
        navigate('/review');
    }

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

            <div className="module-main">
                <h1>{moduleCode} - {moduleTitle}</h1>
                <h2>Module Leader - {moduleTeacher}</h2>
                <h5>{moduleYear}</h5>

                <section className="module-section">
                    <h3>Current Quizzes</h3>
                    <div className="module-content">
                        {currentQuizzes.length > 0 ? (
                            currentQuizzes.map(quiz => (
                                <div
                                    key={quiz.quizID}
                                    className="quiz-item"
                                    onClick={() => handleQuizClick(quiz.quizID)}
                                    style={{ backgroundColor: quiz.scoreColor, fontSize: '1rem' }}
                                >
                                    <span className="quiz-week">Week {quiz.week}</span>
                                    <span className="quiz-title">{quiz.title}</span>
                                    <span className="quiz-score">{quiz.userScore}</span>
                                </div>
                            ))
                        ) : (
                            <p>No quizzes available.</p>
                        )}
                    </div>
                </section>

                <section className="module-section">
                    <h3>Completed Quizzes</h3>
                    <div className="module-content">
                        {completedQuizzes.length > 0 ? (
                            completedQuizzes.map(quiz => (
                                <div
                                    key={quiz.quizID}
                                    className="quiz-item"
                                    onClick={() => handleCompleteQuizClick(quiz.quizID)}
                                    style={{ backgroundColor: quiz.scoreColor, fontSize: '1rem' }}
                                    
                                >
                                    <span className="quiz-week">Week {quiz.week}</span>
                                    <span className="quiz-title">{quiz.title}</span>
                                    <span className="quiz-score">{quiz.userScore}</span>
                                </div>
                            ))
                        ) : (
                            <p>No completed quizzes</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ModulePage;
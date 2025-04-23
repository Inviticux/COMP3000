import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router';
import '../styles/editor.css';
import logo from '../assets/logo.svg';

const Editor = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('User');

    //tree data
    const [modulequizzes, setModuleQuizzes] = useState([]);
    const [questionids, setQuestionIds] = useState([]);

    //selection data
    const [selectedModuleCode, setSelectedModuleCode] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState('');
    const [selectedQuestionNumber, setSelectedQuestionNumber] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState('');


    //fetch user data on page load
    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        //data here
    }, []);

    //handling the create new module button
    const handleCreateNewModule = () => {
        //prompt the user for title teacher code weeks and year
        const title = prompt('Enter the module title:');
        const teacher = prompt('Enter the module teacher: ');
        const code = prompt('Enter the module code: ');
        const weeks = prompt('Enter the module weeks: ');
        const year = prompt('Enter the module year: ');

        if (title && teacher && code && weeks && year) {
            //send the data to the server
            fetch('http://localhost:82/api/module/addnewmodule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, teacher, code, weeks, year })
            })
            .then(response => alert(response.statusText))
            .then(data => {
                
            })
            .catch(error => console.error('Error creating module:', error));
        }
    }

    //handling the assign module to user button
    const handleAssignModuleToUser = () => {
        //prompt the user for email module code and year
        const email = prompt('Enter the user email:');
        const moduleCode = prompt('Enter the module code: ');
        const moduleYear = prompt('Enter the module year: ');

        if (email && moduleCode && moduleYear) {
            //send the data to the server
            fetch('http://localhost:82/api/module/assignmodule', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, moduleCode, moduleYear })
            })
            .then(response => alert(response.statusText))
            .then(data => {
                
            })
            .catch(error => console.error('Error assigning module to user:', error));
        }
    }

    //handling the create new quiz button
    const handleCreateNewQuiz = () => {
        //prompt the user for quizID title modulecode week and year
        const quizID = prompt('Enter the quiz ID:');
        const quizTitle = prompt('Enter the quiz title: ');
        const modulecode = prompt('Enter the module code: ');
        const week = prompt('Enter the quiz week: ');
        const year = prompt('Enter the quiz year: ');

        if (quizID && quizTitle && modulecode && week && year) {
            //send the data to the server
            fetch('http://localhost:82/api/quiz/newquiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizID, quizTitle, modulecode, year, week })
            })
            .then(response => alert(response.statusText))
            .then(data => {
                
            })
            .catch(error => console.error('Error creating quiz:', error));
        }
    }

    //handling the fill tree button
    const handleFillTree = () => {
        if (selectedModuleCode && selectedYear) {
            //fetch the quizzes for the module and year
            fetch('http://localhost:82/api/quiz/getmodulequizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ modulecode: selectedModuleCode, year: selectedYear })
            })
            .then(response => response.json())
            .then(data => {
                setModuleQuizzes(data.map(quiz => quiz.quizID));
                setQuestionIds(data.map(quiz => quiz.questionIDs.join(', ')));
            })
            .catch(error => console.error('Error fetching quizzes:', error));
        }
        else {
            alert('Please enter a module code and year to fill the tree.');
        }
    }

    //handling the fill question info button
    const handleFillQuestionInfo = () => {
        if (selectedQuestionId) {
            //fetch the question info from the server
            fetch('http://localhost:82/api/question/retrievequestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ questionID: selectedQuestionId })
            })
            .then(response => response.json())
            .then(data => {
                setSelectedQuestionNumber(data.questionNumber);
                setSelectedQuestion(data.question);
                setSelectedAnswers(data.answers);
                setSelectedCorrectAnswer(data.correctAnswer);
            })
            .catch(error => console.error('Error fetching question info:', error));
        }
        else {
            alert('Please enter a question ID to fill the question info.');
        }
    }

    //handling the submit info button
    const handleSubmitInfo = () => {
        //use the data from the inputs to create a new question with this format questionID, questionNumber, question, answers, correctAnswer, modulecode, year, week, quizID
        if (selectedQuestionId && selectedQuestionNumber && selectedQuestion && selectedAnswers.length > 0 && selectedCorrectAnswer && selectedModuleCode && selectedYear && selectedWeek && selectedQuizId) {
            //send the data to the server
            fetch('http://localhost:82/api/question/newquestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ questionID: selectedQuestionId, questionNumber: selectedQuestionNumber, question: selectedQuestion, answers: selectedAnswers, correctAnswer: selectedCorrectAnswer, modulecode: selectedModuleCode, year: selectedYear, week: selectedWeek, quizID: selectedQuizId })
            })
            .then(response => alert(response.statusText))
            .then(data => {
                
            })
            .catch(error => console.error('Error creating question:', error));
        }
        else {
            alert('Please fill in all the fields to create a new question.');
        }
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

            <div className="editor-main">
                <h1 className='editor-title'>Welcome to the Editor</h1>
                <section className='editor-master-buttons'>
                    <div className='masterbutton-container'>
                        <button className='masterbutton' onClick={handleCreateNewModule}>Create New Module</button>
                        <button className='masterbutton' onClick={handleAssignModuleToUser}>Assign Module to User</button>
                        <button className='masterbutton' onClick={handleCreateNewQuiz}>Create New Quiz</button>
                        <button className='masterbutton' onClick={handleFillTree}>Fill/Update Tree</button>
                        <button className='masterbutton' onClick={handleFillQuestionInfo}>Fill Question Info</button>
                    </div>
                </section>
                <section className='editor-treeandpreview'>
                    <div className='editor-tree'>
                        <h1 className='tree-title'>Module Tree</h1>
                        <h2 className='tree-modulecode'>Module - {selectedModuleCode}</h2>
                    {modulequizzes.map((id, index) => (
                        <div className='tree-item-container' key={id}>
                            <label key={id} className='tree-item-label' >QuizID: {id}</label>
                            <p className='tree-item-questionids'>{questionids[index]}</p>
                        </div>
                    ))}
                    </div>
                    <div className='editor-preview'>
                        <h1 className='preview-title'>Information Editor</h1>
                        <label className='input-label' htmlFor='input-modulecode'>Module Code</label>
                        <input id='input-modulecode' type='text' placeholder='Module Code' className='input-modulecode' value={selectedModuleCode} onChange={(e) => setSelectedModuleCode(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-year'>Year</label>
                        <input id='input-year' type='text' placeholder='Year' className='input-year' value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-week'>Week</label>
                        <input id='input-week' type='text' placeholder='Week' className='input-week' value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-quizid'>QuizID</label>
                        <input id='input-quizid' type='text' placeholder='QuizID' className='input-quizid' value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-questionid'>QuestionID</label>
                        <input id='input-questionid' type='text' placeholder='QuestionID' className='input-questionid' value={selectedQuestionId} onChange={(e) => setSelectedQuestionId(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-questionnumber'>Question Number</label>
                        <input id='input-questionnumber' type='text' placeholder='Question Number' className='input-questionnumber' value={selectedQuestionNumber} onChange={(e) => setSelectedQuestionNumber(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-question'>Question</label>
                        <input id='input-question' type='text' placeholder='Question?' className='input-question' value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}></input>
                        <label className='input-label' htmlFor='input-answer'>Answers</label>
                        <div className='input-answer-container'>
                            <div className='input-answer-item'>
                                <label className='answer-label'>A. </label>
                                <input type='text' placeholder='Answer A' className='input-answer-a' value={selectedAnswers[0] || ''} onChange={(e) => {
                                    const updatedAnswers = [...selectedAnswers];
                                    updatedAnswers[0] = e.target.value;
                                    setSelectedAnswers(updatedAnswers);
                                }}></input>
                            </div>
                            <div className='input-answer-item'>
                                <label className='answer-label'>B. </label>
                                <input type='text' placeholder='Answer B' className='input-answer-b' value={selectedAnswers[1] || ''} onChange={(e) => {
                                    const updatedAnswers = [...selectedAnswers];
                                    updatedAnswers[1] = e.target.value;
                                    setSelectedAnswers(updatedAnswers);
                                }}></input>
                            </div>
                            <div className='input-answer-item'>
                                <label className='answer-label'>C. </label>
                                <input type='text' placeholder='Answer C' className='input-answer-c' value={selectedAnswers[2] || ''} onChange={(e) => {
                                    const updatedAnswers = [...selectedAnswers];
                                    updatedAnswers[2] = e.target.value;
                                    setSelectedAnswers(updatedAnswers);
                                }}></input>
                            </div>
                            <div className='input-answer-item'>
                                <label className='answer-label'>D. </label>
                                <input type='text' placeholder='Answer D' className='input-answer-d' value={selectedAnswers[3] || ''} onChange={(e) => {
                                    const updatedAnswers = [...selectedAnswers];
                                    updatedAnswers[3] = e.target.value;
                                    setSelectedAnswers(updatedAnswers);
                                }}></input>
                            </div>
                        </div>
                        <label className='correctanswer-label'>Select Correct Answer</label>
                        <select className='input-correctanswer' value={selectedCorrectAnswer} onChange={(e) => setSelectedCorrectAnswer(e.target.value)}>
                            <option value='A'>A</option>
                            <option value='B'>B</option>
                            <option value='C'>C</option>
                            <option value='D'>D</option>
                        </select>
                        <button className='preview-sumbit' onClick={handleSubmitInfo}>Submit Info and Create New Question</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Editor;
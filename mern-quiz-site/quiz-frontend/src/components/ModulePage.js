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

    //fetch user data on page load
    useEffect(() => {
        setModuleCode(localStorage.getItem('selectedModuleCode'));
        setModuleTitle(localStorage.getItem('selectedModuleTitle'));
        setModuleTeacher(localStorage.getItem('selectedModuleTeacher'));
        setModuleYear(localStorage.getItem('selectedModuleYear'));
        //logic to fetch module from local storage and get related quizzes
    }, []);

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

            <div className="module-main">
                <h1>{moduleCode} - {moduleTitle}</h1>
                <h2>Module Leader - {moduleTeacher}</h2>
                <h5>{moduleYear}</h5>

                <section className="module-section">
                    <h3>Current and Upcoming Quizzes</h3>
                    <div className="module-content">
                    </div>
                </section>

                <section className="module-section">
                    <h3>Past Quizzes</h3>
                    <div className="module-content"></div>
                </section>
            </div>
        </div>
    );
};

export default ModulePage;
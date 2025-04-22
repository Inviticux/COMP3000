import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/dashboard.css';
import logo from '../assets/logo.svg';

const Dashboard = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('User');
    const [modules, setModules] = useState([]);
    const [currentModules, setCurrentModules] = useState([]);
    const [pastModules, setPastModules] = useState([]);

    //fetch user data on page load, store the modules for processing
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    console.error('No user email found in localStorage');
                    return;
                }

                const response = await fetch(`http://localhost:82/api/user/getuser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role);
                    setUserName(data.name || 'User');
                    localStorage.setItem('userModules', JSON.stringify(data.modules || []));
                } else {
                    console.error('Failed to fetch user data:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        //handle fetching of the module information
        const fetchModuleDetails = async () => {
            const storedModules = JSON.parse(localStorage.getItem('userModules')) || [];
            const moduleDetails = [];
            for (let i = 0; i < storedModules.length; i++) {
                const moduleCode = storedModules[i].slice(0, -4);
                const moduleYear = storedModules[i].slice(-4);
                console.log(`Fetching details for module: ${moduleCode}, Year: ${moduleYear}`);
                try {
                    const response = await fetch(`http://localhost:82/api/module/getmodule`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ moduleCode: `${moduleCode}`, moduleYear: `${moduleYear}` }),
                    });

                    if (response.ok) {
                        const moduleData = await response.json();
                        moduleData.year = moduleYear;
                        moduleDetails.push(moduleData);
                    } else {
                        console.error(`Failed to fetch module ${moduleCode}${moduleYear}:`, await response.text());
                    }
                } catch (error) {
                    console.error(`Error fetching module ${moduleCode}${moduleYear}:`, error);
                }
            }

            //assign modules based on status
            const current = moduleDetails.filter(module => module.status !== 'Completed');
            const past = moduleDetails.filter(module => module.status === 'Completed');
            setCurrentModules(current);
            setPastModules(past);
        };

        //on page load fetch all relevant data
        const fetchAllData = async () => {
            await fetchUserData();
            await fetchModuleDetails();
        };

        fetchAllData();
    }, []);

    //method to handle module click, send code to 
    const handleModuleClick = (moduleCode, moduleTitle, moduleTeacher, moduleYear) => {
        localStorage.setItem('selectedModuleCode', moduleCode);
        localStorage.setItem('selectedModuleTitle', moduleTitle);
        localStorage.setItem('selectedModuleTeacher', moduleTeacher);
        localStorage.setItem('selectedModuleYear', moduleYear);
        navigate(`/module`);
    };

    //colors for the words provided, probs should be used in the api instead of names of colours 
    const colorMap = {
        red: '#F9B9B9',
        orange: '#FBD2B1',
        yellow: '#F4ECC9',
        green: '#CBE9A7',
        blue: '#91DDD4',
        black: '#525150',
        purple: '#C8B6FF',
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

            <div className="dashboard-main">
                <h1>Welcome back, {userName}!</h1>
                <h2>Dashboard</h2>

                <section className="dashboard-section">
                    <h3>Currently Enrolled Modules</h3>
                    <div className="dashboard-content">
                        {currentModules.map((module, index) => (
                            <div
                                key={index}
                                className="module-card"
                                onClick={() => handleModuleClick(module.code, module.title, module.teacher, module.year)}
                            >
                                <div
                                    className="module-color-box"
                                    style={{ backgroundColor: colorMap[module.color] || '#FFFFFF' }}
                                >
                                    <span className="module-code">{module.code}</span>
                                </div>
                                <div className="module-info">
                                    <h4 className="module-title">{module.title}</h4>
                                    <p className="module-teacher">{module.year} - {module.teacher}</p>
                                </div>
                                <div className="module-status">
                                    <span>{module.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h3>Past Modules</h3>
                    <div className="dashboard-content">
                        {pastModules.map((module, index) => (
                            <div
                                key={index}
                                className="module-card"
                                onClick={() => handleModuleClick(module.code, module.title, module.teacher, module.year)}
                            >
                                <div
                                    className="module-color-box"
                                    style={{ backgroundColor: colorMap[module.color] || '#FFFFFF' }}
                                >
                                    <span className="module-code">{module.code}</span>
                                </div>
                                <div className="module-info">
                                    <h4 className="module-title">{module.title}</h4>
                                    <p className="module-teacher">{module.year} - {module.teacher}</p>
                                </div>
                                <div className="module-status">
                                    <span>{module.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
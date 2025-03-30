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

    //fetch user data on page load
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

        const fetchModuleDetails = async () => {
            const storedModules = JSON.parse(localStorage.getItem('userModules')) || [];
            const moduleDetails = [];
            for (let i = 0; i < storedModules.length; i++) {
                console.log(`Fetching details for module: ${storedModules[i]}`);
                try {
                    const response = await fetch(`http://localhost:82/api/module/getmodule`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ moduleCode: storedModules[i] }),
                    });

                    if (response.ok) {
                        const moduleData = await response.json();
                        moduleDetails.push(moduleData);
                    } else {
                        console.error(`Failed to fetch module ${storedModules[i]}:`, await response.text());
                    }
                } catch (error) {
                    console.error(`Error fetching module ${storedModules[i]}:`, error);
                }
            }
            setModules(moduleDetails);
        };

        const fetchAllData = async () => {
            await fetchUserData();
            await fetchModuleDetails();
        };

        fetchAllData();
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
                <div className="header-logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h4 className="logo-text">Llamalyze</h4>
                </div>
                <div className="header-buttons">
                    {userRole === 'lecturer' && (
                        <button onClick={() => navigate('/lecturerview')}>Editor</button>
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
                        {modules.map((module, index) => (
                            <div key={index} className="module-card">
                                <div
                                    className="module-color-box"
                                    style={{ backgroundColor: colorMap[module.color] || '#FFFFFF' }}
                                >
                                    <span className="module-code">{module.code}</span>
                                </div>
                                <div className="module-info">
                                    <h4 className="module-title">{module.title}</h4>
                                    <p className="module-teacher">{module.teacher}</p>
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
                    <div className="dashboard-content"></div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
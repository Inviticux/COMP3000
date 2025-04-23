import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/profile.css';
import logo from '../assets/logo.svg';

const ProfilePage = () => {
    const navigate = useNavigate();

    //declare state types
    const [userRole, setUserRole] = useState('');
    const [ismanaged, setIsManaged] = useState('Managed');
    const [userName, setUserName] = useState('User');

    //updating users modules
    const [currentModules, setCurrentModules] = useState([]);

    //fetch user data on page load
    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
        setUserName(localStorage.getItem('userName'));

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
            setCurrentModules(current);
        };

        fetchModuleDetails();
    }, []);

    //handle prefered name change
    const handlePreferedNameChange = async () => {
        const newName = prompt('Enter your new prefered name:');
        if (newName) {
            try {
                const response = await fetch('http://localhost:82/api/user/changename', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: localStorage.getItem("userEmail"), name: newName }),
                });

                if (response.ok) {
                    alert('Prefered name updated successfully!');
                    setUserName(newName);
                } else {
                    alert('Failed to update prefered name. Please try again.');
                }
            } catch (error) {
                console.error('Error updating prefered name:', error);
            }
        }
    };

    //handle password change
    const handlePasswordChange = async () => {
        const currentPassword = prompt('Enter your current password:');
        const newPassword = prompt('Enter your new password:');
        if (newPassword) {
            try {
                const response = await fetch('http://localhost:82/api/user/changepassword', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: localStorage.getItem("userEmail"), oldPassword: currentPassword,  newPassword: newPassword }),
                });

                if (response.ok) {
                    alert('Password updated successfully!');
                } else {
                    alert('Failed to update password. Please try again.');
                }
            } catch (error) {
                console.error('Error updating password:', error);
            }
        }
    }

    //handle log out
    const handleLogOut = () => {
        localStorage.clear();
        navigate('/');
    };

    //handle account deletion
    const handleAccountDeletion = async () => {
        const currentPassword = prompt('Enter your current password:');
        if (currentPassword) {
            window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
            try {
                const response = await fetch('http://localhost:82/api/user/deleteuser', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: localStorage.getItem("userEmail") , confirmPassword: currentPassword }),
                });

                if (response.ok) {
                    alert('Account deleted successfully!');
                    localStorage.clear();
                    navigate('/');
                } else {
                    alert('Failed to delete account. Please try again later.');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    }

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

            <div className="profile-main">
                <section className='profile-info-modules'>
                    <div className='profile-info-container'>
                        <img src={logo} alt="Logo" className="profile-logo" />
                        <div className='profile-info-text'>
                            <h1 className="profile-name">{userName}</h1>
                            <h2 className="profile-role">{userRole} at the University of Plymouth</h2>
                        </div>
                    </div>
                    <div className='profile-modules-container'>
                        <h2>Currently {ismanaged} Modules</h2>
                        {currentModules.map((module, index) => (
                            <div
                                key={index}
                                className="profile-module"
                                style={{ backgroundColor: colorMap[module.color] || '#FFFFFF' }}
                            >
                                
                                <div className="profile-module-info">
                                <h4 className="profile-module-title">{module.title}</h4>
                                <p className="profile-module-teacher">{module.year} - {module.teacher}</p>
                                </div>
                                <span className="profile-module-code">{module.code}</span>
                            </div>
                        ))}

                    </div>
                </section>
                <section className='profile-controls'>
                    <div className='profile-controls-container'>
                        <h2 className='profile-controls-title'>Account Controls</h2>
                        <button className='control-button' onClick={handlePreferedNameChange}>Change Prefered Name</button>
                        <button className='control-button' onClick={handlePasswordChange}>Change Password</button>
                        <button className='control-button-delete' onClick={handleLogOut}>Log Out</button>
                        <button className='control-button-delete' onClick={handleAccountDeletion}>Delete Account</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
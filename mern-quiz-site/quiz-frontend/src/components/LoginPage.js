import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/login.css';
import logo from '../assets/logo.svg';

const LoginPage = () => {
    const navigate = useNavigate();

    //declare state types
    const [formType, setFormType] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLecturer, setRole]= useState(false);
    const [message, setMessageState] = useState('');

    //update the role descriptor on the page to reflect the users role in real time
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setRole(!newEmail.includes('students'));
    }


    //handle requests
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        //set the user data before submission to the API 
        const userData = {
            email: email,
            password: password,
            role: isLecturer ? 'lecturer' : 'student'
        };
    
        if (formType === 'signup' && password !== confirmPassword) {
            setMessageState('Passwords do not match!');
            return;
        } else if (formType === 'signup' && password === confirmPassword) {
            try {
                //attempt to post a new user
                const response = await fetch('http://localhost:82/api/user/newuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
    
                if (response.ok) {
                    setMessageState('Account created successfully!');
                    
                    //change the form type to login after signing up
                    setFormType('login');
                } else {
                    const errorData = await response.text();
                    setMessageState(`Signup failed`);
                }
            } catch (error) {
                setMessageState('An error occurred during signup.');
                console.error(error);
            }
        } else if (formType === 'login') {
            try {
                const response = await fetch('http://localhost:82/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password })
                });
    
                if (response.ok) {
                    const data = await response.json();
                    //save the users email to use later
                    localStorage.setItem('userEmail', email);
                    setMessageState(data.message);
                    navigate('/dashboard');
                } else {
                    const errorData = await response.text();
                    setMessageState(`Login failed: ${errorData}`);
                }
            } catch (error) {
                setMessageState('An error occurred during login.');
                console.error(error);
            }
        }
    };

    return (
        <div className='login-root'>
            <div className='form-container'>
                <form className='login-form'>
                    <img className='form-logo' src={logo}/>
                    <h1>{formType === 'login' ? 'Login' : 'Sign Up'}</h1>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>Organisation Email</label>
                        <input
                            className='form-input'
                            type='email'
                            id='email'
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <p className='role-display'>You are signing in as a {isLecturer ? 'Lecturer' : 'Student'}</p>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='password'>Password</label>
                        <input
                            className='form-input'
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {formType === 'signup' && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmpassword">Confirm Password</label>
                            <input
                            className="form-input"
                            type="password"
                            id="confirmpassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            />
                        </div>
                    )}
                    <button type='submit' className='form-submit' onClick={handleSubmit}>
                        {formType === 'login' ? 'Login' : 'Sign Up' }
                    </button>
                </form>
                <div className="toggle-link">
                {formType === 'login' ? (
                    <p>Don't have an account? <span onClick={() => setFormType('signup')}>Sign Up</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setFormType('login')}>Login</span></p>
                )}
                </div>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
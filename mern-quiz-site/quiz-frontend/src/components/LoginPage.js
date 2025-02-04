import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginPage = () => {
    const navigate = useNavigate();

    //declare state types
    const [formType, setFormType] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessageState] = useState('');

    //handle requests


    return (
        <div className='login-root'>
            <div className='form-container'>
                <form className='login-form'>
                    <img className='form-logo' />
                    <h1>{formType === 'Login' ? 'Login' : 'Sign Up'}</h1>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>Organisation Email</label>
                        <input
                            className='form-input'
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
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
                    <button type='submit' className='form-submit'>
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
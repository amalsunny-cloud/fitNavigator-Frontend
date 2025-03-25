import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/TrainerLogin.css'; // Import external CSS file for styling
import axios from 'axios'

import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import trainerAuthImage from '../../assets/trainerlogin.png'; 

import toast, { Toaster } from 'react-hot-toast';


const TrainerLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const { email, password } = credentials;

        if (!email || !password) {
            toast.error("Fill all the fields");

            return;
        } 
        // else {
        //     toast.success("Login Successful");
        //     navigate('/trainer/dashboard');
        // }

        try {
          // Make an API call to the backend
          console.log("before try");
          
          const response = await axios.post('http://localhost:3000/trainer-login', {
            email,
            password,
          });
    
            console.log(response);
            
          // Handle success response
          const { token, existingTrainer  } = response.data; // Extract token
          toast.success('Login Successful');
    
          // Save token to localStorage or sessionStorage
          sessionStorage.setItem('trainerToken', token);
          sessionStorage.setItem('trainerId', existingTrainer._id);

    
          // Navigate to the trainer dashboard
          setTimeout(()=>{
            navigate('/trainer/dashboard');
          },1000)

        } catch (error) {
          // Handle error response
          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error('An error occurred. Please try again.');
          }
        }
    };

    return (
        <>
         {/* <div className="login-container">
      <div className="login-card">
        <div className="card-header">
         
          <div className="auth-icon">
                        🔐
            </div>
        </div>
        
        <div className="card-body">
          <h2>Welcome Back!</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="">
            <label className="">Email Address</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="">
            <label className="">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
    
        </div>
      </div>
      </div>
      <ToastContainer/> */}





<div className="auth-container">
            <div className="auth-illustration">
                <img src={trainerAuthImage} alt="Trainer Authentication" />
                <h2 className="illustration-text">Fitness Expert Portal</h2>
                <p>Transform lives through personalized training</p>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-container">
                        <FaSignInAlt className="auth-icon pulse" />
                    </div>
                    <h2>Welcome Back!</h2>
                    <p className="auth-subtitle">Sign in to manage your training programs</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-trainer">
                    <div className="form-group-trainer">
                        <label>
                            <FaEnvelope className="input-icon" />
                            {/* Email Address */}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="fade-in"
                        />
                    </div>

                    <div className="form-group-trainer">
                        <label>
                            <FaLock className="input-icon" />
                            {/* Password */}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="fade-in"
                        />
                    </div>

                    <button type="submit" className="submit-btn hover-effect">
                        <FaSignInAlt className="btn-icon" />
                        Sign In
                    </button>
                </form>

                {/* <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/trainer/register')}
                            className="toggle-auth hover-effect"
                        >
                            Register Now
                        </span>
                    </p>
                </div> */}
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#4CAF50',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#FF5252',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    </>
    );
};

export default TrainerLogin;

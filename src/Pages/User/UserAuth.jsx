import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { UserIcon, Mail, Lock, Target } from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';
import userAuthImage from '../../assets/userlogin.png';
import '../../Styles/UserAuth.css'



const UserAuth = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    purpose: ''
  });
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });



  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("params inside useEffect",params);

    if (params.get('login') === 'true') {
      setIsRegister(false);
    }
  }, [location.search]);



  const handleChange = (e) => {
    if (isRegister) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, purpose } = formData;
    if (!username || !email || !password || !purpose) {
      toast.error("Please fill all fields");
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { 
          username, email, password, purpose 
        });
        toast.success("Registered Successfully");
        setFormData({ username: '', email: '', password: '', purpose: '' });
        setIsRegister(false);
      } catch (error) {
        toast.error("Error registering. Please try again.");
      }
    }
  };

  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    if (!email || !password) {
      toast.error("Please fill all fields.");
      return;

    }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { 
          email, password 
        });
        const { token, user } = response.data;
        console.log("response.data is in login",response.data);
        

        if (!token) {
          throw new Error("Token not received from the server.");
        }

        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('userToken', token);
        toast.success("Login Successful");

        setTimeout(() => {
          navigate('/userdashboard');
        }, 1000);

      } catch (error) {
        setCredentials({ email: '', password: '' });

        if (error.response) {
          // Server responded with an error status
          toast.error("Invalid credentials. Please try again.");
        } else if (error.request) {
          // No response from server
          toast.error("No response from server. Please check your connection.");
        } else {
          // Other unknown errors
          toast.error("An error occurred. Please try again.");
        }
      }
    
  };

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRegister(!isRegister);
      setIsAnimating(false);
    }, 300);
  };

  return (
    
    <div className="auth-container">
      <div className="auth-illustration">
        <img src={userAuthImage} alt="Fitness Journey" />
        <h2 className="illustration-text">Transform Your Fitness</h2>
        <p>Start your personalized journey today</p>
      </div>

      <div className={`auth-card ${isRegister ? 'register' : 'login'}`}>
        <div className="auth-header-user">
          <div className="auth-icon-container">
            {isRegister ? (
              <UserIcon className="auth-icon" size={24} />
            ) : (
              <Lock className="auth-icon" size={24} />
            )}
          </div>
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isRegister ? 'Begin your fitness journey today' : 'Continue your path to fitness journey'}
          </p>
        </div>

        <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="auth-form-user">
          {isRegister && (
            <div className="form-group-user">
              <label>
                <UserIcon className="input-icon" size={18} />
                {/* Username */}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="fade-in"
              />
            </div>
          )}

          <div className="form-group-user">
            <label>
              <Mail className="input-icon" size={18} />
              {/* Email */}
            </label>
            <input
              type="email"
              name="email"
              value={isRegister ? formData.email : credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="fade-in"
            />
          </div>

          <div className="form-group-user">
            <label>
              <Lock className="input-icon" size={18} />
              {/* Password */}
            </label>
            <input
              type="password"
              name="password"
              value={isRegister ? formData.password : credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="fade-in"
            />
          </div>

          {isRegister && (
            <div className="form-group-user">
              <label>
                <Target className="input-icon" size={18} />
                {/* Fitness Goal */}
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="fade-in"
              >
                <option value="">Select your primary goal</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn hover-effect">
            {isRegister ? (
              <>
                <UserIcon className="btn-icon" size={18} />
                Create Account
              </>
            ) : (
              <>
                <Lock className="btn-icon" size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-auth hover-effect"
            >
              {isRegister ? 'Sign In Here' : 'Register Now'}
            </span>
          </p>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: { primary: '#4CAF50', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#FF5252', secondary: '#fff' }
          }
        }}
      />
    </div>
  );
};

export default UserAuth;
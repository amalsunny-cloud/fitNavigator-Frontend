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
    // <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    //   <div className={`bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
    //     <div className="p-8">
    //       <div className="text-center mb-8">
    //         <h2 className="text-3xl font-bold text-gray-800 mb-2">
    //           {isRegister ? 'Create Account' : 'Welcome Back'}
    //         </h2>
    //         <p className="text-gray-600">
    //           {isRegister ? 'Begin your fitness journey today' : 'Continue your path to fitness'}
    //         </p>
    //       </div>

    //       <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} 
    //             className="space-y-6">
    //         {isRegister && (
    //           <div className="relative">
    //             <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //             <input
    //               type="text"
    //               name="username"
    //               value={formData.username}
    //               onChange={handleChange}
    //               placeholder="Username"
    //               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    //             />
    //           </div>
    //         )}

    //         <div className="relative">
    //           <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //           <input
    //             type="email"
    //             name="email"
    //             value={isRegister ? formData.email : credentials.email}
    //             onChange={handleChange}
    //             placeholder="Email"
    //             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    //           />
    //         </div>

    //         <div className="relative">
    //           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //           <input
    //             type="password"
    //             name="password"
    //             value={isRegister ? formData.password : credentials.password}
    //             onChange={handleChange}
    //             placeholder="Password"
    //             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    //           />
    //         </div>

    //         {isRegister && (
    //           <div className="relative">
    //             <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    //             <select
    //               name="purpose"
    //               value={formData.purpose}
    //               onChange={handleChange}
    //               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
    //             >
    //               <option value="">Select Purpose</option>
    //               <option value="Muscle Building">Muscle Building</option>
    //               <option value="Weight Loss">Weight Loss</option>
    //               <option value="Endurance">Endurance</option>
    //             </select>
    //           </div>
    //         )}

    //         <button
    //           type="submit"
    //           className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200"
    //         >
    //           {isRegister ? 'Create Account' : 'Sign In'}
    //         </button>
    //       </form>

    //       <div className="mt-6 text-center">
    //         <p className="text-gray-600">
    //           {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
    //           <button
    //             onClick={toggleMode}
    //             className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200"
    //           >
    //             {isRegister ? 'Sign In' : 'Create Account'}
    //           </button>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    //   <ToastContainer position="top-right" autoClose={3000} />
    // </div>





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
            {isRegister ? 'Begin your fitness journey today' : 'Continue your path to fitness'}
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
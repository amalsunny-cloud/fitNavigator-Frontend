import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/AdminAuth.css'; 
import axios from 'axios'


import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import adminAuthImage from '../../assets/bank-security.png';

import toast, { Toaster } from 'react-hot-toast';



const AdminAuth = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [credentials, setCredentials] = useState({ email: '', password: '' });



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

    const handleRegisterSubmit = async(e) => {
        e.preventDefault();
        const { username, email, password } = formData;
        if (!username || !email || !password) {
            toast.error("Please fill all fields.");
            return;
        } 
        // else {
        //     toast.success("Admin Registered Successfully");
        //     setFormData({ username: '', email: '', password: '' });
        //     setIsRegister(false);
        // }


        try {
            console.log("before response");
            const response = await axios.post('http://localhost:3000/admin-register', {
                username,
                email,
                password,
            });

            toast.success("Admin Registered Successfully");
            console.log("Registration Response:", response.data);

            // Clear form fields and switch to login view
            setFormData({ username: '', email: '', password: '' });
            setIsRegister(false);
            } catch (error) {
                console.error("Error during admin registration:", error);
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            }
    };

    const handleLoginSubmit = async(e) => {
        e.preventDefault();
        const { email, password } = credentials;
        if (!email || !password) {
            toast.error("Please fill all fields.");
        } 
        // else {
        //     toast.success("Admin Login Successful");
        //     navigate('/admindashboard');
        // }
        try {
            console.log("before response");
            
            const response = await axios.post('http://localhost:3000/admin-login', {
                email,
                password,
            });

            // const { token, existingAdmin } = response.data;
            // toast.success("Admin Login Successful");
            // console.log("Login Response:", response.data);

            if (response.data && response.data.token) {
                const { token, admin } = response.data;
                
                // Store session data
                sessionStorage.setItem('adminToken', token);
                sessionStorage.setItem('adminId', admin.id);
                
                toast.success("Admin Login Successful");
                
                setTimeout(() => {
                  navigate('/admindashboard');
                }, 1000);
              }
        
        } catch (error) {
            console.error("Error during admin login:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Invalid email or password. Please try again.");
            }
        }
    };

    return (
        // <div className="auth-container">
        //     <div className="auth-card">
        //         <div className="auth-header">
        //             <h2>{isRegister ? 'Admin Registration' : 'Admin Login'}</h2>
                    
        //         </div>

        //         <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="auth-form">
        //             {isRegister && (
        //                 <div className="form-group">
        //                     <label>Username</label>
        //                     <input
        //                         type="text"
        //                         name="username"
        //                         value={formData.username}
        //                         onChange={handleChange}
        //                         placeholder="Enter your username"
        //                     />
        //                 </div>
        //             )}

        //             <div className="form-group">
        //                 <label>Email</label>
        //                 <input
        //                     type="email"
        //                     name="email"
        //                     value={isRegister ? formData.email : credentials.email}
        //                     onChange={handleChange}
        //                     placeholder="Enter your email"
        //                 />
        //             </div>

        //             <div className="form-group">
        //                 <label>Password</label>
        //                 <input
        //                     type="password"
        //                     name="password"
        //                     value={isRegister ? formData.password : credentials.password}
        //                     onChange={handleChange}
        //                     placeholder="Enter your password"
        //                 />
        //             </div>

        //             <button type="submit" className="submit-btn">
        //                 {isRegister ? 'Register' : 'Sign In'}
        //             </button>
        //         </form>

        //         <div className="auth-footer">
        //             <p>
        //                 {isRegister ? 'Already have an admin account?' : "Don't have an admin account?"}{' '}
        //                 <span
        //                     onClick={() => setIsRegister(!isRegister)}
        //                     className="toggle-auth"
        //                 >
        //                     {isRegister ? 'Sign In' : 'Register'}
        //                 </span>
        //             </p>
        //         </div>
        //     </div>
        //     <ToastContainer />
        // </div>


        <div className="auth-container">
            <div className="auth-illustration">
                <img src={adminAuthImage} alt="Admin Authentication" />
                <h2 className="illustration-text">Secure Admin Portal</h2>
                <p>Manage your platform with confidence</p>
            </div>

            <div className={`auth-card ${isRegister ? 'register' : 'login'}`}>
                <div className="auth-card-submain">
                <div className="auth-header-admin">
                    <div className="auth-icon-container">
                        {isRegister ? (
                            <FaUserPlus className="auth-icon pulse" />
                        ) : (
                            <FaSignInAlt className="auth-icon pulse" />
                        )}
                    </div>
                    <h2>{isRegister ? 'Admin Registration' : 'Admin Login'}</h2>
                    <p className="auth-subtitle">
                        {isRegister 
                            ? 'Create your administration account' 
                            : 'Welcome back! Please sign in to continue'}
                    </p>
                </div>

                <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="auth-form-admin">
                    {isRegister && (
                        <div className="form-group-admin">
                            <label>
                                <FaUser className="input-icon" />
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

                    <div className="form-group-admin">
                        <label>
                            <FaEnvelope className="input-icon" />
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

                    <div className="form-group-admin">
                        <label>
                            <FaLock className="input-icon" />
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

                    <button type="submit" className="submit-btn hover-effect">
                        {isRegister ? (
                            <>
                                <FaUserPlus className="btn-icon" />
                                Register
                            </>
                        ) : (
                            <>
                                <FaSignInAlt className="btn-icon" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isRegister ? 'Already registered?' : "Need an account?"}{' '}
                        <span
                            onClick={() => setIsRegister(!isRegister)}
                            className="toggle-auth hover-effect"
                        >
                            {isRegister ? 'Sign In Here' : 'Register Now'}
                        </span>
                    </p>
                </div>
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
    );
};

export default AdminAuth;

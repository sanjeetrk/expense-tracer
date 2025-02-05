import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../GoogleLoginApi'
import googleLogo from '../assets/google.svg'
import './Login.css'

const Login = () => {
  const [Logininfo, setLogininfo] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if(authResult['code']){
        console.log('Google auth code received:', authResult['code']);
        const result = await googleAuth(authResult['code']);
        console.log('Backend response:', result.data);
        
        if (result.data.success) {
          handleSuccess(result.data.message);
          const userData = {
            email: result.data.email,
            name: result.data.name,
            Image: result.data.Image 
          };
          console.log('Storing user data:', userData);
          
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/home');
        } else {
          handleError(result.data.message);
        }
      }
    } catch (error) {
      console.error('Google auth error:', error);
      console.error('Error response:', error.response?.data);
      handleError('Failed to authenticate with Google');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogininfo(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = Logininfo;
    if (!email || !password) {
      return handleError("All fields are required");
    }
    try {
      const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Logininfo)
      });
      const result = await response.json();
      const { message, success, token, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({
          email: Logininfo.email,
          name
        }));
        setTimeout(() => {
          navigate("/home")
        }, 1000)
      } else if (error) {
        handleError(error?.details[0]?.message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error('Login error:', error);
      handleError(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please enter your details</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={Logininfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={Logininfo.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign in
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="google-button"
          >
            <img 
              src={googleLogo}
              alt="Google logo" 
              className="google-icon"
            />
            Continue with Google
          </button>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login

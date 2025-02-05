import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GoogleLogin from './pages/GoogleLogin';
import 'react-toastify/ReactToastify.css';
import RefreshHandler from './RefreshHandler';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId='891374370080-rd10ap9t9dh7sga4p067uage0js5jsd8.apps.googleusercontent.com'>
        <GoogleLogin />
      </GoogleOAuthProvider>
    )
  }

  const LoginWrapper = () => {
    return (
      <GoogleOAuthProvider clientId='891374370080-rd10ap9t9dh7sga4p067uage0js5jsd8.apps.googleusercontent.com'>
        <Login />
      </GoogleOAuthProvider>
    )
  }

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/google-login" element={<GoogleAuthWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;

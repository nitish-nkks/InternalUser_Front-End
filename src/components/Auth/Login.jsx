import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import './AnimatedBackground.css'
import { loginUser, getInternalUserDetails } from '../../api/api'
import { jwtDecode } from 'jwt-decode'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await loginUser(email, password);
      const token = response.data.token;

      // Save token to local storage
      localStorage.setItem("authToken", token);

      // Decode token and store all its data
      const decodedToken = jwtDecode(token);
      localStorage.setItem("decodedToken", JSON.stringify(decodedToken));

      // Fetch and save user details using UserId from the decoded token
      const userDetails = await getInternalUserDetails(decodedToken.UserId);
      localStorage.setItem("userDetails", JSON.stringify(userDetails.data.data));

      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      alert('Login failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  }

  return (
    <div className="login-container">
      <div className="animated-background">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="url(#grad1)"/>
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1890ff"/>
                    <stop offset="100%" stopColor="#52c41a"/>
                  </linearGradient>
                </defs>
                <path d="M20 8C16 8 13 11 13 15C13 19 16 22 20 22C24 22 27 19 27 15C27 11 24 8 20 8Z" fill="white"/>
                <path d="M12 24C12 22.9 12.9 22 14 22H26C27.1 22 28 22.9 28 24V30C28 31.1 27.1 32 26 32H14C12.9 32 12 31.1 12 30V24Z" fill="white"/>
                <circle cx="20" cy="15" r="2" fill="#1890ff"/>
                <rect x="15" y="26" width="10" height="2" rx="1" fill="#1890ff"/>
              </svg>
            </div>
            <h1>Feedora Admin Panel</h1>
          </div>
          <p>Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2024 Feedora Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
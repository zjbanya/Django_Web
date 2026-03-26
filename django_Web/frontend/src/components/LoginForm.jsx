import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import userApi from '../api/user'
import { setAuthTokens } from '../utils/auth'
/**
 * Reusable login form component.
 * Handles input state, simple validation, API call, and feedback UI.
 */
function LoginForm() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const switchTimerRef = useRef(null)
  /** After one-shot typing animation ends, prompt is removed (no loop). */
  const [showLoginPrompt, setShowLoginPrompt] = useState(true)

  const isLogin = mode === 'login'
  const submitText = useMemo(() => (isLogin ? 'Sign In' : 'Register'), [isLogin])

  /* Match total CSS typing duration: line1 (~2.2s) + line2 (~2s) + short pause before unmount */
  const PROMPT_HIDE_MS = 4800

  useEffect(() => {
    if (!isLogin) {
      setShowLoginPrompt(false)
      return
    }
    setShowLoginPrompt(true)
    // const id = window.setTimeout(() => setShowLoginPrompt(false), PROMPT_HIDE_MS)
    // return () => window.clearTimeout(id)
  }, [isLogin])

  // Validates form fields before sending request to backend.
  const validateInputs = () => {
    if (!username.trim() || !password.trim() || (!isLogin && !email.trim())) {
      setError(isLogin ? 'Username and password are required.' : 'Email, username and password are required.')
      setSuccess('')
      return false
    }
    return true
  }

  const handleModeSwitch = (nextMode) => {
    if (nextMode === mode) return
    setIsFading(true)
    setError('')
    setSuccess('')

    if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current)

    switchTimerRef.current = window.setTimeout(() => {
      setMode(nextMode)
      setIsFading(false)
    }, 180)
  }

  // Handles login button click and calls the centralized axios API module.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateInputs()) return

    try {
      setLoading(true)
      if (isLogin) {
        const result = await userApi.login({ username, password })
        if (result?.access) {
          setAuthTokens(result.access, result.refresh, result.username)
          setSuccess('Login successful. Redirecting...')
          window.setTimeout(() => navigate('/', { replace: true }), 400)
        } else {
          setSuccess('Login request succeeded.')
        }
      } else {
        const result = await userApi.register({ email, username, password })
        setSuccess(result?.message || 'Register successful. Please sign in.')
      }
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.email?.[0] ||
        err?.message
      setError(backendMessage || 'Unable to login right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-content">
        {isLogin && showLoginPrompt ? (
          <div className="login-prompt-wrap">
            {/* One-shot line-by-line typing; unmounted after PROMPT_HIDE_MS (see useEffect). */}
            <div className="login-prompt-lines" aria-hidden="true">
              <div className="login-line login-line-1">Welcome back Sign in with</div>
              <div className="login-line login-line-2">
                <span className="login-line-2-text">your account details</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${isLogin ? 'auth-toggle-btn-active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Login
          </button>
          <span className="auth-toggle-sep">|</span>
          <button
            type="button"
            className={`auth-toggle-btn ${!isLogin ? 'auth-toggle-btn-active' : ''}`}
            onClick={() => handleModeSwitch('register')}
          >
            Register
          </button>
        </div>

        <div className={`form-content ${isFading ? 'form-content-fade' : ''}`}>
          {!isLogin ? (
            <>
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </>
          ) : null}

          <label className="login-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="login-input"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />

          <label className="login-label" htmlFor="password">
            Password
          </label>
          <div className="password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="login-input login-input-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="login-feedback" aria-live="polite">
          {error ? <p className="login-message login-message-error">{error}</p> : null}
          {success ? <p className="login-message login-message-success">{success}</p> : null}
        </div>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Processing...' : submitText}
        </button>
      </div>
    </form>
  )
}

export default LoginForm

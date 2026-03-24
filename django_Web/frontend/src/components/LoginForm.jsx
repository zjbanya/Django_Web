import { useState } from 'react'
import { loginUser } from '../services/auth'

/**
 * Reusable login form component.
 * Handles input state, simple validation, API call, and feedback UI.
 */
function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Validates form fields before sending request to backend.
  const validateInputs = () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.')
      setSuccess('')
      return false
    }
    return true
  }

  // Handles login button click and calls the backend API.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateInputs()) return

    try {
      setLoading(true)
      const result = await loginUser({ username, password })
      setSuccess(result.message || 'Login successful.')
    } catch (err) {
      setError(err.message || 'Unable to login right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-content">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in with your account details</p>

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
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

        <div className="login-feedback" aria-live="polite">
          {error ? <p className="login-message login-message-error">{error}</p> : null}
          {success ? <p className="login-message login-message-success">{success}</p> : null}
        </div>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </div>
    </form>
  )
}

export default LoginForm

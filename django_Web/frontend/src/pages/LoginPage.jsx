import LoginForm from '../components/LoginForm'
import '../styles/login.css'

/**
 * Page-level component for the login screen.
 * Keeps layout concerns separate from form behavior.
 */
function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login form">
        <LoginForm />
      </section>
    </main>
  )
}

export default LoginPage

import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { isAuthenticated } from './utils/auth'

/** Renders children only when a JWT access token exists (login succeeded). */
function RequireAuth({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

/** Sends logged-in users away from the login screen. */
function LoginRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return <LoginPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

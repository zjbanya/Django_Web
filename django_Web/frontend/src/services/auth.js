/**
 * Sends login credentials to the Django backend.
 * The backend endpoint is expected at /api/login.
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{message?: string, user?: unknown}>}
 */
export async function loginUser(credentials) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    // Keep a safe fallback when backend does not return JSON.
    data = {}
  }

  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.')
  }

  return data
}

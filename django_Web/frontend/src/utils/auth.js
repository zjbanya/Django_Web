/** Keys used for JWT + session hints in localStorage (dev). */
const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const USERNAME_KEY = 'username'

export function setAuthTokens(access, refresh, username) {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
  if (username) localStorage.setItem(USERNAME_KEY, username)
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function isAuthenticated() {
  return Boolean(getAccessToken())
}

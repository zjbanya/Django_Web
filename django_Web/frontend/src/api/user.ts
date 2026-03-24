import axios from 'axios'

/**
 * Request params for login.
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * Request params for register.
 */
export interface RegisterParams {
  username: string
  password: string
  email: string
}

/**
 * Get user list.
 * GET /api/users/
 * Returns response.data.data
 */
export async function getUserList(): Promise<any> {
  const response = await axios.get('/api/users/')
  return response.data?.data
}

/**
 * Login.
 * POST /api/login/
 * Body: { username, password }
 * Returns token from response.
 */
export async function login(params: LoginParams): Promise<any> {
  const response = await axios.post('/api/login/', params)
  return response.data?.token
}

/**
 * Register.
 * POST /api/register/
 * Body: { username, password, email }
 */
export async function register(params: RegisterParams): Promise<any> {
  const response = await axios.post('/api/register/', params)
  return response.data
}

/**
 * Unified API export.
 */
const userApi = {
  getUserList,
  login,
  register,
}

export default userApi

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

export interface LoginResponse {
  access: string
  refresh: string
  username: string
}

export interface RegisterResponse {
  message: string
  username: string
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
export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await axios.post('/api/login/', params)
  return response.data
}


/**
 *  还未使用的登出api
 * 
 */
export async function apiLogout(refreshToken: string) {
  await axios.post('/api/logout/', { refresh: refreshToken });
}


/**
 * Register.
 * POST /api/register/
 * Body: { username, password, email }
 */
export async function register(params: RegisterParams): Promise<RegisterResponse> {
  const response = await axios.post('/api/register/', params)
  return response.data as RegisterResponse
}

/**
 * 获取博客文章列表（占位：你需要后端真正实现后再对齐返回结构）
 * 建议后端路径：GET /api/posts/
 */
export async function getPosts(): Promise<any> {
  const response = await axios.get('/api/posts/')
  return response.data?.data ?? response.data
}

/**
 * 获取博客文章详情（占位）
 * 建议后端路径：GET /api/posts/:slug/
 */
export async function getPostDetail(slug: string): Promise<any> {
  const response = await axios.get(`/api/posts/${slug}/`)
  return response.data?.data ?? response.data
}

/**
 * Unified API export.
 */
const userApi = {
  getUserList,
  login,
  register,
  getPosts,
  getPostDetail,
}

export default userApi

import { apiClient } from './config'

// 用户信息类型
export interface UserInfo {
  id: number
  name: string
  avatar: string
  phone: string
  email?: string
  memberLevel: string
}

// 登录参数
export interface LoginParams {
  phone: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: UserInfo
}

// 注册参数
export interface RegisterParams {
  name: string
  phone: string
  password: string
  email?: string
}

// 登录
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/auth/login', params)
    // 保存token到本地存储
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
    }
    return response.data
  } catch {
    throw new Error('登录失败')
  }
}

// 注册
export const register = async (params: RegisterParams): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/auth/register', params)
    // 保存token到本地存储
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
    }
    return response.data
  } catch {
    throw new Error('注册失败')
  }
}

// 获取当前用户信息
export const getCurrentUser = async (): Promise<UserInfo> => {
  try {
    const response = await apiClient.get('/users/me')
    return response.data
  } catch {
    throw new Error('获取用户信息失败')
  }
}

// 更新用户信息
export const updateUserProfile = async (userData: Partial<UserInfo>): Promise<UserInfo> => {
  try {
    const response = await apiClient.put('/users/me', userData)
    // 更新本地存储的用户信息
    localStorage.setItem('user_info', JSON.stringify(response.data))
    return response.data
  } catch {
    throw new Error('更新用户信息失败')
  }
}

// 添加收藏
export const addFavorite = async (id: number, type: 'chef' | 'menu') => {
  try {
    const response = await apiClient.post(`/users/me/favorites/${id}`, { type })
    return response.data
  } catch {
    throw new Error('添加收藏失败')
  }
}

// 取消收藏
export const removeFavorite = async (id: number, type: 'chef' | 'menu') => {
  try {
    const response = await apiClient.delete(`/users/me/favorites/${id}`, { data: { type } })
    return response.data
  } catch {
    throw new Error('取消收藏失败')
  }
}

// 登出
export const logout = () => {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_info')
}

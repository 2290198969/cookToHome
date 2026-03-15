import { apiClient } from './config'

// 厨师类型定义
export interface Chef {
  id: number
  name: string
  rating: number
  reviews: number
  specialties: string[]
  experience: string
  bio: string
  price: number
  image: string
  isFavorite: boolean
}

// 厨师详情类型
export interface ChefDetail extends Chef {
  services: string[]
  menus: {
    id: number
    name: string
    description: string
    price: number
    image: string
  }[]
  ratings: {
    user: string
    rating: number
    comment: string
    date: string
  }[]
}

// 获取厨师列表
export const fetchChefs = async (params: { cuisine?: string; sort?: string; search?: string }) => {
  try {
    const response = await apiClient.get('/chefs', { params })
    return response.data
  } catch {
    throw new Error('获取厨师列表失败')
  }
}

// 获取厨师详情
export const fetchChefDetails = async (chefId: number) => {
  try {
    const response = await apiClient.get(`/chefs/${chefId}`)
    return response.data
  } catch {
    throw new Error('获取厨师详情失败')
  }
}

// 添加厨师评价
export const addChefRating = async (chefId: number, rating: number, comment: string) => {
  try {
    const response = await apiClient.post(`/chefs/${chefId}/ratings`, {
      rating,
      comment,
    })
    return response.data
  } catch {
    throw new Error('添加评价失败')
  }
}

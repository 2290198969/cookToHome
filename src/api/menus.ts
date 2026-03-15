import { apiClient } from './config'

// 菜单类型定义
export interface Menu {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  chefName: string
  chefImage: string
  cuisine: string
  isFavorite: boolean
}

// 菜单详情类型
export interface MenuDetail extends Menu {
  description: string
  chefId: number
  chefRating: number
  chefExperience: string
  ingredients: string[]
  steps: string[]
  ratings: {
    userId: number
    username: string
    rating: number
    comment: string
    date: string
  }[]
}

// 获取所有菜单
export const fetchAllMenus = async (params?: {
  cuisine?: string
  priceRange?: string
  sort?: string
  search?: string
}) => {
  try {
    const response = await apiClient.get('/menus', { params })
    return response.data
  } catch {
    throw new Error('获取菜单列表失败')
  }
}

// 获取菜单详情
export const fetchMenuDetails = async (menuId: number) => {
  try {
    const response = await apiClient.get(`/menus/${menuId}`)
    return response.data
  } catch {
    throw new Error('获取菜单详情失败')
  }
}

// 添加菜单评价
export const addMenuRating = async (menuId: number, rating: number, comment: string) => {
  try {
    const response = await apiClient.post(`/menus/${menuId}/ratings`, {
      rating,
      comment,
    })
    return response.data
  } catch {
    throw new Error('添加评价失败')
  }
}

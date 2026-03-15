import { apiClient } from './config'

// 定义订单状态类型
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

// 定义地址类型
export interface Address {
  recipient: string
  phone: string
  address: string
  city: string
  zipCode: string
}

// 定义订单类型
export interface Order {
  id: number
  orderNumber: string
  chefId: number
  chefName: string
  chefImage: string
  chefRating?: number
  menuId: number
  menuName: string
  menuImage: string
  date: string
  time: string
  guests: number
  price: number
  status: OrderStatus
  specialRequests: string
  notes: string
  createdAt: string
  paymentStatus: 'unpaid' | 'paid'
  paymentMethod: string
  address: Address
}

// 订单创建参数类型
export interface CreateOrderParams {
  chefId: number
  menuId: number
  date: string
  time: string
  guests: number
  specialRequests?: string
  notes?: string
  address: Address
}

// 获取用户订单列表
export const fetchUserOrders = async (params?: {
  status?: OrderStatus
  page?: number
  limit?: number
}) => {
  try {
    const response = await apiClient.get('/orders', { params })
    return response.data
  } catch {
    throw new Error('获取订单列表失败')
  }
}

// 获取订单详情
export const fetchOrderDetail = async (id: number) => {
  try {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  } catch {
    throw new Error('获取订单详情失败')
  }
}

// 取消订单
export const cancelOrder = async (id: number) => {
  try {
    const response = await apiClient.put(`/orders/${id}/cancel`)
    return response.data
  } catch {
    throw new Error('取消订单失败')
  }
}

// 创建订单
export const createOrder = async (params: CreateOrderParams) => {
  try {
    const response = await apiClient.post('/orders', params)
    return response.data
  } catch {
    throw new Error('创建订单失败')
  }
}

// 更新订单支付状态
export const updateOrderPayment = async (
  id: number,
  paymentStatus: 'paid',
  paymentMethod: string,
) => {
  try {
    const response = await apiClient.put(`/orders/${id}/payment`, {
      paymentStatus,
      paymentMethod,
    })
    return response.data
  } catch {
    throw new Error('更新支付状态失败')
  }
}

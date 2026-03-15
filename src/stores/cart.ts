import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 购物车商品类型定义
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  chefId: number // 所属厨师ID
}

export const useCartStore = defineStore('cart', () => {
  // 从本地存储加载购物车数据
  const cartItems = ref<CartItem[]>(JSON.parse(localStorage.getItem('cartItems') || '[]'))

  // 监听购物车变化并保存到本地存储
  watch(
    cartItems,
    (newVal) => {
      localStorage.setItem('cartItems', JSON.stringify(newVal))
    },
    { deep: true },
  )

  // 添加商品到购物车
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    return new Promise<void>((resolve) => {
      const existingItem = cartItems.value.find(
        (cartItem) => cartItem.id === item.id && cartItem.chefId === item.chefId,
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cartItems.value.push({
          ...item,
          quantity: 1,
        })
      }

      resolve()
    })
  }

  // 从购物车移除商品
  const removeFromCart = (itemId: number, chefId: number) => {
    cartItems.value = cartItems.value.filter(
      (item) => !(item.id === itemId && item.chefId === chefId),
    )
  }

  // 更新商品数量
  const updateQuantity = (itemId: number, chefId: number, quantity: number) => {
    const item = cartItems.value.find((item) => item.id === itemId && item.chefId === chefId)

    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId, chefId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // 清空购物车
  const clearCart = () => {
    cartItems.value = []
  }

  // 计算购物车商品总数
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 计算购物车总价
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
})

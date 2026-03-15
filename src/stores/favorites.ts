import { ref, watch } from 'vue'

// 定义收藏项类型
export interface FavoriteItem {
  id: number
  type: 'dish' | 'chef' | 'store'
  name: string
  image: string
  price?: number
  rating?: number
}

export const useFavoritesStore = () => {
  // 从本地存储加载收藏
  const favorites = ref<FavoriteItem[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))

  // 监听变化并保存到本地存储
  watch(
    favorites,
    (newVal) => {
      localStorage.setItem('favorites', JSON.stringify(newVal))
    },
    { deep: true },
  )

  // 添加到收藏
  const addToFavorites = (item: FavoriteItem) => {
    // 检查是否已收藏
    const existingIndex = favorites.value.findIndex((f) => f.id === item.id && f.type === item.type)

    if (existingIndex > -1) {
      // 已存在则移除（取消收藏）
      favorites.value.splice(existingIndex, 1)
      return false // 表示已取消收藏
    } else {
      // 新收藏
      favorites.value.push(item)
      return true // 表示已添加收藏
    }
  }

  // 检查是否为收藏
  const isFavorite = (id: number, type: 'dish' | 'chef' | 'store') => {
    return favorites.value.some((f) => f.id === id && f.type === type)
  }

  // 获取特定类型的收藏
  const getFavoritesByType = (type: 'dish' | 'chef' | 'store') => {
    return favorites.value.filter((f) => f.type === type)
  }

  // 清空收藏
  const clearFavorites = () => {
    favorites.value = []
  }

  return {
    favorites,
    addToFavorites,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
  }
}

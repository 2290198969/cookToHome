<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 顶部导航 -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4">
      <div class="flex justify-between items-center">
        <button @click="router.back()" class="p-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">我的收藏</h1>
        <button @click="clearAllFavorites" class="text-sm hover:text-indigo-100 transition-colors"
          v-if="favorites.length > 0">
          清空全部
        </button>
        <div v-else class="w-6"></div> <!-- 占位元素，保持布局一致 -->
      </div>
    </div>

    <!-- 收藏分类标签 -->
    <div class="bg-white border-b border-gray-100">
      <div class="flex">
        <button v-for="tab in tabs" :key="tab.type" @click="activeTab = tab.type"
          class="flex-1 py-3 text-sm font-medium"
          :class="activeTab === tab.type ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'">
          {{ tab.name }}
          <span class="ml-1 bg-gray-100 text-gray-700 rounded-full px-1.5 text-xs" v-if="getCountByType(tab.type) > 0">
            {{ getCountByType(tab.type) }}
          </span>
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFavorites.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
      <svg class="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <p class="text-gray-500">暂无收藏内容</p>
      <button @click="router.push('/')" class="mt-4 text-indigo-600 text-sm">去首页看看</button>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="p-4">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="item in filteredFavorites" :key="`${item.type}-${item.id}`"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
          @click="navigateToDetail(item)">
          <div class="relative">
            <img :src="item.image" :alt="item.name" class="w-full h-32 object-cover">
            <button @click.stop="removeFavorite(item)"
              class="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm hover:bg-white transition-colors"
              aria-label="取消收藏">
              <svg class="h-4 w-4 text-red-500 fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-2">
            <h3 class="font-medium text-gray-900 text-sm line-clamp-1">{{ item.name }}</h3>
            <div class="flex items-center mt-1">
              <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1 text-xs text-gray-600">{{ item.rating }}</span>
            </div>
            <div v-if="item.price" class="mt-1">
              <span class="text-sm font-bold text-indigo-600">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNav />

    <!-- 提示框 -->
    <div v-if="toastMessage"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-out">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import type { FavoriteItem } from '@/stores/favorites' // Changed to type-only import
import BottomNav from '@/components/BottomNav.vue'

// Define tab types as a union
type TabType = 'all' | 'dish' | 'chef' | 'store'

const router = useRouter()
const { favorites, addToFavorites, clearFavorites } = useFavoritesStore()

// State management with explicit TabType
const activeTab = ref<TabType>('all')
const toastMessage = ref('')

// Update tabs definition with proper typing
const tabs = [
  { type: 'all', name: '全部' },
  { type: 'dish', name: '菜品' },
  { type: 'chef', name: '厨师' },
  { type: 'store', name: '商家' }
] as const // 'as const' makes the types literal

// Update the filteredFavorites computed property
const filteredFavorites = computed<FavoriteItem[]>(() => {
  if (activeTab.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === activeTab.value)
})

// Update getCountByType parameter type
const getCountByType = (type: TabType) => {
  if (type === 'all') {
    return favorites.value.length
  }
  return favorites.value.filter(item => item.type === type).length
}

// The rest of your methods remain the same
const navigateToDetail = (item: FavoriteItem) => {
  switch (item.type) {
    case 'chef':
      router.push(`/chef/${item.id}`)
      break
    case 'dish':
      router.push(`/dish/${item.id}`)
      break
    case 'store':
      router.push(`/store/${item.id}`)
      break
  }
}

const removeFavorite = (item: FavoriteItem) => {
  addToFavorites(item)
  showToast('已取消收藏')
}

const clearAllFavorites = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    clearFavorites()
    showToast('已清空所有收藏')
  }
}

const showToast = (message: string) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}
</script>

<style scoped>
/* 提示框动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }

  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
}

.animate-fade-in-out {
  animation: fadeInOut 2s ease-in-out forwards;
}
</style>

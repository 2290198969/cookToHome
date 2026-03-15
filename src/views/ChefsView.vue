<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'  // 移除未使用的computed
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

// 定义类型接口，替代any类型
interface Chef {
  id: number;
  name: string;
  image: string;
  rating: number;
  experience: string;
  reviews: number;
  specialties: string[];
  bio: string;
  price: number;
  distance?: string;
}

interface Cuisine {
  id: string;
  name: string;
}

interface SortOption {
  id: string;
  name: string;
}

const router = useRouter()

// 厨师列表数据
const allChefs = ref<Chef[]>([])  // 使用Chef接口
const chefs = ref<Chef[]>([])     // 使用Chef接口
const isLoading = ref(true)
const error = ref('')
const searchQuery = ref('')
const selectedCuisine = ref('all')
const sortOption = ref('rating')

// 菜系选项 - 使用Cuisine接口
const cuisines = ref<Cuisine[]>([
  { id: 'all', name: '全部' },
  { id: 'chinese', name: '中餐' },
  { id: 'western', name: '西餐' },
  { id: 'japanese', name: '日料' },
  { id: 'korean', name: '韩餐' }
])

// 排序选项 - 使用SortOption接口
const sortOptions = ref<SortOption[]>([
  { id: 'rating', name: '综合排序' },
  { id: 'price_asc', name: '价格最低' },
  { id: 'price_desc', name: '价格最高' }
])

// 模拟API调用获取厨师列表
const fetchChefs = async () => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  // 模拟返回的厨师数据
  return [
    {
      id: 1,
      name: '王大厨',
      image: 'https://picsum.photos/id/1005/200/200',
      rating: 4.8,
      experience: '10年',
      reviews: 256,
      specialties: ['川菜', '湘菜'],
      bio: '擅长川湘菜系，曾在五星级酒店担任主厨',
      price: 388,
      distance: '1.2km'
    },
    {
      id: 2,
      name: '李师傅',
      image: 'https://picsum.photos/id/1012/200/200',
      rating: 4.9,
      experience: '15年',
      reviews: 189,
      specialties: ['法餐', '意大利菜'],
      bio: '法国蓝带厨艺学院毕业，专注西餐20年',
      price: 588,
      distance: '2.5km'
    },
    {
      id: 3,
      name: '张师傅',
      image: 'https://picsum.photos/id/1025/200/200',
      rating: 4.7,
      experience: '8年',
      reviews: 312,
      specialties: ['日料', '寿司'],
      bio: '曾在日本进修3年，精通各类日式料理',
      price: 428,
      distance: '0.8km'
    }
  ] as Chef[]
}

// 获取厨师列表
const fetchChefList = async () => {
  isLoading.value = true
  try {
    // 获取所有厨师数据
    const data = await fetchChefs()
    allChefs.value = data
    // 触发筛选和排序
    filterAndSortChefs()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取厨师列表失败'
  } finally {
    isLoading.value = false
  }
}

// 筛选和排序厨师数据
const filterAndSortChefs = () => {
  let filtered = [...allChefs.value]

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chef =>
      chef.name.toLowerCase().includes(query) ||
      chef.specialties.some(s => s.toLowerCase().includes(query)) ||
      chef.bio.toLowerCase().includes(query)
    )
  }

  // 菜系筛选
  if (selectedCuisine.value !== 'all') {
    // 根据菜系ID映射到实际菜系名称进行筛选
    const cuisineMap: Record<string, string[]> = {
      chinese: ['川菜', '湘菜', '粤菜', '点心'],
      western: ['法餐', '意大利菜'],
      japanese: ['日料', '寿司'],
      korean: ['韩餐']
    }

    const targetCuisines = cuisineMap[selectedCuisine.value] || []
    filtered = filtered.filter(chef =>
      chef.specialties.some(s => targetCuisines.includes(s))
    )
  }

  // 排序
  switch (sortOption.value) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
    default:
      // 综合排序：先按评分，再按评价数量
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.reviews - a.reviews
      })
      break
  }

  chefs.value = filtered
}

// 监听搜索、筛选和排序条件变化，自动更新列表
watch([searchQuery, selectedCuisine, sortOption], filterAndSortChefs)

// 导航到厨师详情
const navigateToChefDetail = (chefId: number) => {
  router.push(`/chefs/${chefId}`)
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedCuisine.value = 'all'
  sortOption.value = 'rating'
}

onMounted(() => {
  fetchChefList()
})
</script>

<template>
  <div class="bg-gray-50 pb-16 min-h-screen">
    <!-- 搜索栏 -->
    <div class="px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
      <div class="relative">
        <input type="text" v-model="searchQuery" placeholder="搜索菜品、厨师或食材" @keyup.enter="handleSearch"
          class="w-full py-3 px-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button v-if="searchQuery" @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>


    <!-- 筛选栏 -->
    <div class="sticky top-12 bg-white z-10 px-3 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto">
      <select v-model="selectedCuisine"
        class="flex-shrink-0 py-2 px-3 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
        <option v-for="cuisine in cuisines" :key="cuisine.id" :value="cuisine.id">{{ cuisine.name }}</option>
      </select>

      <select v-model="sortOption"
        class="flex-shrink-0 py-2 px-4 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
        <option v-for="option in sortOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
      </select>

      <button @click="resetFilters"
        class="flex-shrink-0 py-2 px-3 bg-gray-100 rounded-lg text-xs text-gray-600 transition-colors">
        重置
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      <p class="mt-2 text-sm text-gray-500">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-10 px-4">
      <svg class="h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-sm font-medium text-gray-900 mb-1 text-center">{{ error }}</h3>
      <button @click="fetchChefList"
        class="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors">
        重新加载
      </button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="chefs.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
      <svg class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-sm font-medium text-gray-900 mb-1 text-center">未找到厨师</h3>
      <button @click="resetFilters"
        class="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors">
        重置筛选
      </button>
    </div>

    <!-- 厨师列表 -->
    <div v-else class="px-3 py-2 space-y-3">
      <div v-for="chef in chefs" :key="chef.id"
        class="bg-white rounded-lg shadow-sm p-2 flex hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToChefDetail(chef.id)">
        <!-- 左侧厨师头像 -->
        <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
          <img :src="chef.image" :alt="chef.name" class="w-full h-full object-cover">
        </div>

        <!-- 右侧内容 -->
        <div class="ml-2 flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-bold text-gray-900 truncate">{{ chef.name }}</h3>
            <div class="flex items-center">
              <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs text-gray-700 ml-0.5">{{ chef.rating }}</span>
            </div>
          </div>

          <div class="flex items-center mt-0.5">
            <span class="text-xs text-gray-500">{{ chef.experience }}经验</span>
            <span class="mx-1 text-gray-300">|</span>
            <span class="text-xs text-gray-500">{{ chef.reviews }}次服务</span>
          </div>

          <div class="mt-1 flex flex-wrap gap-1">
            <span v-for="(specialty, index) in chef.specialties.slice(0, 2)" :key="index"
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {{ specialty }}
            </span>
          </div>

          <div class="mt-1">
            <p class="text-xs text-gray-600 truncate">{{ chef.bio }}</p>
          </div>

          <div class="mt-1 flex justify-between items-center">
            <span class="text-sm font-bold text-indigo-600">¥{{ chef.price }}/次</span>
            <span class="text-xs text-gray-400">{{ chef.distance || '1km内' }}</span>
          </div>
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<style scoped>
/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

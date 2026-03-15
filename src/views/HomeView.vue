<template>
  <div class="pb-20 min-h-screen bg-gray-50">
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

    <!-- 活跃筛选条件 -->
    <div v-if="activeFilters.length > 0" class="px-4 py-2 bg-white border-t border-gray-100">
      <div class="flex flex-wrap gap-2">
        <div v-for="filter in activeFilters" :key="filter.id"
          class="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center">
          <span>{{ filter.name }}</span>
          <button @click="removeFilter(filter.id)" class="ml-1 text-indigo-600 hover:text-indigo-900">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button @click="clearAllFilters" class="text-gray-500 text-xs hover:text-gray-700 flex items-center">
          <span>清除全部</span>
        </button>
      </div>
    </div>

    <!-- 分类区域 -->
    <section class="px-4 py-3 bg-white border-t border-gray-100">
      <div class="flex overflow-x-auto space-x-6 pb-2 scrollbar-hide">
        <div v-for="category in categories" :key="category.id"
          class="flex flex-col items-center flex-shrink-0 cursor-pointer" @click="toggleCategory(category.id)">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 transition-all duration-300"
            :class="category.active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'">
            {{ category.icon }}
          </div>
          <span class="text-xs">{{ category.name }}</span>
        </div>
      </div>
    </section>

    <!-- 热门厨师 -->
    <section class="px-4 py-3 bg-gray-50">
      <h2 class="text-lg font-bold text-gray-900 mb-3">热门厨师</h2>
      <div class="space-y-3">
        <div v-for="chef in filteredChefs" :key="chef.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden flex cursor-pointer" @click="viewChefDetail(chef.id)">
          <img :src="chef.image" :alt="chef.name" class="w-24 h-24 object-cover">
          <div class="flex-1 p-3">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-bold text-gray-900">{{ chef.name }}</h3>
              <button @click="toggleFavorite('chef', chef.id, $event)" class="text-gray-400 hover:text-red-500"
                aria-label="收藏厨师">
                <svg class="h-5 w-5" :class="chef.isFavorite ? 'text-red-500 fill-current' : ''" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="flex items-center mt-1">
              <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs text-gray-700 ml-1">{{ chef.rating }}</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="(specialty, index) in chef.specialties" :key="index"
                class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {{ specialty }}
              </span>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-500">
              <span>{{ chef.experience }}经验</span>
              <span>¥{{ chef.price }}/次起</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐菜品 -->
    <section class="px-4 py-3">
      <h2 class="text-lg font-bold text-gray-900 mb-3">推荐菜品</h2>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <!-- 无结果状态 -->
      <div v-else-if="filteredDishes.length === 0" class="text-center py-10 bg-white rounded-lg">
        <svg class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-500 mb-4">没有找到匹配的菜品</p>
        <button @click="clearAllFilters"
          class="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition-colors">
          清除筛选条件
        </button>
      </div>

      <!-- 菜品列表 -->
      <div v-else class="grid grid-cols-2 gap-3">
        <MenuCard v-for="dish in filteredDishes" :key="dish.id" :menu="dish" @click="viewDishDetail(dish.id)"
          @toggleFavorite="toggleFavorite('dish', $event)" />
      </div>
    </section>

    <!-- 回到顶部按钮 -->
    <button v-if="showScrollTop" @click="scrollToTop"
      class="fixed bottom-24 right-4 bg-indigo-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 z-10"
      aria-label="回到顶部">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import MenuCard from '@/components/HomeMenuCard.vue'

// 定义类型接口
interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  chefName: string;
  chefImage: string;
  cuisine: string;
  isFavorite: boolean;
  ingredients: string[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}

interface Chef {
  id: number;
  name: string;
  image: string;
  rating: number;
  experience: string;
  specialties: string[];
  price: number;
  isFavorite: boolean;
}

const router = useRouter()

// 状态管理
const searchQuery = ref('')
const isLoading = ref(false)
const showScrollTop = ref(false)

// 推荐菜品数据
const recommendedDishes = ref<Dish[]>([
  {
    id: 1,
    name: '川味水煮鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979',
    rating: 4.8,
    reviews: 256,
    chefName: '王大厨',
    chefImage: 'https://picsum.photos/id/1005/200/200',
    cuisine: '川菜',
    isFavorite: false,
    ingredients: ['草鱼', '豆芽', '辣椒']
  },
  {
    id: 2,
    name: '法式牛排',
    price: 198,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143',
    rating: 4.9,
    reviews: 189,
    chefName: '李师傅',
    chefImage: 'https://picsum.photos/id/1012/200/200',
    cuisine: '西餐',
    isFavorite: true,
    ingredients: ['牛肉', '黑胡椒', '迷迭香']
  },
  {
    id: 3,
    name: '日式寿司拼盘',
    price: 158,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    rating: 4.7,
    reviews: 312,
    chefName: '张师傅',
    chefImage: 'https://picsum.photos/id/1025/200/200',
    cuisine: '日料',
    isFavorite: false,
    ingredients: ['三文鱼', '金枪鱼', '米饭']
  },
  {
    id: 4,
    name: '意大利面',
    price: 88,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
    rating: 4.6,
    reviews: 421,
    chefName: '刘师傅',
    chefImage: 'https://picsum.photos/id/1074/200/200',
    cuisine: '西餐',
    isFavorite: false,
    ingredients: ['面条', '番茄酱', '肉末']
  },
  {
    id: 5,
    name: '北京烤鸭',
    price: 168,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
    rating: 4.9,
    reviews: 512,
    chefName: '赵师傅',
    chefImage: 'https://picsum.photos/id/1062/200/200',
    cuisine: '京菜',
    isFavorite: true,
    ingredients: ['鸭肉', '薄饼', '葱丝']
  },
  {
    id: 6,
    name: '泰国冬阴功汤',
    price: 78,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    rating: 4.5,
    reviews: 187,
    chefName: '陈师傅',
    chefImage: 'https://picsum.photos/id/1066/200/200',
    cuisine: '东南亚',
    isFavorite: false,
    ingredients: ['虾', '香茅', '柠檬叶']
  }
])

// 分类数据 - 增加更多分类
const categories = ref<Category[]>([
  { id: 1, name: '川菜', icon: '🌶️', active: false },
  { id: 2, name: '粤菜', icon: '🍤', active: false },
  { id: 3, name: '湘菜', icon: '🔥', active: false },
  { id: 4, name: '鲁菜', icon: '🍲', active: false },
  { id: 5, name: '西餐', icon: '🍝', active: false },
  { id: 6, name: '日料', icon: '🍣', active: false },
  { id: 7, name: '韩餐', icon: '🥘', active: false },
  { id: 8, name: '东南亚', icon: '🌴', active: false },
  { id: 9, name: '甜点', icon: '🍰', active: false },
  { id: 10, name: '饮品', icon: '🥤', active: false },
  { id: 11, name: '素食', icon: '🥗', active: false },
  { id: 12, name: '快餐', icon: '🍟', active: false }
])

// 热门厨师数据
const popularChefs = ref<Chef[]>([
  {
    id: 1,
    name: '王大厨',
    image: 'https://picsum.photos/id/1005/200/200',
    rating: 4.8,
    experience: '10年',
    specialties: ['川菜', '湘菜', '家常菜'],
    price: 388,
    isFavorite: false
  },
  {
    id: 2,
    name: '李师傅',
    image: 'https://picsum.photos/id/1012/200/200',
    rating: 4.9,
    experience: '15年',
    specialties: ['法餐', '意大利菜'],
    price: 588,
    isFavorite: false
  },
  {
    id: 3,
    name: '张师傅',
    image: 'https://picsum.photos/id/1025/200/200',
    rating: 4.7,
    experience: '8年',
    specialties: ['日料', '寿司'],
    price: 428,
    isFavorite: true
  }
])

// 获取活跃的筛选条件
const activeFilters = computed(() => {
  return categories.value.filter(cat => cat.active)
})

// 筛选菜品
const filteredDishes = computed(() => {
  let result = [...recommendedDishes.value]

  // 应用分类筛选
  const activeCats = activeFilters.value
  if (activeCats.length > 0) {
    const activeCatNames = activeCats.map(cat => cat.name)
    result = result.filter(dish => activeCatNames.includes(dish.cuisine))
  }

  // 应用搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(dish =>
      dish.name.toLowerCase().includes(query) ||
      dish.cuisine.toLowerCase().includes(query) ||
      dish.chefName.toLowerCase().includes(query) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(query))
    )
  }

  return result
})

// 筛选厨师
const filteredChefs = computed(() => {
  let result = [...popularChefs.value]

  // 应用分类筛选
  const activeCats = activeFilters.value
  if (activeCats.length > 0) {
    const activeCatNames = activeCats.map(cat => cat.name)
    result = result.filter(chef =>
      chef.specialties.some(specialty => activeCatNames.includes(specialty))
    )
  }

  // 应用搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(chef =>
      chef.name.toLowerCase().includes(query) ||
      chef.specialties.some(specialty => specialty.toLowerCase().includes(query))
    )
  }

  return result
})

// 切换分类
const toggleCategory = (categoryId: number) => {
  isLoading.value = true

  // 模拟加载延迟
  setTimeout(() => {
    categories.value = categories.value.map(cat => ({
      ...cat,
      active: cat.id === categoryId ? !cat.active : cat.active
    }))
    isLoading.value = false
  }, 300)
}

// 移除单个筛选条件
const removeFilter = (categoryId: number) => {
  isLoading.value = true

  setTimeout(() => {
    categories.value = categories.value.map(cat =>
      cat.id === categoryId ? { ...cat, active: false } : cat
    )
    isLoading.value = false
  }, 300)
}

// 清除所有筛选条件
const clearAllFilters = () => {
  isLoading.value = true

  setTimeout(() => {
    categories.value = categories.value.map(cat => ({ ...cat, active: false }))
    searchQuery.value = ''
    isLoading.value = false
  }, 300)
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    isLoading.value = true

    setTimeout(() => {
      // 滚动到菜品区域
      const dishSection = document.querySelector('section:nth-of-type(3)')
      if (dishSection) {
        dishSection.scrollIntoView({ behavior: 'smooth' })
      }
      isLoading.value = false
    }, 500)
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

// 查看菜品详情
const viewDishDetail = (dishId: number) => {
  router.push(`/dish/${dishId}`)
}

// 查看厨师详情
const viewChefDetail = (chefId: number) => {
  router.push(`/chef/${chefId}`)
}

// 切换收藏状态
const toggleFavorite = (type: 'dish' | 'chef', id: number, e?: Event) => {
  if (e) e.stopPropagation()

  if (type === 'dish') {
    const dish = recommendedDishes.value.find(d => d.id === id)
    if (dish) {
      dish.isFavorite = !dish.isFavorite
    }
  } else {
    const chef = popularChefs.value.find(c => c.id === id)
    if (chef) {
      chef.isFavorite = !chef.isFavorite
    }
  }
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件，控制回到顶部按钮显示
onMounted(() => {
  const handleScroll = () => {
    showScrollTop.value = window.scrollY > 300
  }

  window.addEventListener('scroll', handleScroll)

  // 清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})

// 监听筛选条件变化
watch(
  [() => activeFilters.value, () => searchQuery.value],
  () => {
    if (filteredDishes.value.length > 0 && isLoading.value === false) {
      const dishSection = document.querySelector('section:nth-of-type(3)')
      if (dishSection) {
        dishSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }
)
</script>

<style scoped>
/* 隐藏滚动条但保留功能 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
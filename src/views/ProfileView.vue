<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

// 类型定义
interface User {
  name: string
  avatar: string
  phone: string
  level: string
  points: number
}

interface OrderStat {
  status: string
  count: number
  icon: string
}

interface QuickAction {
  name: string
  icon: string
  route: string
}

interface RecentOrder {
  id: string
  chefName: string
  date: string
  status: '待付款' | '待服务' | '待评价' | '已完成' | '服务中'
  amount: number
  menu: string
  rating: number | null
}

const router = useRouter()

// 用户信息
const user = ref<User>({
  name: '张先生',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  phone: '138****1234',
  level: '黄金会员',
  points: 1280
})

// 订单状态
const orderStats = ref<OrderStat[]>([
  { status: '待付款', count: 1, icon: '🕒' },
  { status: '待服务', count: 2, icon: '👨‍🍳' },
  { status: '待评价', count: 3, icon: '⭐' },
  { status: '已完成', count: 12, icon: '✅' }
])

// 常用功能
const quickActions = ref<QuickAction[]>([
  { name: '我的收藏', icon: '❤️', route: '/favorites' },
  { name: '地址管理', icon: '🏠', route: '/addresses' },
  { name: '优惠券', icon: '🎫', route: '/coupons' },
  { name: '邀请好友', icon: '👥', route: '/invite' },
  { name: '帮助中心', icon: '❓', route: '/help' },
  { name: '设置', icon: '⚙️', route: '/settings' }
])

// 最近订单
const recentOrders = ref<RecentOrder[]>([
  {
    id: 'ORD20230615001',
    chefName: '李师傅',
    date: '2023-06-15',
    status: '已完成',
    amount: 399,
    menu: '法式浪漫双人餐',
    rating: 5
  },
  {
    id: 'ORD20230610002',
    chefName: '张师傅',
    date: '2023-06-10',
    status: '待评价',
    amount: 299,
    menu: '川菜家宴',
    rating: null
  },
  {
    id: 'ORD20230605003',
    chefName: '王师傅',
    date: '2023-06-05',
    status: '服务中',
    amount: 449,
    menu: '日式寿司套餐',
    rating: null
  }
])

// 计算属性 - 获取订单状态样式
const getStatusClass = computed(() => (status: RecentOrder['status']) => {
  const statusClasses: Record<RecentOrder['status'], string> = {
    '待付款': 'bg-blue-100 text-blue-800',
    '已完成': 'bg-green-100 text-green-800',
    '待评价': 'bg-amber-100 text-amber-800',
    '服务中': 'bg-gray-100 text-gray-800',
    '待服务': 'bg-purple-100 text-purple-800'
  }
  return statusClasses[status]
})

// 导航到订单详情
const navigateToOrderDetail = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

// 导航到编辑资料
const navigateToEditProfile = () => {
  router.push('/profile/edit')
}

// 导航到订单列表（带状态筛选）
const navigateToOrdersWithStatus = (index: number) => {
  router.push(`/orders?status=${index}`)
}

// 导航到功能页面
const navigateToAction = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">

    <div class="pt-16">
      <!-- 用户信息卡片 -->
      <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <img :src="user.avatar" alt="用户头像" class="w-16 h-16 rounded-full border-2 border-white/50 object-cover"
              loading="lazy">
            <div class="ml-4">
              <h1 class="text-xl font-bold">{{ user.name }}</h1>
              <p class="text-sm opacity-90">{{ user.phone }}</p>
            </div>
          </div>
          <button @click="navigateToEditProfile"
            class="text-xs bg-white/20 px-3 py-1 rounded-full flex items-center transition-all hover:bg-white/30">
            编辑资料
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
          <div class="text-center">
            <div class="text-xs opacity-80">会员等级</div>
            <div class="font-bold text-sm mt-1">{{ user.level }}</div>
          </div>
          <div class="h-8 w-px bg-white/30"></div>
          <div class="text-center">
            <div class="text-xs opacity-80">积分</div>
            <div class="font-bold text-sm mt-1">{{ user.points }}</div>
          </div>
          <div class="h-8 w-px bg-white/30"></div>
          <div class="text-center">
            <div class="text-xs opacity-80">优惠券</div>
            <div class="font-bold text-sm mt-1">3张</div>
          </div>
        </div>
      </section>

      <!-- 订单状态 -->
      <section class="bg-white px-5 py-4 mt-4 shadow-sm">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-base font-bold text-gray-900">我的订单</h2>
          <button @click="router.push('/orders')"
            class="text-xs text-gray-500 flex items-center hover:text-indigo-600 transition-colors">
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <div v-for="(stat, index) in orderStats" :key="index"
            class="flex flex-col items-center py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            @click="navigateToOrdersWithStatus(index)">
            <div class="text-2xl mb-1">{{ stat.icon }}</div>
            <div class="text-xs text-gray-900">{{ stat.status }}</div>
            <div v-if="stat.count > 0"
              class="mt-1 text-xs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              {{ stat.count }}
            </div>
          </div>
        </div>
      </section>

      <!-- 常用功能 -->
      <section class="bg-white px-5 py-4 mt-4 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-3">常用功能</h2>

        <div class="grid grid-cols-4 gap-4">
          <div v-for="action in quickActions" :key="action.name"
            class="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            @click="navigateToAction(action.route)">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-1">
              {{ action.icon }}
            </div>
            <div class="text-xs text-gray-900 text-center">{{ action.name }}</div>
          </div>
        </div>
      </section>

      <!-- 最近订单 -->
      <section class="bg-white px-5 py-4 mt-4 shadow-sm">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-base font-bold text-gray-900">最近订单</h2>
          <button @click="router.push('/orders')"
            class="text-xs text-gray-500 flex items-center hover:text-indigo-600 transition-colors">
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id"
            class="border border-gray-100 rounded-lg p-3 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50 transition-all"
            @click="navigateToOrderDetail(order.id)">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-bold text-gray-900">{{ order.menu }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ order.chefName }} · {{ order.date }}</p>
              </div>
              <span class="text-sm font-bold text-indigo-600">¥{{ order.amount }}</span>
            </div>

            <div class="flex justify-between items-center mt-3">
              <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>

              <button v-if="order.rating" class="flex items-center text-xs text-gray-500">
                <svg class="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                已评价
              </button>

              <button v-else-if="order.status === '待评价'" @click.stop="router.push(`/orders/${order.id}/review`)"
                class="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors">
                去评价
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 客服入口 -->
      <section class="bg-white px-5 py-4 mt-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">联系客服</h3>
              <p class="text-xs text-gray-500">9:00-21:00 在线服务</p>
            </div>
          </div>
          <button
            class="text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full flex items-center hover:bg-gray-200 transition-colors">
            联系客服
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
/* 自定义渐变色 */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-indigo-600 {
  --tw-gradient-from: #4f46e5;
  --tw-gradient-to: rgba(79, 70, 229, 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-purple-600 {
  --tw-gradient-to: #7c3aed;
}
</style>
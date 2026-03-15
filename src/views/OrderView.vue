<script setup lang="ts">
import { useRouter } from 'vue-router'
import { fetchUserOrders, cancelOrder as apiCancelOrder } from '@/api/orders'
import { showToast } from '@/utils/toast'
import { ref, onMounted, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 定义订单状态类型
type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'completed' | 'canceled'

// 定义订单类型
interface Order {
  id: number
  orderNumber: string
  chefId: number
  chefName: string
  chefImage: string
  menuName: string
  menuImage: string
  date: string
  time: string
  guests: number
  price: number
  status: OrderStatus
  specialRequests: string
  createdAt: string
  address: string
}

const router = useRouter()
const orders = ref<Order[]>([])
const isLoading = ref(true)
const error = ref('')
const selectedStatus = ref('all')

// 获取用户订单
const fetchOrders = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const data = await fetchUserOrders()
    orders.value = data
  } catch (err: any) {
    error.value = err.message || '获取订单列表失败'
  } finally {
    isLoading.value = false
  }
}

// 过滤订单
const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === selectedStatus.value)
})

// 取消订单
const handleCancelOrder = async (orderId: number, event: Event) => {
  event.stopPropagation()
  if (confirm('确定要取消该订单吗？')) {
    try {
      await apiCancelOrder(orderId)
      // 更新本地订单状态
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'canceled'
      }
      showToast('订单已取消')
    } catch (err: any) {
      showToast(err.message || '取消订单失败')
    }
  }
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/orders/${orderId}`)
}

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取订单状态文本和样式
const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return { text: '待确认', class: 'bg-orange-100 text-orange-800' }
    case 'confirmed':
      return { text: '已确认', class: 'bg-blue-100 text-blue-800' }
    case 'cooking':
      return { text: '烹饪中', class: 'bg-purple-100 text-purple-800' }
    case 'completed':
      return { text: '已完成', class: 'bg-green-100 text-green-800' }
    case 'canceled':
      return { text: '已取消', class: 'bg-gray-100 text-gray-800' }
    default:
      return { text: '未知状态', class: 'bg-gray-100 text-gray-800' }
  }
}

// 重置筛选条件
const resetFilters = () => {
  selectedStatus.value = 'all'
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 头部 -->
    <div class="sticky top-0 bg-white z-10 px-3 py-3 border-b border-gray-200">
      <h1 class="text-lg font-bold text-gray-900">我的订单</h1>
    </div>

    <!-- 状态筛选栏 -->
    <div class="sticky top-12 bg-white z-10 px-3 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto">
      <button v-for="status in ['all', 'pending', 'confirmed', 'cooking', 'completed', 'canceled']" :key="status"
        @click="selectedStatus = status" class="whitespace-nowrap px-3 py-1 rounded-full text-sm" :class="selectedStatus === status
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-600'">
        {{
          status === 'all' ? '全部' :
            status === 'pending' ? '待确认' :
              status === 'confirmed' ? '已确认' :
                status === 'cooking' ? '烹饪中' :
                  status === 'completed' ? '已完成' : '已取消'
        }}
      </button>

      <button @click="resetFilters"
        class="ml-auto whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
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
      <button @click="fetchOrders" class="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
        重新加载
      </button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
      <svg class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2 text-center">暂无订单</h3>
      <p class="text-sm text-gray-500 text-center mb-4">您还没有相关订单哦~</p>
      <button @click="router.push('/chefs')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
        去预约厨师
      </button>
    </div>

    <!-- 订单列表 -->
    <div v-else class="px-3 py-2 space-y-3">
      <div v-for="order in filteredOrders" :key="order.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:shadow-md"
        @click="viewOrderDetail(order.id)">
        <!-- 订单头部 -->
        <div class="p-3 border-b border-gray-100 flex justify-between items-center">
          <div class="flex items-center">
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="ml-1 text-xs text-gray-600">{{ formatDate(order.createdAt) }}</span>
          </div>
          <span class="text-xs px-2 py-1 rounded-full" :class="getStatusInfo(order.status).class">
            {{ getStatusInfo(order.status).text }}
          </span>
        </div>

        <!-- 订单内容 -->
        <div class="p-3">
          <div class="flex">
            <!-- 菜单图片 -->
            <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              <img :src="order.menuImage" :alt="order.menuName" class="w-full h-full object-cover">
            </div>

            <!-- 订单信息 -->
            <div class="ml-3 flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 truncate">{{ order.menuName }}</h3>
              <div class="flex items-center mt-1">
                <img :src="order.chefImage" :alt="order.chefName" class="h-4 w-4 rounded-full mr-1">
                <span class="text-xs text-gray-500">{{ order.chefName }}</span>
              </div>

              <div class="mt-1 flex items-center">
                <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="ml-1 text-xs text-gray-500">{{ order.date }} {{ order.time }}</span>
              </div>

              <div class="mt-1">
                <p class="text-xs text-gray-600 truncate">{{ order.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单底部 -->
        <div class="p-3 border-t border-gray-100 flex justify-between items-center">
          <span class="text-sm font-bold text-gray-900">¥{{ order.price }}</span>

          <div class="flex space-x-2">
            <button v-if="order.status === 'pending' || order.status === 'confirmed'"
              @click="handleCancelOrder(order.id, $event)"
              class="px-3 py-1 text-xs border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50">
              取消订单
            </button>

            <button @click.stop="viewOrderDetail(order.id)"
              class="px-3 py-1 text-xs border border-indigo-300 rounded-full text-indigo-600 hover:bg-indigo-50">
              订单详情
            </button>

            <button v-if="order.status === 'completed'" @click.stop="router.push(`/chefs/${order.chefId}`)"
              class="px-3 py-1 text-xs bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
              再次预约
            </button>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>
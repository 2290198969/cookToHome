<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { fetchOrderDetail, cancelOrder as apiCancelOrder } from '@/api/orders'
import { showToast } from '@/utils/toast'
import { ref, onMounted } from 'vue'

// 定义订单详情类型
interface OrderDetail {
  id: number
  orderNumber: string
  status: string
  chef: {
    id: number
    name: string
    image: string
    rating: number
    experience: string
    specialties: string[]
    phone: string
  }
  items: {
    id: number
    name: string
    description: string
    price: number
    quantity: number
    image: string
  }[]
  subtotal: number
  serviceFee: number
  discount: number
  totalPrice: number
  serviceDate: string
  serviceTime: string
  serviceAddress: string
  remarks: string
  orderTime: string
  completeTime: string | null
  paymentMethod: string
}

const route = useRoute()
const router = useRouter()
const orderId = parseInt(route.params.id as string)
const order = ref<OrderDetail | null>(null)
const isLoading = ref(true)
const error = ref('')

// 获取订单详情
const fetchOrder = async () => {
  isLoading.value = true
  try {
    const data = await fetchOrderDetail(orderId)
    order.value = data
  } catch (err: any) {
    error.value = err.message || '获取订单详情失败'
  } finally {
    isLoading.value = false
  }
}

// 取消订单
const handleCancelOrder = async () => {
  if (order.value && confirm('确定要取消该订单吗？')) {
    try {
      await apiCancelOrder(order.value.id)
      order.value.status = 'canceled'
      showToast('订单已取消')
    } catch (err: any) {
      showToast(err.message || '取消订单失败')
    }
  }
}

// 联系厨师
const contactChef = () => {
  if (order.value?.chef.phone) {
    window.location.href = `tel:${order.value.chef.phone}`
  }
}

// 返回订单列表
const goBack = () => {
  router.push('/orders')
}

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })
}

onMounted(() => {
  fetchOrder()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 头部 -->
    <div class="sticky top-0 bg-white z-10 px-3 py-3 border-b border-gray-200 flex items-center">
      <button @click="goBack" class="p-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="ml-2 text-lg font-bold text-gray-900">订单详情</h1>
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
      <button @click="fetchOrder" class="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
        重新加载
      </button>
    </div>

    <!-- 订单详情内容 -->
    <div v-else class="space-y-3">
      <!-- 订单状态卡片 -->
      <div class="bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">订单状态</p>
            <p class="text-lg font-bold mt-1" :class="{
              'text-orange-500': order?.status === 'pending',
              'text-blue-500': order?.status === 'confirmed',
              'text-purple-500': order?.status === 'cooking',
              'text-green-500': order?.status === 'completed',
              'text-red-500': order?.status === 'canceled'
            }">
              {{
                order?.status === 'pending' ? '待确认' :
                  order?.status === 'confirmed' ? '已确认' :
                    order?.status === 'cooking' ? '烹饪中' :
                      order?.status === 'completed' ? '已完成' : '已取消'
              }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">订单编号</p>
            <p class="text-sm font-medium mt-1 text-gray-900">{{ order?.orderNumber }}</p>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">下单时间</p>
            <p class="text-sm font-medium mt-1 text-gray-900">{{ formatDate(order?.orderTime || '') }}</p>
          </div>
          <div class="text-right" v-if="order?.completeTime">
            <p class="text-sm text-gray-500">完成时间</p>
            <p class="text-sm font-medium mt-1 text-gray-900">{{ formatDate(order.completeTime) }}</p>
          </div>
        </div>
      </div>

      <!-- 厨师信息 -->
      <div class="bg-white p-4 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-3">厨师信息</h2>
        <div class="flex items-center">
          <img :src="order?.chef.image" :alt="order?.chef.name" class="w-12 h-12 rounded-lg object-cover">
          <div class="ml-3">
            <h3 class="text-sm font-bold text-gray-900">{{ order?.chef.name }}</h3>
            <div class="flex items-center mt-1">
              <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs text-gray-700 ml-0.5">{{ order?.chef.rating }}</span>
              <span class="mx-1 text-gray-300">|</span>
              <span class="text-xs text-gray-500">{{ order?.chef.experience }}经验</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="(specialty, index) in order?.chef.specialties || []" :key="index"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">
                {{ specialty }}
              </span>
            </div>
          </div>
        </div>
        <button @click="contactChef"
          class="mt-3 w-full py-2 border border-indigo-600 rounded-lg text-indigo-600 text-sm font-medium flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          联系厨师
        </button>
      </div>

      <!-- 订单详情 -->
      <div class="bg-white p-4 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-3">订单详情</h2>

        <div class="space-y-3">
          <div v-for="item in order?.items || []" :key="item.id"
            class="flex justify-between items-start p-2 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-md object-cover mr-2">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900">¥{{ item.price }}</p>
              <p class="text-xs text-gray-500 mt-0.5">×{{ item.quantity }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 border-t border-gray-100 pt-3 space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">小计</span>
            <span class="text-sm text-gray-900">¥{{ order?.subtotal }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">服务费</span>
            <span class="text-sm text-gray-900">¥{{ order?.serviceFee }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">优惠</span>
            <span class="text-sm text-red-500">-¥{{ order?.discount }}</span>
          </div>
          <div class="flex justify-between mt-2">
            <span class="text-base font-bold text-gray-900">合计</span>
            <span class="text-base font-bold text-indigo-600">¥{{ order?.totalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- 服务信息 -->
      <div class="bg-white p-4 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-3">服务信息</h2>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">服务日期</span>
            <span class="text-sm text-gray-900">{{ order?.serviceDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">服务时间</span>
            <span class="text-sm text-gray-900">{{ order?.serviceTime }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">服务地址</span>
            <span class="text-sm text-gray-900">{{ order?.serviceAddress }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">备注</span>
            <span class="text-sm text-gray-900">{{ order?.remarks || '无' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">支付方式</span>
            <span class="text-sm text-gray-900">{{ order?.paymentMethod || '在线支付' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 flex justify-between">
      <button v-if="order?.status === 'pending' || order?.status === 'confirmed'" @click="handleCancelOrder"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium">
        取消订单
      </button>
      <button v-if="order?.status === 'completed'" @click="router.push(`/chefs/${order?.chef.id}`)"
        class="px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm font-medium flex-1">
        再次预约
      </button>
    </div>
  </div>
</template>

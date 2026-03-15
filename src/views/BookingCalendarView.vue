<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chef } from '@/api/chefs' // 导入 Chef 类型
import { createOrder } from '@/api/orders'

const router = useRouter()
const today = new Date().toISOString().split('T')[0]

// 正确声明变量类型
const selectedDate = ref(today)
const selectedTimeSlot = ref('')
const selectedChefId = ref<number>(0) // 明确为 number 类型
const isLoading = ref(false)
const errorMessage = ref('')

// 声明为 Chef 类型数组
const availableChefs = ref<Chef[]>([])

// 可预约时间段
const availableTimeSlots = computed(() => {
  const now = new Date()
  const selected = new Date(selectedDate.value)

  if (selected.toDateString() === now.toDateString()) {
    const currentHour = now.getHours()
    return [
      ...(currentHour < 10 ? ['10:00'] : []),
      ...(currentHour < 12 ? ['12:00'] : []),
      ...(currentHour < 14 ? ['14:00'] : []),
      ...(currentHour < 16 ? ['16:00'] : []),
      ...(currentHour < 18 ? ['18:00'] : []),
      ...(currentHour < 20 ? ['20:00'] : [])
    ]
  }

  return ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
})

// 获取可用厨师 - 修复函数实现
const loadAvailableChefs = async () => {
  isLoading.value = true
  try {
    // 由于API中没有fetchAvailableChefs函数，这里使用模拟数据
    // 在实际项目中，应该调用正确的API端点

    // 模拟返回的厨师数据
    availableChefs.value = [
      {
        id: 1,
        name: '王大厨',
        rating: 4.8,
        reviews: 256,
        specialties: ['川菜', '湘菜'],
        experience: '10年',
        bio: '擅长川湘菜系，曾在五星级酒店担任主厨',
        price: 388,
        image: 'https://picsum.photos/id/1005/200/200',
        isFavorite: false
      },
      {
        id: 2,
        name: '李师傅',
        rating: 4.9,
        reviews: 189,
        specialties: ['法餐', '意大利菜'],
        experience: '15年',
        bio: '法国蓝带厨艺学院毕业，专注西餐20年',
        price: 588,
        image: 'https://picsum.photos/id/1012/200/200',
        isFavorite: false
      },
      {
        id: 3,
        name: '张师傅',
        rating: 4.7,
        reviews: 312,
        specialties: ['日料', '寿司'],
        experience: '8年',
        bio: '曾在日本进修3年，精通各类日式料理',
        price: 428,
        image: 'https://picsum.photos/id/1025/200/200',
        isFavorite: false
      }
    ]
  } catch (error: any) {
    errorMessage.value = error.message || '获取可用厨师失败'
  } finally {
    isLoading.value = false
  }
}

// 提交预约
const submitBooking = async () => {
  if (!selectedTimeSlot.value || !selectedChefId.value) {
    errorMessage.value = '请选择预约时间和厨师'
    return
  }

  try {
    await createOrder({
      chefId: selectedChefId.value,
      menuId: 1,
      date: selectedDate.value,
      time: selectedTimeSlot.value,
      guests: 2,
      address: {
        recipient: '用户',
        phone: '13800000000',
        address: '北京市朝阳区',
        city: '北京市',
        zipCode: '100000'
      }
    })

    router.push('/my-orders')
  } catch (error: any) {
    errorMessage.value = error.message || '预约失败，请重试'
  }
}

const watchDateAndTime = () => {
  if (selectedDate.value && selectedTimeSlot.value) {
    loadAvailableChefs()
  }
}

onMounted(() => {
  watchDateAndTime()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">在线预约</h1>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
        {{ errorMessage }}
      </div>

      <!-- 日期选择 - 修复min属性绑定 -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-5">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">选择日期</h2>
        <input type="date" v-model="selectedDate" :min="today" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500" @change="watchDateAndTime">
      </div>

      <!-- 时间段选择 -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-5">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">选择时间</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button v-for="time in availableTimeSlots" :key="time"
            :class="`py-2 px-3 border rounded-lg text-center
                    ${selectedTimeSlot === time ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`"
            @click="selectedTimeSlot = time; watchDateAndTime()">
            {{ time }}
          </button>
        </div>
      </div>

      <!-- 厨师选择 - 修复样式绑定和图片属性 -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-5">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">选择厨师</h2>

        <!-- 加载中 -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>

        <!-- 无可用厨师 -->
        <div v-else-if="availableChefs.length === 0" class="py-8 text-center text-gray-500">
          <p>暂无可用厨师</p>
          <p class="text-sm mt-1">请尝试选择其他日期或时间</p>
        </div>

        <!-- 厨师列表 -->
        <div v-else class="space-y-3">
          <div v-for="chef in availableChefs" :key="chef.id"
            class="flex items-center p-3 border rounded-lg cursor-pointer"
            :class="selectedChefId === chef.id ? 'bg-indigo-50 border-indigo-300' : 'border-gray-200 hover:bg-gray-50'"
            @click="selectedChefId = chef.id">
            <img :src="chef.image" alt="厨师头像" class="w-12 h-12 rounded-full object-cover mr-3">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ chef.name }}</h3>
              <div class="flex items-center text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                    </path>
                  </svg>
                  {{ chef.rating }}
                </span>
                <span class="mx-2">|</span>
                <span>{{ chef.specialties.join('、') }}</span>
              </div>
            </div>
            <div v-if="selectedChefId === chef.id" class="text-indigo-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button @click="submitBooking"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading || !selectedTimeSlot.value || !selectedChefId.value">
        确认预约
      </button>
    </div>
  </div>
</template>

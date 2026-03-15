<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderView from '@/components/HeaderView.vue'
import BottomNav from '@/components/BottomNav.vue'

// 类型定义
interface UserProfile {
  name: string
  avatar: string
  phone: string
  gender: 'male' | 'female'
  birthday: string
}

const router = useRouter()

// 用户信息
const user = ref<UserProfile>({
  name: '张先生',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  phone: '13800138000',
  gender: 'male',
  birthday: '1990-01-01'
})

// 表单验证状态
const formErrors = ref<Partial<Record<keyof UserProfile, string>>>({})

// 验证表单
const validateForm = (): boolean => {
  const errors: Partial<Record<keyof UserProfile, string>> = {}

  if (!user.value.name.trim()) {
    errors.name = '请输入姓名'
  }

  if (!user.value.phone.trim()) {
    errors.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(user.value.phone)) {
    errors.phone = '请输入有效的手机号'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// 保存修改
const saveProfile = () => {
  if (!validateForm()) return

  // 在实际应用中，这里会调用API保存用户信息
  console.log('保存用户信息:', user.value)

  // 显示保存成功提示
  alert('信息保存成功')
  router.go(-1)
}

// 选择头像
const selectAvatar = () => {
  // 在实际应用中，这里会调用图片选择器
  console.log('选择新头像')
  // 示例：模拟选择头像
  // user.value.avatar = '新头像URL'
}

// 格式化手机号显示
const formatPhone = (value: string) => {
  // 移除所有非数字字符
  const numericValue = value.replace(/\D/g, '')

  // 限制长度为11位
  if (numericValue.length > 11) {
    return numericValue.slice(0, 11)
  }

  // 格式化显示：138 0013 8000
  return numericValue
    .replace(/(\d{3})(?=\d)/g, '$1 ')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}

// 处理手机号输入
const handlePhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  user.value.phone = formatPhone(input.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <HeaderView />

    <div class="pt-16 px-4">
      <!-- 头像编辑 -->
      <div class="flex flex-col items-center py-6">
        <div class="relative group">
          <img :src="user.avatar" alt="用户头像"
            class="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md transition-transform group-hover:scale-105"
            loading="lazy">
          <button @click="selectAvatar"
            class="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md transition-all hover:bg-indigo-700"
            aria-label="更换头像">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">点击更换头像</p>
      </div>

      <!-- 表单区域 -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="border-b border-gray-100 px-4 py-3">
          <label class="text-sm text-gray-500 block mb-1">姓名</label>
          <input v-model="user.name" type="text"
            class="w-full text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="请输入您的姓名">
          <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
        </div>

        <div class="border-b border-gray-100 px-4 py-3">
          <label class="text-sm text-gray-500 block mb-1">手机号</label>
          <input :value="user.phone" @input="handlePhoneInput" type="tel"
            class="w-full text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="请输入您的手机号" maxlength="13">
          <p v-if="formErrors.phone" class="text-xs text-red-500 mt-1">{{ formErrors.phone }}</p>
        </div>

        <div class="border-b border-gray-100 px-4 py-3">
          <label class="text-sm text-gray-500 block mb-1">性别</label>
          <div class="flex space-x-4 mt-2">
            <label class="flex items-center cursor-pointer">
              <input v-model="user.gender" type="radio" name="gender" value="male"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500">
              <span class="ml-2 text-sm text-gray-900">男</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input v-model="user.gender" type="radio" name="gender" value="female"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500">
              <span class="ml-2 text-sm text-gray-900">女</span>
            </label>
          </div>
        </div>

        <div class="px-4 py-3">
          <label class="text-sm text-gray-500 block mb-1">生日</label>
          <input v-model="user.birthday" type="date"
            class="w-full text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="mt-6">
        <button @click="saveProfile"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          保存修改
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>
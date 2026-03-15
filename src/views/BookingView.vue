<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { fetchChefDetails } from '@/api/chefs'
import { showToast } from '@/utils/toast'

// ... 其他代码保持不变 ...
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- ... 其他代码保持不变 ... -->

    <!-- 预约日期选择 -->
    <section class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">选择预约日期</h2>
      <div class="grid grid-cols-7 gap-2 text-center">
        <div class="text-xs text-gray-500 py-1">日</div>
        <div class="text-xs text-gray-500 py-1">一</div>
        <div class="text-xs text-gray-500 py-1">二</div>
        <div class="text-xs text-gray-500 py-1">三</div>
        <div class="text-xs text-gray-500 py-1">四</div>
        <div class="text-xs text-gray-500 py-1">五</div>
        <div class="text-xs text-gray-500 py-1">六</div>

        <!-- 修复样式绑定语法 -->
        <div v-for="i in 14" :key="i" class="py-2 rounded-md cursor-pointer"
          :class="i === 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="handleDateChange(`2023-07-${i.toString().padStart(2, '0')}`)">
          {{ i }}
          <div class="text-xs mt-1" :class="i === 1 ? 'text-white' : 'text-gray-500'">
            {{ i === 1 ? '今天' : i === 2 ? '明天' : '' }}
          </div>
        </div>
      </div>
      <div class="mt-4 text-sm text-gray-500">
        选择的日期: {{ formatDate(selectedDate.value) }}
      </div>
    </section>

    <!-- ... 其他代码保持不变 ... -->

    <!-- 提交按钮 - 修复禁用状态 -->
    <section class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-10">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-500">总计: <span class="text-base font-bold text-indigo-600">¥{{ chef?.price || 0
              }}</span></p>
        </div>
        <button @click="submitBooking"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
          :disabled="!isFormValid.value">
          确认预约
        </button>
      </div>
    </section>
  </div>

  <Footer />
  </div>
</template>

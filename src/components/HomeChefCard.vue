<script setup lang="ts">
defineProps<{
  chef: {
    id: number
    name: string
    rating: number
    reviews: number
    specialties: string[]
    experience: string
    bio: string
    price: number
    image: string
    isFavorite?: boolean
  }
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <div @click="emit('click')"
    class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100">
    <div class="relative">
      <img :src="chef.image" :alt="chef.name" class="w-full h-48 object-cover">

      <!-- 评分标签 -->
      <div class="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center shadow-sm">
        <svg class="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="ml-1 text-sm font-medium text-gray-900">{{ chef.rating }}</span>
        <span class="text-xs text-gray-500 ml-1">({{ chef.reviews }})</span>
      </div>

      <!-- 收藏按钮 -->
      <button class="absolute top-3 left-3 p-1.5 bg-white bg-opacity-90 rounded-full shadow-sm">
        <svg class="h-5 w-5" :class="chef.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ chef.name }}</h3>
          <div class="flex items-center mt-1">
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="ml-1 text-sm text-gray-600">{{ chef.experience }}经验</span>
          </div>
        </div>
        <span class="text-lg font-bold text-indigo-600">¥{{ chef.price }}/次</span>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <span v-for="(specialty, index) in chef.specialties" :key="index"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
          {{ specialty }}
        </span>
      </div>

      <p class="mt-3 text-sm text-gray-600 line-clamp-2">{{ chef.bio }}</p>

      <div class="mt-4">
        <button
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center justify-center"
          @click.stop="emit('click')">
          查看详情
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
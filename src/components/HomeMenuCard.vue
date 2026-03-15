<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  menu: {
    id: number
    name: string
    price: number
    image: string
    rating: number
    reviews: number
    chefName: string
    chefImage: string
    cuisine: string
    isFavorite?: boolean
    ingredients: string[]
  }
}>()

const emit = defineEmits(['click', 'toggleFavorite'])

const handleFavoriteToggle = (e: Event) => {
  e.stopPropagation()
  emit('toggleFavorite', props.menu.id)
}
</script>

<template>
  <div @click="$emit('click')"
    class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
    <div class="relative">
      <img :src="menu.image" :alt="menu.name" class="w-full h-40 object-cover">

      <!-- 评分标签 -->
      <div class="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center shadow-sm">
        <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="ml-1 text-xs font-medium text-gray-900">{{ menu.rating }}</span>
      </div>

      <!-- 收藏按钮 -->
      <button class="absolute top-2 left-2 p-1 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
        @click="handleFavoriteToggle" aria-label="收藏">
        <svg class="h-4 w-4" :class="menu.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- 菜系标签 -->
      <div class="absolute bottom-2 left-2">
        <span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
          {{ menu.cuisine }}
        </span>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-bold text-gray-900 line-clamp-1">{{ menu.name }}</h3>

      <div class="flex items-center mt-2">
        <img :src="menu.chefImage" :alt="menu.chefName" class="h-5 w-5 rounded-full mr-1.5">
        <span class="text-xs text-gray-600 truncate">{{ menu.chefName }}</span>
      </div>

      <div class="flex flex-wrap gap-1 mt-1">
        <span v-for="(ingredient, index) in menu.ingredients.slice(0, 2)" :key="index"
          class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          {{ ingredient }}
        </span>
        <span v-if="menu.ingredients.length > 2" class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          +{{ menu.ingredients.length - 2 }}
        </span>
      </div>

      <div class="flex justify-between items-center mt-2">
        <span class="text-base font-bold text-indigo-600">¥{{ menu.price }}</span>
        <span class="text-xs text-gray-500">{{ menu.reviews }}人评价</span>
      </div>
    </div>
  </div>
</template>

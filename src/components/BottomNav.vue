<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 获取当前路由路径，用于高亮显示
import { computed } from 'vue'
const currentRoute = computed(() => router.currentRoute.value.path)
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around items-center h-16">
      <!-- 首页 -->
      <a href="/" class="flex flex-col items-center justify-center px-4 py-2"
        :class="currentRoute === '/' ? 'text-indigo-600' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house"
          viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207l-5-5-5 5V13.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7.207Z" />
        </svg>
        <span class="text-xs mt-1 font-medium">首页</span>
      </a>

      <!-- 厨师 -->
      <a href="/chefs" class="flex flex-col items-center justify-center px-4 py-2"
        :class="currentRoute === '/chefs' ? 'text-indigo-600' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-emoji-sunglasses" viewBox="0 0 16 16">
          <path
            d="M4.968 9.75a.5.5 0 1 0-.866.5A4.498 4.498 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.498 3.498 0 0 1 8 11.5a3.498 3.498 0 0 1-3.032-1.75zM7 5.116V5a1 1 0 0 0-1-1H3.28a1 1 0 0 0-.97 1.243l.311 1.242A2 2 0 0 0 4.561 8H5a2 2 0 0 0 1.994-1.839A2.99 2.99 0 0 1 8 6c.393 0 .74.064 1.006.161A2 2 0 0 0 11 8h.438a2 2 0 0 0 1.94-1.515l.311-1.242A1 1 0 0 0 12.72 4H10a1 1 0 0 0-1 1v.116A4.22 4.22 0 0 0 8 5c-.35 0-.69.04-1 .116z" />
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0z" />
        </svg>
        <span class="text-xs mt-1 font-medium">厨师</span>
      </a>

      <!-- 购物车 -->
      <a href="/cart" class="flex flex-col items-center justify-center px-4 py-2 "
        :class="currentRoute === '/cart' ? 'text-indigo-600' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3"
          viewBox="0 0 16 16">
          <path
            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        <span class="text-xs mt-1 font-medium">购物车</span>
      </a>

      <!-- 订单 -->
      <a href="/orders" class="flex flex-col items-center justify-center px-4 py-2"
        :class="currentRoute === '/orders' ? 'text-indigo-600' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check"
          viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
          <path
            d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path
            d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
        <span class="text-xs mt-1 font-medium">订单</span>
      </a>

      <!-- 我的 -->
      <a href="/profile" class="flex flex-col items-center justify-center px-4 py-2"
        :class="currentRoute === '/profile' ? 'text-indigo-600' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person"
          viewBox="0 0 16 16">
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
        </svg>
        <span class="text-xs mt-1 font-medium">我的</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
/* 删除触摸动效，添加手机软件风格的点击动效 */
a,
button {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 点击效果 - 简化为不透明度变化，更接近原生应用 */
a:active,
button:active {
  opacity: 0.7;
  transform: none;
}

/* 购物车按钮特殊样式 */
.a:nth-child(3) {
  position: relative;
  margin-top: -12px;
}
</style>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 py-3 px-4">
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-bold text-gray-900">购物车</h1>
        <button @click="clearCart" class="text-sm text-gray-600 hover:text-red-500" v-if="cartItems.length > 0">
          清空
        </button>
        <div v-else class="w-6"></div>
      </div>
    </div>
    <!-- 购物车商品列表 -->
    <div v-if="cartItems.length === 0" class="py-16 text-center">
      <p class="text-gray-500">购物车是空的</p>
      <Button @click="router.push('/')" variant="primary" size="small" class="mt-4">
        去选购商品
      </Button>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm mx-4 mt-4 overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div v-for="item in cartItems" :key="`${item.id}-${item.chefId}`" class="px-4 py-3 flex items-center">
          <img :src="item.image" :alt="item.name" class="w-12 h-12 object-cover rounded">
          <div class="ml-3 flex-1">
            <h3 class="font-medium text-gray-900 text-sm">{{ item.name }}</h3>
            <div class="flex justify-between items-center mt-1">
              <div class="flex items-center">
                <Button @click="decreaseQuantity(item.id, item.chefId)" variant="secondary" size="small"
                  class="w-6 h-6 p-0 flex items-center justify-center bg-gray-100 text-gray-700 rounded"
                  :disabled="item.quantity <= 1">
                  <span class="text-xs">-</span>
                </Button>
                <input v-model="item.quantity" type="text" readonly class="w-10 text-center">
                <Button @click="increaseQuantity(item.id, item.chefId)" variant="secondary" size="small"
                  class="w-6 h-6 p-0 flex items-center justify-center bg-gray-100 text-gray-700 rounded">
                  <span class="text-xs">+</span>
                </Button>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">¥{{ item.price }}</div>
                <div class="text-xs text-gray-500">小计: ¥{{ item.price * item.quantity }}</div>
              </div>
            </div>
          </div>
          <Button @click="removeFromCart(item.id, item.chefId)" variant="text" size="small"
            class="ml-3 text-gray-400 hover:text-red-500 p-0">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>
    </div>

    <!-- 结算信息 -->
    <div v-if="cartItems.length > 0" class="bg-white border-t border-gray-100 px-4 py-3 fixed bottom-16 left-0 right-0">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-sm text-gray-500">总计</div>
          <div class="text-xl font-bold text-indigo-600">¥{{ totalPrice }}</div>
        </div>
        <Button @click="checkout" variant="primary" size="medium">
          去结算
        </Button>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import BottomNav from '@/components/BottomNav.vue';
import Button from '@/components/ButtonView.vue';

const router = useRouter();
const cartStore = useCartStore();
const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = cartStore;

// 增加商品数量
const increaseQuantity = (itemId: number, chefId: number) => {
  const item = cartItems.find(item => item.id === itemId && item.chefId === chefId);
  if (item) {
    updateQuantity(itemId, chefId, item.quantity + 1);
  }
};

// 减少商品数量
const decreaseQuantity = (itemId: number, chefId: number) => {
  const item = cartItems.find(item => item.id === itemId && item.chefId === chefId);
  if (item && item.quantity > 1) {
    updateQuantity(itemId, chefId, item.quantity - 1);
  }
};

// 去结算
const checkout = () => {
  router.push('/checkout');
};
</script>
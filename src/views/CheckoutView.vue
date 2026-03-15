<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航 -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4">
      <div class="flex justify-between items-center">
        <Button variant="text" size="small" class="text-white p-0 hover:bg-transparent" @click="router.back()">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Button>
        <h1 class="text-xl font-bold">确认订单</h1>
        <div class="w-6"></div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="bg-white rounded-xl shadow-sm mx-4 mt-4 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">订单信息</h2>
      </div>

      <div class="p-4">
        <div class="space-y-3">
          <div v-for="item in cartItems" :key="`${item.id}-${item.chefId}`">
            <div class="flex justify-between">
              <div>
                <span class="text-gray-700">{{ item.name }}</span>
                <span class="text-gray-500 text-sm ml-2">x{{ item.quantity }}</span>
              </div>
              <span class="font-medium">¥{{ item.price * item.quantity }}</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 mt-4 pt-4">
          <div class="flex justify-between text-gray-600 mb-2">
            <span>小计</span>
            <span>¥{{ totalPrice }}</span>
          </div>
          <div class="flex justify-between text-gray-600 mb-2">
            <span>配送费</span>
            <span>¥{{ deliveryFee }}</span>
          </div>
          <div class="flex justify-between text-gray-600 mb-2">
            <span>服务费</span>
            <span>¥{{ serviceFee }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg mt-2">
            <span>总计</span>
            <span class="text-indigo-600">¥{{ totalPrice + deliveryFee + serviceFee }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 收货地址 -->
    <div class="bg-white rounded-xl shadow-sm mx-4 mt-4 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-900">收货地址</h2>
        <Button @click="editAddress" variant="text" size="small">
          编辑
        </Button>
      </div>

      <div class="p-4">
        <div v-if="selectedAddress">
          <p class="font-medium">{{ selectedAddress.name }} {{ selectedAddress.phone }}</p>
          <p class="text-gray-600 mt-1">{{ selectedAddress.address }}</p>
          <p class="text-gray-500 text-sm mt-1">{{ selectedAddress.note }}</p>
        </div>
        <div v-else>
          <Button @click="editAddress" variant="secondary" size="medium" fullWidth>
            添加收货地址
          </Button>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="bg-white rounded-xl shadow-sm mx-4 mt-4 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">支付方式</h2>
      </div>

      <div class="p-4">
        <div v-for="method in paymentMethods" :key="method.id"
          class="flex items-center p-3 border rounded-lg mb-2 cursor-pointer"
          :class="selectedPaymentMethod === method.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
          @click="selectPaymentMethod(method.id)">
          <div class="w-5 h-5 rounded-full border flex items-center justify-center mr-3">
            <div class="w-3 h-3 rounded-full"
              :class="selectedPaymentMethod === method.id ? 'bg-indigo-600' : 'bg-transparent'"></div>
          </div>
          <span>{{ method.name }}</span>
        </div>
      </div>
    </div>

    <!-- 备注信息 -->
    <div class="bg-white rounded-xl shadow-sm mx-4 mt-4 overflow-hidden mb-4">
      <div class="px-4 py-3 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">备注</h2>
      </div>

      <div class="p-4">
        <textarea v-model="orderNote" class="w-full border rounded-lg p-3 text-sm" rows="3"
          placeholder="请输入特殊要求..."></textarea>
      </div>
    </div>

    <!-- 提交订单 -->
    <div class="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <Button @click="submitOrder" variant="primary" size="medium" fullWidth
        :disabled="!selectedAddress || selectedPaymentMethod === null || cartItems.length === 0">
        提交订单 ¥{{ totalPrice + deliveryFee + serviceFee }}
      </Button>
    </div>

    <!-- 底部导航 -->
    <BottomNav />

    <!-- 提示框 -->
    <div v-if="toastMessage"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-out">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import BottomNav from '@/components/BottomNav.vue';
import Button from '@/components/ButtonView.vue';

const router = useRouter();
const cartStore = useCartStore();
const { cartItems, totalPrice, clearCart } = cartStore;

// 状态管理
const toastMessage = ref('');
const deliveryFee = ref(10); // 配送费
const serviceFee = ref(5); // 服务费

// 地址信息
const selectedAddress = ref<any>({
  name: '张先生',
  phone: '138****6789',
  address: '北京市朝阳区建国路88号',
  note: '请放在门口'
});

// 支付方式
const paymentMethods = [
  { id: 1, name: '微信支付' },
  { id: 2, name: '支付宝' },
  { id: 3, name: '银行卡支付' }
];
const selectedPaymentMethod = ref<number | null>(1);

// 订单备注
const orderNote = ref('');

// 选择支付方式
const selectPaymentMethod = (id: number) => {
  selectedPaymentMethod.value = id;
};

// 编辑地址
const editAddress = () => {
  showToast('跳转到地址编辑页面');
  // 实际应用中应该跳转到地址编辑页面
};

// 提交订单
const submitOrder = () => {
  if (!selectedAddress.value) {
    showToast('请添加收货地址');
    return;
  }

  if (!selectedPaymentMethod.value) {
    showToast('请选择支付方式');
    return;
  }

  if (cartItems.length === 0) {
    showToast('购物车为空，无法提交订单');
    return;
  }

  // 模拟订单提交
  showToast('订单提交成功！');

  // 清空购物车
  clearCart();

  // 跳转到订单详情页
  setTimeout(() => {
    router.push('/orders');
  }, 1500);
};

// 显示提示
const showToast = (message: string) => {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = '';
  }, 2000);
};
</script>

<style scoped>
/* 提示框动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }

  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
}

.animate-fade-in-out {
  animation: fadeInOut 2s ease-in-out forwards;
}
</style>

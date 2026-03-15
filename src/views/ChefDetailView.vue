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
        <h1 class="text-xl font-bold">厨师详情</h1>
        <div class="flex items-center">
          <CartIcon class="mr-3" />
          <Button variant="text" size="small" class="text-white p-0 hover:bg-transparent" @click="toggleFavorite">
            <svg class="h-5 w-5" :class="isChefFavorite ? 'text-red-400 fill-current' : ''" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>

    <!-- 厨师信息 -->
    <div class="bg-white rounded-xl shadow-sm -mt-6 mx-4 overflow-hidden">
      <div class="p-4">
        <div class="flex">
          <img :src="chefDetail.avatar" :alt="chefDetail.name"
            class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm">

          <div class="ml-4 flex-1">
            <div class="flex justify-between">
              <h2 class="text-xl font-bold text-gray-900">{{ chefDetail.name }}</h2>
              <div class="flex items-center">
                <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium text-gray-700 ml-1">{{ chefDetail.rating }}</span>
                <span class="text-xs text-gray-500 ml-1">({{ chefDetail.reviews }}条评价)</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="specialty in chefDetail.specialties" :key="specialty"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                {{ specialty }}
              </span>
            </div>

            <div class="mt-3 flex items-center text-sm text-gray-600">
              <div class="flex items-center mr-4">
                <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ chefDetail.experience }}经验</span>
              </div>

              <div class="flex items-center mr-4">
                <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{{ chefDetail.distance || '1km内' }}</span>
              </div>

              <div class="flex items-center">
                <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>¥{{ chefDetail.price }}/次起</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-900 mb-2">厨师介绍</h3>
          <p class="text-sm text-gray-600 whitespace-pre-line">{{ chefDetail.bio }}</p>
        </div>

        <Button @click="bookChef" variant="primary" size="medium" fullWidth class="mt-4">
          立即预约
        </Button>
      </div>
    </div>

    <!-- 推荐菜单 -->
    <div class="bg-white rounded-xl shadow-sm mt-4 mx-4 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-900">推荐菜单</h2>
          <Button @click="navigateToAllMenus" variant="text" size="small">
            查看全部
          </Button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="py-10 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="chefDetail.menus.length === 0" class="py-10 text-center">
        <p class="text-gray-500 text-sm">该厨师暂无菜单</p>
      </div>

      <!-- 菜单列表 -->
      <div v-else class="p-4">
        <div class="space-y-3">
          <div v-for="menu in displayedMenus" :key="menu.id"
            class="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
            @click="navigateToMenuDetail(menu.id)">
            <div class="flex">
              <img :src="menu.image" :alt="menu.name" class="w-20 h-20 object-cover rounded">

              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <h3 class="font-medium text-gray-900">{{ menu.name }}</h3>
                  <span class="text-indigo-600 font-bold">¥{{ menu.price }}</span>
                </div>

                <div class="flex items-center mt-1">
                  <svg class="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-xs text-gray-600 ml-1">{{ menu.rating }} ({{ menu.reviews }}条)</span>
                </div>

                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ menu.description }}</p>

                <div class="mt-2 flex justify-between items-center">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(ingredient, index) in menu.ingredients.slice(0, 3)" :key="index"
                      class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {{ ingredient }}
                    </span>
                    <span v-if="menu.ingredients.length > 3"
                      class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      +{{ menu.ingredients.length - 3 }}
                    </span>
                  </div>

                  <Button @click.stop="addToCart(menu)" variant="primary" size="small" :disabled="isAdding[menu.id]">
                    <span v-if="!isAdding[menu.id]">加入购物车</span>
                    <span v-else>已加入</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 厨师评价 -->
    <div class="bg-white rounded-xl shadow-sm mt-4 mx-4 overflow-hidden mb-4">
      <div class="px-4 py-3 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">顾客评价</h2>
      </div>

      <div v-if="chefDetail.reviewsList.length === 0" class="py-10 text-center">
        <p class="text-gray-500 text-sm">暂无评价</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="review in chefDetail.reviewsList" :key="review.id" class="px-4 py-3">
          <div class="flex">
            <img :src="review.userAvatar" :alt="review.userName" class="w-8 h-8 rounded-full object-cover">

            <div class="ml-3 flex-1">
              <div class="flex justify-between">
                <h3 class="font-medium text-gray-900 text-sm">{{ review.userName }}</h3>
                <span class="text-xs text-gray-500">{{ review.date }}</span>
              </div>

              <div class="flex mt-1">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" class="h-3 w-3"
                    :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" fill="none"
                    viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 ml-2">品尝了: {{ review.dishName }}</span>
              </div>

              <p class="text-sm text-gray-700 mt-2">{{ review.content }}</p>

              <div v-if="review.images.length > 0" class="mt-2 flex gap-1">
                <img v-for="(img, index) in review.images" :key="index" :src="img" :alt="`评价图片 ${index + 1}`"
                  class="w-16 h-16 object-cover rounded">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div
      class="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
      <div>
        <p class="text-xs text-gray-500">起订价</p>
        <p class="text-lg font-bold text-indigo-600">¥{{ chefDetail.price }}/次</p>
      </div>

      <Button @click="bookChef" variant="primary" size="medium">
        立即预约
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
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/favorites';
import { useCartStore } from '@/stores/cart';
import BottomNav from '@/components/BottomNav.vue';
import Button from '@/components/ButtonView.vue';
import type { FavoriteItem } from '@/stores/favorites';

// 定义类型接口
interface Menu {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
}

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  dishName: string;
  content: string;
  images: string[];
}

interface ChefDetail {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specialties: string[];
  bio: string;
  price: number;
  distance?: string;
  menus: Menu[];
  reviewsList: Review[];
}

const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const cartStore = useCartStore();

// 状态管理
const chefId = ref<number>(0);
const chefDetail = ref<ChefDetail>({
  id: 0,
  name: '',
  avatar: '',
  rating: 0,
  reviews: 0,
  experience: '',
  specialties: [],
  bio: '',
  price: 0,
  menus: [],
  reviewsList: []
});
const isLoading = ref(true);
const toastMessage = ref('');
const showMenuCount = ref(3); // 默认显示3个菜单
const isAdding = reactive<Record<number, boolean>>({}); // 记录正在添加的商品

// 检查是否已收藏
const isChefFavorite = computed(() => {
  return favoritesStore.isFavorite(chefDetail.value.id, 'chef');
});

// 显示的菜单（默认显示前3个）
const displayedMenus = computed(() => {
  return chefDetail.value.menus.slice(0, showMenuCount.value);
});

// 获取厨师详情数据
const fetchChefDetail = async () => {
  isLoading.value = true;
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟厨师详情数据
    const mockData: ChefDetail = {
      id: chefId.value,
      name: '王大厨',
      avatar: 'https://picsum.photos/id/1005/200/200',
      rating: 4.8,
      reviews: 256,
      experience: '10年',
      specialties: ['川菜', '湘菜', '家常菜'],
      bio: '王大厨拥有10年川菜烹饪经验，曾在五星级酒店担任主厨。擅长将传统川菜与现代烹饪技巧相结合，注重食材的新鲜和口感的层次。尤其拿手水煮鱼、麻婆豆腐等经典川菜，深受顾客喜爱。\n\n服务理念：用心做好每一道菜，让顾客品尝到最地道的川味。',
      price: 388,
      distance: '1.2km',
      menus: [
        {
          id: 101,
          name: '川味水煮鱼',
          price: 128,
          image: 'https://images.unsplash.com/photo-1567337710282-00832b415979',
          rating: 4.9,
          reviews: 128,
          description: '选用新鲜草鱼，搭配秘制红油汤底，麻辣鲜香，回味无穷',
          ingredients: ['草鱼', '豆芽', '辣椒', '花椒', '姜蒜']
        },
        {
          id: 102,
          name: '麻婆豆腐',
          price: 58,
          image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
          rating: 4.7,
          reviews: 96,
          description: '传统川菜，豆腐嫩滑，肉末鲜香，麻辣适中',
          ingredients: ['嫩豆腐', '猪肉末', '豆瓣酱', '花椒', '葱花']
        },
        {
          id: 103,
          name: '宫保鸡丁',
          price: 78,
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
          rating: 4.6,
          reviews: 87,
          description: '鸡肉鲜嫩，花生酥脆，配以青红椒，酸甜可口',
          ingredients: ['鸡胸肉', '花生米', '青红椒', '黄瓜', '干辣椒']
        },
        {
          id: 104,
          name: '鱼香肉丝',
          price: 68,
          image: 'https://images.unsplash.com/photo-1551632436-cbf8dd1fd216',
          rating: 4.8,
          reviews: 112,
          description: '经典川菜，酸甜适中，肉丝嫩滑，香气四溢',
          ingredients: ['猪肉丝', '木耳', '胡萝卜', '青椒', '葱姜蒜']
        }
      ],
      reviewsList: [
        {
          id: 1,
          userName: '张先生',
          userAvatar: 'https://picsum.photos/id/1012/100/100',
          rating: 5,
          date: '2023-06-15',
          dishName: '川味水煮鱼',
          content: '味道非常正宗，鱼肉鲜嫩，麻辣程度刚刚好，非常推荐！',
          images: [
            'https://images.unsplash.com/photo-1567337710282-00832b415979?w=100'
          ]
        },
        {
          id: 2,
          userName: '李女士',
          userAvatar: 'https://picsum.photos/id/1027/100/100',
          rating: 4,
          date: '2023-06-10',
          dishName: '麻婆豆腐',
          content: '豆腐很嫩，味道不错，就是稍微有点咸，总体还是很满意的。',
          images: []
        }
      ]
    };

    chefDetail.value = mockData;
  } catch (error) {
    showToast('获取厨师详情失败，请重试');
    console.error('Error fetching chef detail:', error);
  } finally {
    isLoading.value = false;
  }
};

// 切换收藏状态
const toggleFavorite = () => {
  if (chefDetail.value.id) {
    const favoriteItem: FavoriteItem = {
      id: chefDetail.value.id,
      type: 'chef',
      name: chefDetail.value.name,
      image: chefDetail.value.avatar,
      rating: chefDetail.value.rating,
      price: chefDetail.value.price
    };

    favoritesStore.addToFavorites(favoriteItem);
    showToast(isChefFavorite.value ? '已添加到收藏' : '已取消收藏');
  }
};

// 导航到所有菜单
const navigateToAllMenus = () => {
  router.push(`/chef/${chefDetail.value.id}/menus`);
  showToast('查看全部菜单');
};

// 导航到菜单详情
const navigateToMenuDetail = (menuId: number) => {
  router.push(`/chef/${chefDetail.value.id}/menu/${menuId}`);
  showToast('查看菜单详情');
};

// 加入购物车
const addToCart = async (menu: Menu) => {
  if (isAdding[menu.id]) return;

  isAdding[menu.id] = true;
  try {
    await cartStore.addToCart({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      image: menu.image,
      chefId: chefDetail.value.id
    });
    showToast(`${menu.name}已加入购物车`);

    // 2秒后恢复按钮状态
    setTimeout(() => {
      isAdding[menu.id] = false;
    }, 2000);
  } catch (error) {
    isAdding[menu.id] = false;
    showToast('加入购物车失败，请重试');
    console.error('Error adding to cart:', error);
  }
};

// 立即预约
const bookChef = () => {
  router.push(`/booking/${chefDetail.value.id}`);
  showToast('进入预约页面');
};

// 显示提示
const showToast = (message: string) => {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = '';
  }, 2000);
};

// 初始化
onMounted(() => {
  // 从路由参数获取厨师ID
  const id = route.params.id;
  if (typeof id === 'string') {
    chefId.value = parseInt(id, 10);
    fetchChefDetail();
  } else {
    showToast('无效的厨师ID');
    router.back();
  }
});
</script>

<style scoped>
/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

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

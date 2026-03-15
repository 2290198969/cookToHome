import { createRouter, createWebHistory } from 'vue-router'
import CartView from '@/views/CartView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/chefs',
      name: 'chefs',
      component: () => import('@/views/ChefsView.vue'),
    },
    {
      path: '/chefs/:id',
      name: 'chef-detail',
      component: () => import('@/views/ChefDetailView.vue'),
      props: true,
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('@/views/BookingView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrderView.vue'),
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('@/views/OrderDetailView.vue'),
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: '我的' },
    },
    { path: '/booking-calendar', component: () => import('@/views/BookingCalendarView.vue') },
    { path: '/cart', component: CartView, name: 'Cart' },
  ],
})

export default router

import { defineStore } from 'pinia'

// 用户信息类型
export interface UserInfo {
  id: number
  name: string
  avatar: string
  phone: string
  email?: string
  memberLevel: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: localStorage.getItem('user_token') || '',
    isLoggedIn: !!localStorage.getItem('user_token'),
  }),

  getters: {
    // 获取用户姓名（默认显示"游客"）
    displayName: (state) => state.userInfo?.name || '游客',

    // 获取用户头像（默认头像）
    avatarUrl: (state) => state.userInfo?.avatar || 'https://picsum.photos/seed/user-default/200',
  },

  actions: {
    // 登录
    login(phone: string, password: string) {
      // 模拟登录成功
      this.token = 'mock_token_' + Date.now()
      this.isLoggedIn = true
      this.userInfo = {
        id: 1,
        name: '用户_' + phone.slice(-4),
        avatar: `https://picsum.photos/seed/user_${phone}/200`,
        phone,
        memberLevel: '普通会员',
      }

      // 保存到本地存储
      localStorage.setItem('user_token', this.token)
      localStorage.setItem('user_info', JSON.stringify(this.userInfo))
    },

    // 登出
    logout() {
      this.token = ''
      this.isLoggedIn = false
      this.userInfo = null
      localStorage.removeItem('user_token')
      localStorage.removeItem('user_info')
    },

    // 初始化：从本地存储加载用户信息
    init() {
      if (this.token) {
        const savedInfo = localStorage.getItem('user_info')
        if (savedInfo) {
          try {
            this.userInfo = JSON.parse(savedInfo)
          } catch (e) {
            console.error('解析用户信息失败', e)
            this.logout() // 信息损坏时登出
          }
        }
      }
    },
  },
})

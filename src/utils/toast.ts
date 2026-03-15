// src/utils/toast.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let toastInstance: any = null

export function showToast(message: string, duration: number = 2000) {
  if (toastInstance) {
    clearTimeout(toastInstance)
  }

  // 创建toast元素
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-all transform translate-y-0 opacity-100'
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  toast.style.color = 'white'
  toast.style.borderRadius = '4px'
  toast.style.padding = '10px 15px'
  toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
  toast.style.zIndex = '9999'
  toast.textContent = message

  document.body.appendChild(toast)

  // 显示动画
  toast.style.opacity = '1'
  toast.style.transform = 'translateY(0)'

  // 定时隐藏
  toastInstance = setTimeout(() => {
    // 隐藏动画
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-20px)'

    // 移除元素
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, duration)
}

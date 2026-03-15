<template>
  <button :class="buttonClasses" :disabled="disabled" @click="handleClick" :type="type">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  // 按钮类型：主要、次要、文本
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'text'].includes(value)
  },
  // 按钮大小：小、中、大
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 按钮类型（submit/button）
  type: {
    type: String,
    default: 'button'
  },
  // 是否全宽显示
  fullWidth: {
    type: Boolean,
    default: false
  }
});

const buttonClasses = computed(() => {
  return [
    // 基础样式
    'font-medium',
    'rounded-lg', // 统一圆角
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-indigo-500',

    // 禁用状态
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',

    // 变体样式
    props.variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : '',
    props.variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      : '',
    props.variant === 'text'
      ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'
      : '',

    // 尺寸样式
    props.size === 'small'
      ? 'px-3 py-1.5 text-sm'
      : '',
    props.size === 'medium'
      ? 'px-4 py-2'
      : '',
    props.size === 'large'
      ? 'px-6 py-3 text-lg'
      : '',

    // 宽度样式
    props.fullWidth ? 'w-full' : ''
  ].join(' ');
});

const emit = defineEmits(['click']);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

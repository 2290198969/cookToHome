<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="min-h-screen bg-gray-50 pb-16 relative">
      <RouterView />
    </div>

  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center">
    <h1 class="text-6xl font-bold text-gray-300">404</h1>
    <p class="mt-4 text-gray-500">페이지를 찾을 수 없습니다.</p>
    <button
      class="mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      @click="router.push('/')"
    >
      홈으로 돌아가기
    </button>
  </main>
</template>

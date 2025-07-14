<template>
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
  <RouterView v-else />
  <Toaster />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)

onMounted(() => {
  // Check authentication immediately
  const isAuthenticated = authStore.checkAuth()
  
  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && router.currentRoute.value.path !== '/auth/signin') {
    router.push('/auth/signin')
  }
  
  // Set loading to false after auth check
  isLoading.value = false
})
</script>

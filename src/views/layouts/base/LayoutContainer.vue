<template>
  <div v-if="isLoading || isLoggingOut" class="flex items-center justify-center h-screen">
    <CustomSpinner />
    <div v-if="isLoggingOut" class="ml-3 text-gray-600">Logging out...</div>
  </div>
  <div v-else-if="isAuthenticated" class="flex h-screen overflow-hidden">
    <LayoutSidebar 
      :navigators="navigators" 
      v-model:collapsed="isCollapsed"
    />
    <div class="flex flex-col flex-grow">
      <ScrollArea class="flex-grow">
        <div class="space-y-2 pb-5">
          <RouterView/>
        </div>
      </ScrollArea>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-screen">
    <CustomSpinner />
    <div class="ml-3 text-gray-600">Redirecting to login...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import LayoutSidebar from '@/views/layouts/base/components/LayoutSidebar.vue'
import { NavigationModel } from '@/model/Navigation.ts'
import NavigationService from '@/services/Navigation.ts'
import CustomSpinner from '@/components/CustomSpinner.vue'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { ScrollArea } from '@/components/ui/scroll-area'

const router = useRouter()
const isCollapsed = ref(false)
const navigators = ref<NavigationModel[]>([])
const isLoading = ref(true)
const mainStore = useMainStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoggingOut = computed(() => authStore.isLoggingOut)

// Watch for authentication changes and immediately redirect
watch(isAuthenticated, (newValue, oldValue) => {
  if (oldValue === true && newValue === false && !authStore.isLoggingOut) {
    // User just lost authentication (not from our logout process)
    console.log('Authentication lost unexpectedly, redirecting to login...')
    router.push('/auth/signin')
  }
}, { immediate: false })

const handlerInitialize = () => {
  navigators.value = NavigationService.getNavigation()
}

const applyTheme = (theme: string) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  
  const themeColor = theme === 'dark' ? '#020817' : '#fff'
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  metaThemeColor?.setAttribute('content', themeColor)
}

onBeforeMount(async () => {
  isLoading.value = true
  
  if (!authStore.checkAuth()) {
    isLoading.value = false
    router.push('/auth/signin')
    return
  }
  
  try {
    await mainStore.fetchServices(undefined, 1, 100);
  } catch (error) {
    console.error('Error retrieving token or fetching initial services:', error);
  } finally {
    isLoading.value = false
  }
})

onMounted(() => {
  handlerInitialize()
  
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    applyTheme(storedTheme)
  } else {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    applyTheme(systemTheme)
  }
})
</script>

<style>
html {
  overflow: hidden;
}
</style>

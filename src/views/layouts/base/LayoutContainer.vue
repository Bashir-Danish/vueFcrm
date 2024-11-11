<template>
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <CustomSpinner />
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
  <div v-else>
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import LayoutSidebar from '@/views/layouts/base/components/LayoutSidebar.vue'
import { NavigationModel } from '@/model/Navigation.ts'
import NavigationService from '@/services/Navigation.ts'
import CustomSpinner from '@/components/CustomSpinner.vue'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { useToast } from "@/components/ui/toast/use-toast"
import { ScrollArea } from '@/components/ui/scroll-area'

const router = useRouter()
const isCollapsed = ref(false)
const navigators = ref<NavigationModel[]>([])
const isLoading = ref(true)
const mainStore = useMainStore()
const authStore = useAuthStore()
const { toast } = useToast()

const isAuthenticated = computed(() => authStore.isAuthenticated)

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
  if (!authStore.checkAuth()) {
    router.push('/auth/signin')
  } else {
    try {
      await mainStore.fetchServices(undefined, 1, 100);
    } catch (error) {
      console.error('Error retrieving token or fetching initial services:', error);
    }
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
  setTimeout(() => {
    isLoading.value = false
  }, 100)
})
</script>

<style>
html {
  overflow: hidden;
}
</style>

<template>
  <Button size="icon" variant="outline" class="rounded-full" @click="toggleTheme">
    <Moon v-if="theme === 'light'" :size="20"/>
    <Sun v-else :size="20"/>
  </Button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'

const theme = ref('dark')

const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (newTheme: string) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  const effectiveTheme = newTheme === 'dark' ? getSystemTheme() : newTheme
  root.classList.add(effectiveTheme)
  
  const themeColor = effectiveTheme === 'dark' ? '#020817' : '#fff'
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  metaThemeColor?.setAttribute('content', themeColor)
}

const setTheme = (newTheme: string) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
}

const toggleTheme = () => {
  const newTheme = theme.value === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
}

onMounted(() => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    setTheme(storedTheme)
  } else {
    setTheme('dark')
  }
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'dark') {
      applyTheme('dark')
    }
  })
})

watch(theme, (newTheme) => {
  applyTheme(newTheme)
})
</script>

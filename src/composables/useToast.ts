import { ref } from 'vue'

interface ToastOptions {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const isVisible = ref(false)
  const options = ref<ToastOptions>({
    title: '',
    description: '',
    variant: 'default'
  })

  const toast = (newOptions: ToastOptions) => {
    options.value = newOptions
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return {
    isVisible,
    options,
    toast
  }
}
<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ToastViewport, type ToastViewportProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<ToastViewportProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastViewport 
    v-bind="delegatedProps" 
    :class="cn(
      'fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4',
      'sm:flex-col md:max-w-[420px]',
      'bottom-0',
      'ltr:right-0 rtl:left-0',
      props.class
    )" 
  />
</template>

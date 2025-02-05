<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { ToastRoot, type ToastRootEmits, useForwardPropsEmits } from 'radix-vue'
import { type ToastProps, toastVariants } from '.'

interface Props extends ToastProps {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  direction: undefined
})

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Get current document direction
const currentDirection = computed(() => props.direction || (document.dir === 'rtl' ? 'rtl' : 'ltr'))
</script>

<template>
  <ToastRoot
    v-bind="forwarded" 
    :class="cn(toastVariants({ 
      variant: props.variant,
      direction: currentDirection
    }), props.class)"
    :data-direction="currentDirection"
    @update:open="(open:boolean) => $emit('update:open', open)"
  >
    <slot />
  </ToastRoot>
</template>

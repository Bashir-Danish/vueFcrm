<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CheckIcon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  checked?: boolean
  indeterminate?: boolean
  class?: string
}>()

const emit = defineEmits<{
  'update:checked': [value: boolean]
}>()

const checkbox = ref<HTMLInputElement | null>(null)

watch(() => props.indeterminate, (value) => {
  if (checkbox.value) {
    checkbox.value.indeterminate = !!value
  }
})

const inputClass = computed(() => 
  cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    props.class
  )
)
</script>

<template>
  <div class="relative flex items-center">
    <input
      ref="checkbox"
      type="checkbox"
      :checked="checked"
      :class="inputClass"
      @change="emit('update:checked', ($event.target as HTMLInputElement).checked)"
    />
    <CheckIcon 
      v-if="checked && !indeterminate"
      class="absolute left-[2px] top-[2px] h-3 w-3 text-primary-foreground" 
    />
    <div 
      v-if="indeterminate"
      class="absolute left-[2px] top-[2px] h-3 w-3 flex items-center justify-center"
    >
      <div class="h-[2px] w-[10px] bg-primary-foreground"></div>
    </div>
  </div>
</template>

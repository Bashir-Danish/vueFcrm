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
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background appearance-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'checked:bg-primary checked:border-primary checked:text-primary-foreground',
    props.class
  )
)
</script>

<template>
  <label class="relative flex items-center cursor-pointer select-none">
    <input
      ref="checkbox"
      type="checkbox"
      :checked="checked"
      :class="inputClass"
      @change="emit('update:checked', ($event.target as HTMLInputElement).checked)"
      :aria-checked="indeterminate ? 'mixed' : checked"
      :indeterminate="indeterminate"
    />
    <span
      v-if="checked && !indeterminate"
      class="pointer-events-none absolute left-0 top-0 flex items-center justify-center h-4 w-4"
    >
      <CheckIcon class="h-3 w-3 text-primary-foreground" />
    </span>
    <span
      v-if="indeterminate"
      class="pointer-events-none absolute left-0 top-0 flex items-center justify-center h-4 w-4"
    >
      <span class="h-[2px] w-[10px] bg-primary-foreground rounded"></span>
    </span>
  </label>
</template>

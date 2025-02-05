<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: string | number
  class?: HTMLAttributes['class']
  type?: string
  placeholder?: string
  required?: boolean
  id?: string
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputValue = computed<string | number>({
  get: () => props.modelValue !== undefined ? props.modelValue : '',
  set: (value: string | number) => emit('update:modelValue', value)
})
</script>

<template>
  <input
    v-model="inputValue"
    :class="cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :id="id"
    :name="name"
  >
</template>

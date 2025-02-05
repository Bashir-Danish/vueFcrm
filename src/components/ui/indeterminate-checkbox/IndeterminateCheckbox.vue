<script setup lang="ts">
defineProps<{
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: 'change', checked: boolean): void
}>()
</script>

<template>
  <label class="inline-flex cursor-pointer">
    <input
      type="checkbox"
      :checked="checked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      class="h-4 w-4 rounded border-gray-300 cursor-pointer appearance-none checked:bg-primary border checked:border-primary [&:indeterminate]:bg-primary [&:indeterminate]:border-primary relative"
      @change="$emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <div v-if="checked" class="absolute pointer-events-none">
      <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div v-else-if="indeterminate" class="absolute pointer-events-none">
      <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 12h14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </label>
</template>
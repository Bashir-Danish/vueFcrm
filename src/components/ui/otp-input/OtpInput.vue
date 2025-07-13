<template>
  <div class="grid grid-cols-6 gap-2">
    <template v-for="(_, index) in 6" :key="index">
      <input
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="modelValue[index] || ''"
        :disabled="disabled"
        :class="[
          'block w-full h-12 rounded-md border-0 py-1.5 text-center text-xl font-semibold shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
          status === 'error' ? 'ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500' 
            : 'ring-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-600',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
        ]"
        @input="handleInput($event, index)"
        @keydown="handleKeydown($event, index)"
        @paste="handlePaste"
        @focus="(e) => (e.target as HTMLInputElement).select()"
        :ref="(el) => { if (el) inputRefs[index] = el as HTMLInputElement }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
  status?: 'error' | 'loading'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}>()

const inputRefs = ref<HTMLInputElement[]>([])

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  // Only allow numbers
  value = value.replace(/\D/g, '')
  
  // Update the input value to show only the last digit
  input.value = value.slice(-1)

  // Create new value string
  const newValue = props.modelValue.split('')
  newValue[index] = value.slice(-1)
  const finalValue = newValue.join('')
  
  emit('update:modelValue', finalValue)

  // Move to next input if we have a value
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }

  // Emit complete event if all digits are filled
  if (finalValue.length === 6) {
    emit('complete', finalValue)
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const input = event.target as HTMLInputElement
  const key = event.key

  // Handle backspace
  if (key === 'Backspace') {
    event.preventDefault()
    
    // If current input has value, clear it
    if (input.value) {
      const newValue = props.modelValue.split('')
      newValue[index] = ''
      emit('update:modelValue', newValue.join(''))
    }
    // If current input is empty and not first input, move to previous
    else if (index > 0) {
      inputRefs.value[index - 1]?.focus()
    }
  }
  // Handle left arrow
  else if (key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputRefs.value[index - 1]?.focus()
  }
  // Handle right arrow
  else if (key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    inputRefs.value[index + 1]?.focus()
  }
  // Handle delete
  else if (key === 'Delete') {
    event.preventDefault()
    const newValue = props.modelValue.split('')
    newValue[index] = ''
    emit('update:modelValue', newValue.join(''))
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData) return

  // Extract only numbers and limit to 6 digits
  const numbers = pastedData.replace(/\D/g, '').slice(0, 6)
  emit('update:modelValue', numbers.padEnd(6, ''))

  // Focus the appropriate input
  if (numbers.length < 6) {
    inputRefs.value[numbers.length]?.focus()
  } else {
    inputRefs.value[5]?.focus()
    emit('complete', numbers)
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  // Ensure the value is always 6 characters (empty or numbers)
  if (newValue.length < 6) {
    emit('update:modelValue', newValue.padEnd(6, ''))
  }
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style> 
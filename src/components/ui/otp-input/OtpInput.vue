<template>
  <div class="flex gap-4 justify-center">
    <input
      v-for="(index) in 6"
      :key="index"
      type="text"
      inputmode="numeric"
      :value="digits[index]"
      @input="handleInput($event, index)"
      @keydown="handleKeydown($event, index)"
      @paste="handlePaste"
      maxlength="1"
      :disabled="disabled"
      class="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-background"
      :class="{
        'border-input': status === 'default',
        'border-green-500 ring-green-500': status === 'success',
        'border-red-500 ring-red-500': status === 'error'
      }"
      ref="inputRefs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'success', 'error'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'complete'])

const digits = ref(Array(6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

// Initialize from modelValue if provided
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const digitArray = newValue.split('').slice(0, 6)
    digits.value = [...digitArray, ...Array(6 - digitArray.length).fill('')]
  }
}, { immediate: true })

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  
  if (value) {
    digits.value[index] = value
    emit('update:modelValue', digits.value.join(''))
    
    // Move to next input
    if (index < 5) {
      inputRefs.value[index + 1]?.focus()
    }
    
    // Check if all digits are filled
    if (digits.value.join('').length === 6) {
      emit('complete', digits.value.join(''))
    }
  } else {
    // Clear the current input if the value is empty
    digits.value[index] = ''
    emit('update:modelValue', digits.value.join(''))
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    event.preventDefault() // Prevent default backspace behavior
    if (digits.value[index]) {
      // If current input has a value, clear it
      digits.value[index] = ''
      emit('update:modelValue', digits.value.join(''))
    } else if (index > 0) {
      // If current input is empty, move to previous input and clear it
      digits.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
      emit('update:modelValue', digits.value.join(''))
    }
  }
  // Handle left arrow
  else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  // Handle right arrow
  else if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData) return

  // Extract only numbers and limit to 6 digits
  const numbers = pastedData.replace(/[^0-9]/g, '').slice(0, 6)
  
  // Fill the inputs
  const newDigits = Array(6).fill('')
  numbers.split('').forEach((digit, index) => {
    if (index < 6) {
      newDigits[index] = digit
    }
  })
  
  digits.value = newDigits
  emit('update:modelValue', digits.value.join(''))

  // Focus the next empty input or the last input
  const nextEmptyIndex = digits.value.findIndex(digit => !digit)
  if (nextEmptyIndex !== -1) {
    inputRefs.value[nextEmptyIndex]?.focus()
  } else {
    inputRefs.value[5]?.focus()
  }
  
  // If all digits are filled, emit complete
  if (digits.value.join('').length === 6) {
    emit('complete', digits.value.join(''))
  }
}

// Clear all inputs method (exposed for parent component)
const clear = () => {
  digits.value = Array(6).fill('')
  inputRefs.value[0]?.focus()
}

defineExpose({ clear })
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  caret-color: transparent;
}

input[type="text"]:focus {
  caret-color: auto;
}
</style> 
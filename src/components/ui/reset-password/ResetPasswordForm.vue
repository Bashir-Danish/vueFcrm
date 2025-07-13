<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="password" class="block text-sm font-medium leading-6 text-gray-900">New Password</label>
      <div class="mt-2">
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            error ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600'
          ]"
        />
      </div>
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
      <div class="mt-2">
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          :class="[
            'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            error ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600'
          ]"
        />
      </div>
    </div>

    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? 'Resetting Password...' : 'Reset Password' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', password: string): void
}>()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')

watch([password, confirmPassword], () => {
  error.value = ''
})

const handleSubmit = () => {
  // Validate password
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }

  if (!/[A-Z]/.test(password.value)) {
    error.value = 'Password must contain at least one uppercase letter'
    return
  }

  if (!/[a-z]/.test(password.value)) {
    error.value = 'Password must contain at least one lowercase letter'
    return
  }

  if (!/[0-9]/.test(password.value)) {
    error.value = 'Password must contain at least one number'
    return
  }

  if (!/[!@#$%^&*]/.test(password.value)) {
    error.value = 'Password must contain at least one special character (!@#$%^&*)'
    return
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  emit('submit', password.value)
}
</script> 
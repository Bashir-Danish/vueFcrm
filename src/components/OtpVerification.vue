<!-- OTP Verification Component -->
<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <!-- Email Input Form -->
        <div v-if="!showOtpForm && !showPasswordReset && !showSuccess">
          <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            Forgot Password
          </h2>
          <p class="text-center text-sm text-gray-600 mb-8">
            Enter your email address and we'll send you a code to reset your password
          </p>

          <form class="space-y-6" @submit.prevent="handleSendOtp">
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  v-model="emailInput"
                  class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading || !emailInput"
                class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-black dark:text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Reset Code</span>
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm font-medium leading-6">
                <span class="bg-white px-6 text-gray-900">Or</span>
              </div>
            </div>

            <div class="mt-6 text-center text-sm">
              <router-link
                to="/auth/signin"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Back to Sign In
              </router-link>
            </div>
          </div>
        </div>

        <!-- OTP Verification Form -->
        <div v-else-if="showOtpForm && !showPasswordReset && !showSuccess">
          <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            Verify OTP
          </h2>
          <p class="text-center text-sm text-gray-600 mb-8">
            Please enter the 6-digit code sent to {{ emailInput }}
          </p>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- OTP Input -->
            <div class="px-4">
              <OtpInput
                v-model="otp"
                :disabled="loading"
                :dir="$i18n.locale === 'fa' ? 'rtl' : 'ltr'"
                :status="otpStatus"
                @complete="handleOtpComplete"
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm text-center mt-2">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <div class="mt-6">
              <button
                type="submit"
                :disabled="!isComplete || loading"
                class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-black dark:text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
                <span v-else>Verify OTP</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="relative mt-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm font-medium leading-6">
                <span class="bg-white px-6 text-gray-900">Didn't receive the code?</span>
              </div>
            </div>

            <!-- Resend Button -->
            <div class="mt-6 text-center">
              <button
                type="button"
                :disabled="loading || resendLoading || resendTimer > 0"
                @click="handleResend"
                class="font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="resendTimer > 0">Resend code in {{ resendTimer }}s</span>
                <span v-else-if="resendLoading">Sending...</span>
                <span v-else>Resend code</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Password Reset Form -->
        <div class="w-[350px] mx-auto" v-else-if="showPasswordReset && !showSuccess">
          <h2 class=" mx-auto text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            Reset Password
          </h2>
          <p class="text-center text-sm text-gray-600 mb-8">
            Please enter your new password
          </p>

          <form class="space-y-6" @submit.prevent="handlePasswordReset">
            <div>
              <label for="newPassword" class="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
              <div class="mt-2">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  v-model="newPassword"
                  class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div class="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  v-model="confirmPassword"
                  class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading || !newPassword || !confirmPassword || newPassword !== confirmPassword"
                class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-black dark:text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </span>
                <span v-else>Reset Password</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Success Message -->
        <div v-else-if="showSuccess" class="text-center space-y-6">
          <div class="rounded-full bg-green-100 p-3 mx-auto w-fit">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-gray-900">Password Reset Successfully</h2>
            <p class="mt-2 text-sm text-gray-600">
              Your password has been reset successfully. You can now login with your new password.
            </p>
          </div>
          <button
            type="button"
            @click="navigateToLogin"
            class="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import OtpInput from '@/components/ui/otp-input/OtpInput.vue'

const props = defineProps<{
  email?: string
}>()

const auth = useAuthStore()
const router = useRouter()
const { } = useI18n()

const emailInput = ref(props.email || '')
const showOtpForm = ref(!!props.email)
const showPasswordReset = ref(false)
const showSuccess = ref(false)
const otp = ref('')
const error = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const resendTimer = ref(0)
let resendInterval: number | null = null

// Password reset fields
const newPassword = ref('')
const confirmPassword = ref('')
const resetToken = ref('')

const otpStatus = computed(() => {
  if (error.value) return 'error'
  if (loading.value) return 'loading'
  return undefined
})

const isComplete = computed(() => {
  return otp.value.length === 6
})

const handleSendOtp = async () => {
  if (!emailInput.value) return

  loading.value = true
  error.value = ''

  const result = await auth.forgotPassword(emailInput.value)

  loading.value = false
  if (result.success) {
    showOtpForm.value = true
    resendTimer.value = 60
    startResendTimer()
  } else {
    error.value = result.message
  }
}

const handleOtpComplete = (value: string) => {
  error.value = ''
  if (value.length === 6) {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  if (!isComplete.value || loading.value) return

  loading.value = true
  error.value = ''

  try {
    const result = await auth.verifyOtp(emailInput.value, otp.value)

    if (!result.success) {
      throw new Error(result.message || 'Invalid OTP')
    }

    if (!result.resetToken) {
      throw new Error('No reset token received from server')
    }

    // Store the reset token and move to password reset step
    resetToken.value = result.resetToken
    showOtpForm.value = false
    showPasswordReset.value = true
  } catch (err) {
    console.error('OTP verification error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to verify OTP'
  } finally {
    loading.value = false
  }
}

const handlePasswordReset = async () => {
  if (!newPassword.value || !confirmPassword.value || newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await auth.resetPassword(resetToken.value, newPassword.value)

    if (!result.success) {
      throw new Error(result.message || 'Failed to reset password')
    }

    // Show success message
    showPasswordReset.value = false
    showSuccess.value = true
  } catch (err) {
    console.error('Password reset error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to reset password'
  } finally {
    loading.value = false
  }
}

const navigateToLogin = () => {
  router.push('/auth/signin')
}

const handleResend = async () => {
  resendLoading.value = true
  error.value = ''

  const result = await auth.forgotPassword(emailInput.value)

  resendLoading.value = false
  if (result.success) {
    resendTimer.value = 60
    startResendTimer()
  } else {
    error.value = result.message
  }
}

const startResendTimer = () => {
  if (resendInterval) {
    clearInterval(resendInterval)
  }
  resendInterval = window.setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else if (resendInterval) {
      clearInterval(resendInterval)
    }
  }, 1000)
}

onMounted(() => {
  if (showOtpForm.value) {
    // Start initial resend timer if showing OTP form
    resendTimer.value = 60
    startResendTimer()
  }
})

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval)
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
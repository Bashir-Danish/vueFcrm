<template>
  <div class="max-w-sm mx-auto">
    <div v-if="currentStep === 'otp'" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Verify OTP</h2>
        <p class="mt-2 text-sm text-gray-600">
          Please enter the verification code sent to your email
        </p>
      </div>

      <OtpInput
        v-model="otpValue"
        :disabled="loading"
        :status="otpError ? 'error' : undefined"
        @complete="handleOtpComplete"
      />

      <div v-if="otpError" class="text-sm text-red-600">{{ otpError }}</div>
    </div>

    <div v-else-if="currentStep === 'reset'" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Reset Password</h2>
        <p class="mt-2 text-sm text-gray-600">
          Please enter your new password
        </p>
      </div>

      <ResetPasswordForm
        :loading="loading"
        @submit="handlePasswordReset"
      />
    </div>

    <div v-else-if="currentStep === 'success'" class="text-center space-y-6">
      <div class="rounded-full bg-green-100 p-3 mx-auto w-fit">
        <CheckCircleIcon class="h-6 w-6 text-green-600" />
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleIcon } from 'lucide-vue-next'
import OtpInput from '../ui/otp-input/OtpInput.vue'
import ResetPasswordForm from '../ui/reset-password/ResetPasswordForm.vue'

const props = defineProps<{
  email: string
  token: string
}>()

const router = useRouter()
const currentStep = ref<'otp' | 'reset' | 'success'>('otp')
const loading = ref(false)
const otpValue = ref('')
const otpError = ref('')

const handleOtpComplete = async (otp: string) => {
  try {
    loading.value = true
    otpError.value = ''
    console.log('Verifying OTP...')

    // Call your API to verify the OTP
    const response = await fetch('/api/users/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: props.email,
        token: props.token,
        otp,
      }),
    })

    const data = await response.json()
    console.log('OTP verification response:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Invalid OTP')
    }

    console.log('OTP verified successfully, transitioning to reset step')
    // Move to password reset step
    currentStep.value = 'reset'
  } catch (error) {
    console.error('OTP verification error:', error)
    otpError.value = error instanceof Error ? error.message : 'Failed to verify OTP'
  } finally {
    loading.value = false
  }
}

const handlePasswordReset = async (password: string) => {
  try {
    loading.value = true

    // Call your API to reset the password
    const response = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: props.email,
        token: props.token,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to reset password')
    }

    // Show success message
    currentStep.value = 'success'
  } catch (error) {
    // Handle error appropriately
    console.error('Password reset failed:', error)
  } finally {
    loading.value = false
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script> 
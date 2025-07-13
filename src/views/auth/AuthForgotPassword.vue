<template>
  <div>
    <OtpVerification @verified="handleVerified" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OtpVerification from '@/components/OtpVerification.vue'

const router = useRouter()

const handleVerified = (token: string, email: string) => {
  // Navigate to reset password page with the token and email
  router.push({
    name: 'auth-reset-password',
    query: { token, email }
  })
}
</script> 
<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto mt-8">
      <div class="bg-card rounded-lg shadow-md p-8 border">
        <div class="mb-6 text-center">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">
            {{ $t('auth.resetPassword.title') }}
          </h1>
          <p class="text-muted-foreground">
            {{ $t('auth.resetPassword.description') }}
          </p>
        </div>

        <div 
          v-if="error" 
          class="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6 flex items-center gap-2"
        >
          <XCircle class="h-4 w-4" />
          {{ $t(`auth.resetPassword.errors.${error}`) }}
        </div>

        <!-- Step 1: Request OTP -->
        <div v-if="step === 1" class="space-y-4">
          <div class="text-center mb-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <EnvelopeIcon class="h-6 w-6 text-primary" />
            </div>
            <p class="text-sm text-muted-foreground">
              {{ $t('auth.resetPassword.requestOTP') }}
            </p>
          </div>
          
          <Button 
            @click="handleSendOTP" 
            class="w-full" 
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ $t('auth.resetPassword.sendOTP') }}
          </Button>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-if="step === 2" class="space-y-4">
          <div class="text-center mb-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <KeyIcon class="h-6 w-6 text-primary" />
            </div>
            <p class="text-sm text-muted-foreground">
              {{ $t('auth.resetPassword.enterOTP') }}
            </p>
          </div>

          <div class="space-y-2">
            <!-- <Label for="otp" :class="{ 'rtl:text-right': $i18n.locale === 'fa' }">
              {{ $t('auth.resetPassword.otp') }}
            </Label> -->
            <OtpInput
              v-model="form.otp"
              :disabled="loading"
              :dir="$i18n.locale === 'fa' ? 'rtl' : 'ltr'"
              :status="otpStatus"
              @complete="handleOtpComplete"
            />
          </div>
        </div>

        <!-- Step 3: New Password -->
        <div v-if="step === 3" class="space-y-4">
          <div class="text-center mb-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <LockIcon class="h-6 w-6 text-primary" />
            </div>
            <p class="text-sm text-muted-foreground">
              {{ $t('auth.resetPassword.enterNewPassword') }}
            </p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="newPassword" :class="{ 'rtl:text-right': $i18n.locale === 'fa' }">
                {{ $t('auth.resetPassword.newPassword') }}
              </Label>
              <div class="relative">
                <Input
                  id="newPassword"
                  v-model="form.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.resetPassword.newPasswordPlaceholder')"
                  :dir="$i18n.locale === 'fa' ? 'rtl' : 'ltr'"
                  class="password-input"
                  :class="{
                    'rtl:pl-10 rtl:pr-3': $i18n.locale === 'fa',
                    'ltr:pr-10 ltr:pl-3': $i18n.locale === 'en'
                  }"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  :class="{
                    'absolute inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors': true,
                    'rtl:left-0 rtl:pl-3': $i18n.locale === 'fa',
                    'ltr:right-0 ltr:pr-3': $i18n.locale === 'en'
                  }"
                >
                  <EyeIcon v-if="showNewPassword" class="h-4 w-4" />
                  <EyeOffIcon v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword" :class="{ 'rtl:text-right': $i18n.locale === 'fa' }">
                {{ $t('auth.resetPassword.confirmPassword') }}
              </Label>
              <div class="relative">
                <Input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.resetPassword.confirmPasswordPlaceholder')"
                  :dir="$i18n.locale === 'fa' ? 'rtl' : 'ltr'"
                  class="password-input"
                  :class="{
                    'rtl:pl-10 rtl:pr-3': $i18n.locale === 'fa',
                    'ltr:pr-10 ltr:pl-3': $i18n.locale === 'en'
                  }"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :class="{
                    'absolute inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors': true,
                    'rtl:left-0 rtl:pl-3': $i18n.locale === 'fa',
                    'ltr:right-0 ltr:pr-3': $i18n.locale === 'en'
                  }"
                >
                  <EyeIcon v-if="showConfirmPassword" class="h-4 w-4" />
                  <EyeOffIcon v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ $t('auth.resetPassword.submit') }}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Loader2, 
  Mail as EnvelopeIcon, 
  Key as KeyIcon, 
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  XCircle
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import OtpInput from '@/components/ui/otp-input/OtpInput.vue'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const step = ref(1)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  otp: '',
  newPassword: '',
  confirmPassword: '',
  resetToken: ''
})

const otpStatus = ref<'default' | 'success' | 'error'>('default')

const handleSendOTP = async () => {
  try {
    error.value = ''
    loading.value = true
    otpStatus.value = 'default'

    const userEmail = authStore.user?.email
    if (!userEmail) {
      throw new Error('userNotFound')
    }

    await authStore.forgotPassword({ email: userEmail })
    
    toast({
      title: t('auth.resetPassword.success.otpSent'),
      description: userEmail,
      variant: 'default',
    })
    
    step.value = 2
  } catch (err: any) {
    const errorMapping: Record<string, string> = {
      'NOT_FOUND': 'userNotFound',
      'RATE_LIMIT': 'tooManyAttempts'
    }
    
    error.value = errorMapping[err.code] || 'emailSendFailed'
    toast({
      title: t('auth.errors.error'),
      description: t(`auth.resetPassword.errors.${error.value}`),
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

const handleOtpComplete = async (value: string) => {
  try {
    loading.value = true
    error.value = ''
    otpStatus.value = 'default'
    
    const response = await authStore.verifyOTP({
      email: authStore.user?.email,
      otp: value
    })
    
    otpStatus.value = 'success'
    form.value.resetToken = response.resetToken
    
    // Wait a brief moment to show the success state
    setTimeout(() => {
      toast({
        title: t('auth.resetPassword.success.otpVerified'),
        description: t('auth.resetPassword.enterNewPassword'),
        variant: 'default',
      })
      step.value = 3
    }, 500)
  } catch (err: any) {
    otpStatus.value = 'error'
    
    // Map backend errors to translation keys
    const errorMapping: Record<string, string> = {
      'INVALID_OTP': 'invalidOTP',
      'OTP_EXPIRED': 'expiredOTP',
      'MAX_ATTEMPTS_REACHED': 'tooManyAttempts',
      'NOT_FOUND': 'userNotFound'
    }

    error.value = errorMapping[err.code] || 'failed'
    
    toast({
      title: t('auth.errors.error'),
      description: t(`auth.resetPassword.errors.${error.value}`),
      variant: 'destructive',
    })

    // If OTP is expired or max attempts reached, go back to step 1
    if (['OTP_EXPIRED', 'MAX_ATTEMPTS_REACHED'].includes(err.code)) {
      setTimeout(() => {
        step.value = 1
        otpStatus.value = 'default'
        form.value.otp = ''
      }, 2000)
    }
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  try {
    error.value = ''
    loading.value = true

    if (form.value.newPassword !== form.value.confirmPassword) {
      error.value = 'passwordMismatch'
      return
    }

    if (form.value.newPassword.length < 6) {
      error.value = 'passwordLength'
      return
    }

    await authStore.resetPassword({
      resetToken: form.value.resetToken,
      newPassword: form.value.newPassword
    })

    toast({
      title: 'Success',
      description: t('auth.resetPassword.success.passwordReset'),
    })

    router.push('/auth/signin')
  } catch (err: any) {
    error.value = err.message || 'failed'
    toast({
      title: t('auth.errors.error'),
      description: t(`auth.resetPassword.errors.${error.value}`),
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Hide default password toggle in MS Edge */
::-ms-reveal,
::-ms-clear {
  display: none !important;
}

/* Hide default password toggle in Chrome */
input[type="password"]::-webkit-contacts-auto-fill-button,
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-password-generation-button,
input[type="password"]::-webkit-inner-spin-button {
  display: none !important;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
}

/* Only apply disc security to password type inputs */
input[type="password"].password-input {
  -webkit-text-security: disc !important;
}
</style> 
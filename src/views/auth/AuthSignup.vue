<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-3xl font-semibold">
        {{ isInvited ? t('auth.register.completeRegistration') : t('auth.register.header') }}
      </h1>
    </div>
    <div class="space-y-4">
      <div>
        <Label for="name">{{ t('auth.register.name') }}</Label>
        <Input
          id="name"
          type="text"
          v-model="info.name"
          required
        />
      </div>
      <div>
        <Label for="email">{{ t('auth.register.email') }}</Label>
        <Input
          id="email"
          type="email"
          v-model="info.email"
          required
          :disabled="isInvited"
        />
      </div>
      <div>
        <Label for="password">{{ t('auth.register.password') }}</Label>
        <Input
          id="password"
          type="password"
          v-model="info.password"
          required
        />
      </div>
    </div>
    <Button
      type="submit"
      class="w-full"
      :disabled="isLoading"
    >
      {{ isInvited ? t('auth.register.completeButton') : t('auth.register.button') }}
    </Button>
    <div v-if="!isInvited" class="text-center text-sm">
      {{ t('auth.register.link-text') }}
      <RouterLink to="/auth/signin" class="text-blue-600 hover:underline">
        {{ t('auth.register.link') }}
      </RouterLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()
const { toast } = useToast()
const { t } = useI18n()

const info = ref({ name: '', email: '', password: '' })
const isLoading = ref(false)
const isInvited = ref(false)
const invitationToken = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    invitationToken.value = token
    isInvited.value = true
    try {
      const response = await axios.get(`/api/users/verify-invitation?token=${token}`)
      info.value.name = response.data.user.name
      info.value.email = response.data.user.email
    } catch (error) {
      console.error('Error verifying invitation token:', error)
      toast({
        variant: 'destructive',
        title: 'Invalid Invitation',
        description: t('auth.errors.invalid-invitation'),
      })
      router.push('/auth/signin')
    }
  } else if (authStore.isLoggedIn) {
    router.push('/')
  }
})

const onSubmit = async () => {
  if (!info.value.name || !info.value.email || !info.value.password) {
    toast({
      variant: 'destructive',
      title: 'Validation Error',
      description: t('auth.errors.fill-all'),
    })
    return
  }

  isLoading.value = true
  try {
    if (isInvited.value) {
      await userStore.updateInvitedUser({
        token: invitationToken.value,
        name: info.value.name,
        password: info.value.password
      })
      toast({
        variant: 'default',
        title: 'Registration Completed',
        description: t('auth.success.registration-complete'),
      })
    } else {
      await userStore.register({
        name: info.value.name,
        email: info.value.email,
        password: info.value.password
      })
      toast({
        variant: 'default',
        title: 'Registration Successful',
        description: t('auth.success.registration'),
      })
    }
    router.push('/auth/signin')
  } catch (error: unknown) {
    console.error('Registration error:', error)
    toast({
      variant: 'destructive',
      title: 'Registration Error',
      description: (error as any).response?.data?.message || t('auth.errors.registration'),
    })
  } finally {
    isLoading.value = false
  }
}
</script>
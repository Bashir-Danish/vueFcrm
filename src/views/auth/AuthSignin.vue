<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-3xl font-semibold">{{ $t('auth.login.header') }}</h1>
    </div>
    <div class="space-y-4">
      <div>
        <Label for="email">{{ $t('auth.login.email') }}</Label>
        <Input
          id="email"
          type="email"
          v-model="info.email"
          required
          placeholder="m@example.com"
        />
      </div>
      <div>
        <div class="flex items-center justify-between">
          <Label for="password">{{ $t('auth.login.password') }}</Label>
          <RouterLink to="/auth/forgot-password" class="text-sm text-blue-600 hover:underline">
            {{ $t('auth.login.forgot') }}
          </RouterLink>
        </div>
        <div class="relative">
          <Input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="info.password"
            required
            placeholder="********"
            class="password-input"
            :class="{
              'rtl:pl-10 rtl:pr-3': $i18n.locale === 'fa',
              'ltr:pr-10 ltr:pl-3': $i18n.locale === 'en'
            }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :class="{
              'absolute inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors': true,
              'rtl:left-0 rtl:pl-3': $i18n.locale === 'fa',
              'ltr:right-0 ltr:pr-3': $i18n.locale === 'en'
            }"
          >
            <EyeIcon v-if="showPassword" class="h-4 w-4" />
            <EyeOffIcon v-else class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    <Button
      type="submit"
      class="w-full"
      :disabled="pending"
    >
      {{ $t('auth.login.button') }}
    </Button>
    <div class="text-center text-sm">
      {{ $t('auth.login.link-text') }}
      <RouterLink to="/auth/signup" class="text-blue-600 hover:underline">
        {{ $t('auth.login.link') }}
      </RouterLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { toast } = useToast();
const authStore = useAuthStore();
const { t } = useI18n();

const info = ref({ email: '', password: '' });
const pending = ref(false);
const showPassword = ref(false);

const onSubmit = async () => {
  if (!info.value.email || !info.value.password) {
    toast({
      variant: 'destructive',
      title: t('auth.errors.validation'),
      description: t('auth.errors.fill-all'),
    });
    return;
  }

  try {
    pending.value = true;
    const result = await authStore.login(info.value.email, info.value.password);
    
    if (result.success) {
      toast({
        title: t('auth.success.login'),
        description: result.message || t('auth.success.welcome'),
      });
      console.log(result.message);
      await router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: t('auth.errors.login-failed'),
        description: result.message || t('auth.errors.sign-in'),
      });
      console.log(result.message);
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast({
      variant: 'destructive',
      title: t('auth.errors.error'),
      description: error.response?.data?.message || t('auth.errors.sign-in'),
    });
  } finally {
    pending.value = false;
  }
};
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

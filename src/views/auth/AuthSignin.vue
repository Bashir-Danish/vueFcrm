<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-3xl font-semibold">{{ $t('Auth.login.header') }}</h1>
    </div>
    <div class="space-y-4">
      <div>
        <Label for="email">{{ $t('Auth.login.email') }}</Label>
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
          <Label for="password">{{ $t('Auth.login.password') }}</Label>
          <RouterLink to="/auth/forgot-password" class="text-sm text-blue-600 hover:underline">
            {{ $t('Auth.login.forgot') }}
          </RouterLink>
        </div>
        <Input
          id="password"
          type="password"
          v-model="info.password"
          required
          placeholder="********"
        />
      </div>
    </div>
    <Button
      type="submit"
      class="w-full"
      :disabled="pending"
    >
      {{ $t('Auth.login.button') }}
    </Button>
    <div class="text-center text-sm">
      {{ $t('Auth.login.link-text') }}
      <RouterLink to="/auth/signup" class="text-blue-600 hover:underline">
        {{ $t('Auth.login.link') }}
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

const router = useRouter();
const { toast } = useToast();
const authStore = useAuthStore();

const info = ref({ email: '', password: '' });
const pending = ref(false);

const onSubmit = async () => {
  if (!info.value.email || !info.value.password) {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: 'Please fill in all fields.',
    });
    return;
  }

  try {
    pending.value = true;
    const loginResult = await authStore.login(info.value.email, info.value.password);
    console.log('Login result:', loginResult);
    
    if (loginResult) {
      console.log('Login successful, attempting to redirect...');
      await router.push('/');
      console.log('Redirection should have occurred');
    } else {
      console.log('Login failed');
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
      });
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast({
      variant: 'destructive',
      title: 'Sign in error',
      description: error.response?.data?.message || error.message || 'An error occurred during sign in.',
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div class="mx-auto px-4 py-8">
    <div v-if="isLoading || !user" class="container mx-auto px-4 py-8">
      <div class="shadow-xl rounded-lg overflow-hidden">
        <div class="h-48 w-full bg-gray-200 animate-pulse"></div>
        <div class="px-8 py-6">
          <div class="flex flex-col md:flex-row items-center">
            <div class="w-[120px] h-[120px] rounded-full bg-gray-200 animate-pulse"></div>
            <div class="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
              <div class="h-8 w-48 mb-2 bg-gray-200 animate-pulse"></div>
              <div class="h-6 w-32 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="index in 4" :key="index" class="h-16 w-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else
      :class="[
        'shadow-xl rounded-lg overflow-hidden transition-all duration-500',
        { 'opacity-100 translate-y-0': animate, 'opacity-0 translate-y-10': !animate }
      ]"
    >
      <div class="bg-gradient-to-r from-primary/40 to-secondary/5 dark:from-primary/40 dark:to-secondary/5 h-48 relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/5 dark:from-primary/40 dark:to-secondary/5 transition-all duration-300 group-hover:from-primary/50 group-hover:to-secondary/10"></div>
          <div class="absolute top-0 left-0 w-full h-full bg-repeat opacity-20 transition-opacity duration-300 group-hover:opacity-30"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-secondary/20 transition-opacity duration-300 group-hover:opacity-75"></div>
          <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent transition-all duration-300 group-hover:h-24"></div>
          <div class="absolute -top-4 -right-1 w-20 h-20 rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110"></div>
          <div class="absolute -bottom-5 left-4 w-28 h-28 rounded-full bg-secondary/20 transition-all duration-300 group-hover:bg-secondary/30 group-hover:scale-110"></div>
          <div class="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/5 rounded-full transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-150 group-hover:blur-sm"></div>
          <div class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div class="absolute top-2 right-2 w-4 h-4 bg-primary/50 rounded-full"></div>
            <div class="absolute bottom-6 left-8 w-3 h-3 bg-secondary/50 rounded-full"></div>
            <div class="absolute top-1/4 left-1/4 w-5 h-5 bg-accent/50 rounded-full"></div>
          </div>
        </div>
      </div>
      <div class="px-8 py-6">
        <div class="flex flex-col md:flex-row items-center">
          <Avatar
            :class="[
              'w-[120px] h-[120px] text-4xl cursor-pointer shadow-lg -mt-20 border border-border transition-all duration-500',
              { 'scale-100': animate, 'scale-0': !animate }
            ]"
          >
            <AvatarImage v-if="user.avatar" :src="user.avatar" alt="User avatar" />
            <AvatarFallback v-else>{{ initials }}</AvatarFallback>
          </Avatar>
          <div
            :class="[
              'md:ml-8 mt-4 md:mt-0 text-center md:text-left transition-all duration-500 delay-100',
              { 'opacity-100 translate-x-0': animate, 'opacity-0 -translate-x-10': !animate }
            ]"
          >
            <h1 class="text-3xl font-extrabold text-foreground capitalize">{{ user.name }}</h1>
            <p class="text-xl text-muted-foreground capitalize">{{ user.role }}</p>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProfileItem
            :icon="Mail"
            label="Email"
            :value="user.email"
            :delay="200"
            :animate="animate"
          />
          <ProfileItem
            :icon="Building2"
            label="Branch"
            :value="user.branch_id ? `${user.branch_id.name}, ${user.branch_id.location}` : 'N/A'"
            :delay="400"
            :animate="animate"
          />
          <ProfileItem
            :icon="UserCog"
            label="Role"
            :value="user.role"
            :delay="500"
            :animate="animate"
          />
          <ProfileItem
            :icon="CreditCard"
            label="Cart ID"
            :value="user.cartId?.toString() || 'N/A'"
            :delay="300"
            :animate="animate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ProfileItem from '@/views/pages/profile/ProfileItem.vue'
import { Mail, Building2, UserCog, CreditCard } from 'lucide-vue-next';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const authStore = useAuthStore();
const isLoading = ref(true);
const animate = ref(false);

const user = computed(() => authStore.user);

const initials = computed(() => {
  if (!user.value?.name) return '';
  const nameParts = user.value.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
});

// const capitalizeFirstLetter = (string: string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

// Create icon components
// const icons = { Mail, Building2, UserCog, CreditCard };

onMounted(() => {
  if (user.value) {
    isLoading.value = false;
    setTimeout(() => animate.value = true, 100);
  }
});
</script>

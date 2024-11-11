<template>
  <div>
    <Collapsible v-if="navigator.children && navigator.children.length > 0" v-model:open="isOpen" class="cursor-pointer">
      <CollapsibleTrigger as-child>
        <Button as="a" size="sm" class="flex items-center justify-between text-wrap rounded-md h-10 w-full px-2 select-none"
                :variant="$route.path === navigator.href ? 'secondary' : 'ghost'">
          <div class="flex items-center w-full" :class="{ 'flex-row-reverse ': isRTL }">
            <component :is="navigator.icon"/>
            <div :class="isRTL ? 'mr-2' : 'ml-2'" class="select-none ">{{ typeof navigator.label === 'string' ? $t(navigator.label) : navigator.label({ pathname: $route.path, customerId: undefined }) }}</div>
            <ChevronUp :class="[`${isOpen ? 'rotate-0' : 'rotate-180'}`, isRTL ? 'mr-auto' : 'ml-auto']"/>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent class="space-y-2">
        <NavigationRouterLink v-for="item in navigator.children" :key="item.href" :external="item.external" :link="item.href"
                              :class="!isRTL ? 'ml-10' : '-ml-5'" class="my-1">
          <Button as="a" size="sm" class="text-wrap rounded-md h-10 w-full px-2 select-none"
                  :variant="$route.path === item.href ? 'secondary' : 'ghost'">
            <div class="flex items-center w-full gap-2" :class="{ 'flex-row-reverse ': isRTL }">
              <component :is="item.icon"/>
              <div class="select-none">{{ typeof item.label === 'string' ? $t(item.label) : item.label({ pathname: $route.path, customerId: undefined }) }}</div>
            </div>
          </Button>
        </NavigationRouterLink>
      </CollapsibleContent>
    </Collapsible>
    <NavigationRouterLink v-else :external="navigator.external" :link="navigator.href">
      <Button as="a" size="sm" 
              class="text-wrap rounded-md h-10 w-full px-2 select-none"
              :variant="$route.path === navigator.href ? 'default' : 'ghost'"
              :class="$route.path === navigator.href ? 'bg-primary text-primary-foreground' : ''">
        <div class="flex items-center w-full" :class="{ 'flex-row-reverse ': isRTL }">
          <component :is="navigator.icon"/>
          <div :class="isRTL ? 'mr-2' : 'ml-2'" class="select-none">{{ typeof navigator.label === 'string' ? $t(navigator.label) : navigator.label({ pathname: $route.path, customerId: undefined }) }}</div>
        </div>
      </Button>
    </NavigationRouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import NavigationRouterLink from './NavigationRouterLink.vue';
import { ChevronUp } from 'lucide-vue-next';
import { NavigationModel } from '@/model/Navigation';

defineProps<{
  navigator: NavigationModel
}>();

const { locale } = useI18n();
const isRTL = computed(() => locale.value === 'fa');
const isOpen = ref(false);
</script>
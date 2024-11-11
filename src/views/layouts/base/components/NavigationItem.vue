<template>
  <li>
    <NavigationMenuLink as-child>
      <NavigationRouterLink :external="navigator?.external" :link="navigator?.href"
                            :class="cn('block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              'pl-5 pr-5 pt-3 pb-2',
                              $route.path === navigator?.href && 'bg-muted hover:bg-muted')">
        <div class="text-sm font-medium leading-none">
          {{ typeof navigator?.label === 'function' 
              ? navigator.label({ pathname: $route.path, customerId: undefined }) 
              : $t(navigator?.label as string) }}
        </div>
        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
          <slot/>
        </p>
      </NavigationRouterLink>
    </NavigationMenuLink>
  </li>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { NavigationModel } from '@/model/Navigation'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import NavigationRouterLink from '@/views/layouts/base/components/components/NavigationRouterLink.vue'

defineProps<{
  navigator?: NavigationModel
}>()

</script>

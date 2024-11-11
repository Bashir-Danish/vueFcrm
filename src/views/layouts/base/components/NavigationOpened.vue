<template>
  <div class="gap-1 select-none">
    <DropdownMenu v-if="navigator.children && navigator.children.length > 0">
      <DropdownMenuTrigger class="cursor-pointer select-none" as-child>
        <Button as="a" size="icon" class="h-10 w-10 select-none" :variant="$route.path === navigator.href ? 'secondary' : 'ghost'">
          <TooltipProvider>
            <Tooltip :delay-duration="0">
              <TooltipTrigger asChild>
                <Button as="a" size="icon" class="h-10 w-10 select-none" :variant="$route.path === navigator.href ? 'secondary' : 'ghost'">
                  <component :is="navigator.icon" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" class="flex items-center gap-4 select-none">
                {{ typeof navigator.label === 'string' ? $t(navigator.label) : navigator.label({ pathname: $route.path, customerId: undefined }) }}
                <span v-if="navigator.children.length" class="ml-auto text-muted-foreground select-none">({{ navigator.children.length }})</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" class="select-none">
        <DropdownMenuLabel class="select-none">
          {{ typeof navigator.label === 'string' ? $t(navigator.label) : navigator.label({ pathname: $route.path, customerId: undefined }) }}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-for="item in navigator.children" :key="item.href" class="cursor-pointer select-none">
          <NavigationRouterLink :external="item.external" :link="item.href">
            <Button as="a" size="sm" class="justify-start text-wrap rounded-none w-full select-none" :variant="$route.path === item.href ? 'secondary' : 'ghost'">
              <component :is="item.icon" />
              <div class="ml-2 max-w-52 text-wrap select-none">
                {{ typeof item.label === 'string' ? $t(item.label) : item.label({ pathname: $route.path, customerId: undefined }) }}
              </div>
            </Button>
          </NavigationRouterLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <NavigationRouterLink v-else :external="navigator.external" :link="navigator.href">
      <TooltipProvider>
        <Tooltip :delay-duration="0">
          <TooltipTrigger asChild>
            <Button as="a" size="icon" class="h-10 w-10 select-none" :variant="$route.path === navigator.href ? 'secondary' : 'ghost'">
              <component :is="navigator.icon" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center gap-4 select-none">
            {{ typeof navigator.label === 'string' ? $t(navigator.label) : navigator.label({ pathname: $route.path, customerId: undefined }) }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </NavigationRouterLink>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NavigationRouterLink from './NavigationRouterLink.vue';
import { NavigationModel } from '@/model/Navigation';

defineProps<{
  navigator: NavigationModel
}>();
</script>

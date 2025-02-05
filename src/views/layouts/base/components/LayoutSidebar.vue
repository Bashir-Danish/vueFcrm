<template>
  <aside
    :class="
      cn(
        `h-full relative border-r-1 bg-card transition-all duration-300 shadow ${isCollapsed ? 'w-14' : 'w-64'}`,
        {
          'border-l border-r-0': isRTL,
          'border-r border-l-0': !isRTL,
        }
      )
    "
  >
    <nav
      class="h-full flex flex-col justify-between"
      :class="{
        'border-l shadow-sm': !isRTL,
        'border-r shadow-sm': isRTL,
      }"
    >
      <!-- Logo or Icon -->
      <div
        :class="
          cn(
            `flex items-center h-16 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`
          )
        "
      >
        <h1 v-if="!isCollapsed" class="text-xl font-bold select-none">FrCRM</h1>
        <span v-else class="text-xl font-bold select-none">Fr</span>
        <Button
          variant="outline"
          size="icon"
          @click="toggleCollapse"
          :class="
            cn(
              'absolute top-10 hidden rounded-full md:inline-flex z-10 w-7 h-7 p-0',
              {
                '-left-3': isRTL,
                '-right-3': !isRTL,
              }
            )
          "
        >
          <ChevronLeft
            :class="
              cn('h-4 w-4', {
                'rotate-180': !isRTL ? isCollapsed : !isCollapsed,
                'rotate-0': !isRTL ? !isCollapsed : isCollapsed,
              })
            "
          />
        </Button>
      </div>

      <!-- Navigation links -->
      <ScrollArea class="flex-1">
        <ul class="px-2 py-2">
          <template v-for="link in filteredLinks" :key="link.route">
            <li
              :class="{
                flex: isCollapsed,
                'justify-start': !isRTL,
                'justify-end': isRTL,
              }"
              class="pb-1"
            >
              <NavigationOpened v-if="isCollapsed" :navigator="link" />
              <NavigationClosed v-else :navigator="link" />
            </li>
          </template>
        </ul>
      </ScrollArea>

      <!-- User section -->
      <div class="mt-auto p-2 z-20 border-t">
        <div class="flex items-center justify-between">
          <div v-if="!isCollapsed" class="flex items-center">
            <NavigationUser />
            <span
              v-if="!isCollapsed"
              :class="['ml-2 capitalize select-none', { 'ml-0 mr-2': isRTL }]"
            >
              {{ authStore.user?.name || "User" }}
            </span>
          </div>
          <div v-if="!isCollapsed" class="flex items-center gap-1">
            <NotificationNavigation />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings class="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-56 z-30">
                <div class="grid gap-4">
                  <div class="space-y-2">
                    <h4 class="font-medium leading-none select-none">
                      {{ $t("sidebar.settings") }}
                    </h4>
                    <!-- <p class="text-sm text-muted-foreground select-none">
                      {{ $t("sidebar.adjustPreferences") }}
                    </p> -->
                  </div>
                  <div class="flex gap-2">
                    <LanguageSwitcher class="flex-1" />
                    <ThemeSwitcher class="flex-1" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Popover v-if="isCollapsed">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                class="min-h-[35px] min-w-[35px]"
              >
                <MoreVertical class="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-72 z-30">
              <div class="grid gap-4">
                <RouterLink to="/profile" class="hover:bg-muted rounded-md p-2">
                  <div class="flex items-center gap-3 select-none">
                    <Button size="icon" class="rounded-full" variant="outline">
                      <User class="h-5 w-5" />
                    </Button>
                    <div class="flex flex-col items-start">
                      <span class="font-medium">{{
                        authStore.user?.name || "User"
                      }}</span>
                      <span class="text-sm text-muted-foreground">{{
                        authStore.user?.email
                      }}</span>
                      <!-- <div
                        class="px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        <p class="text-xs font-medium capitalize select-none">
                          {{ authStore.user?.role || "No role" }}
                        </p>
                      </div> -->
                      <span
                        class="select-none text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize"
                        >{{ authStore.user?.role }}</span
                      >
                    </div>
                  </div>
                </RouterLink>
                <div class="space-y-2">
                  <h4 class="font-medium leading-none select-none">
                    {{ $t("sidebar.settings") }}
                  </h4>
                </div>
                <div class="grid gap-2">
                  <div class="flex gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    <NotificationNavigation />
                  </div>
                  <Button
                    variant="destructive"
                    class="w-full"
                    @click="authStore.logout"
                  >
                    {{ $t("sidebar.logout") }}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button/index";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import {
  Settings,
  MoreVertical,
  ChevronLeft,
  User,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import NavigationOpened from "./NavigationOpened.vue";
import NavigationClosed from "./NavigationClosed.vue";
import NavigationUser from "./NavigationUser.vue";
import NotificationNavigation from "./NotificationNavigation.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import roleBasedSidebarLinks from "@/constants";
import { NavigationModel } from "@/model/Navigation";
import { useAuthStore } from "@/stores/auth";

const { locale } = useI18n();
const authStore = useAuthStore();
const isCollapsed = ref(false);

const isRTL = computed(() => locale.value === "fa");

const filteredLinks = computed(() => {
  const userRole = authStore.user?.role || "";
  return roleBasedSidebarLinks.filter(
    (link) => link.access.includes(userRole) && link.show
  ) as NavigationModel[];
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

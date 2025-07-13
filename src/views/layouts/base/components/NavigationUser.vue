<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="icon" class="rounded-full" variant="outline">
        <User class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-64">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium leading-none capitalize select-none">
                {{ authStore.user?.name || "User" }}
              </p>
              <p class="text-xs text-muted-foreground mt-1 select-none">
                {{ authStore.user?.email || "No email" }}
              </p>
            </div>
            <div class="px-2 py-1 rounded-full bg-primary/10 text-primary">
              <p class="text-xs font-medium capitalize select-none">
                {{ authStore.user?.role || "No role" }}
              </p>
            </div>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="flex items-center select-none" @click="navigateToProfile">
          <User class="mr-2 h-4 w-4" />
          <span class="select-none">Profile</span>
          <!-- <DropdownMenuShortcut>⌘P</DropdownMenuShortcut> -->
        </DropdownMenuItem>
        <DropdownMenuItem class="flex items-center select-none" @click="navigateToResetPassword">
          <LockIcon class="mr-2 h-4 w-4" />
          <span class="select-none">{{ $t('auth.resetPassword.title') }}</span>
        </DropdownMenuItem>
        <!-- <DropdownMenuSub>
          <DropdownMenuSubTrigger class="cursor-pointer flex items-center">
            <Code class="mr-2 h-4 w-4" />
            <span class="select-none">{{ $t('common.common.codeMirror') }}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <a href="https://github.com/devlive-community/shadcn-ui-vue-admin" target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem class="cursor-pointer flex items-center select-none">
                  <Github class="mr-2 h-4 w-4" />
                  <span class="select-none">GitHub</span>
                </DropdownMenuItem>
              </a>
              <a href="https://gitee.com/devlive-community/shadcn-ui-vue-admin" target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem class="cursor-pointer flex items-center select-none">
                  <GitBranch class="mr-2 h-4 w-4" />
                  <span class="select-none">Gitee</span>
                </DropdownMenuItem>
              </a>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub> -->
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="cursor-pointer flex items-center select-none"
        @click="handleLogout"
      >
        <LogOut class="mr-2 h-4 w-4" />
        <span class="select-none">{{   $t("sidebar.logout") }}</span>
        <!-- <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> -->
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/index";
import { User, LogOut, Lock as LockIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  // No need to redirect here as it's already handled in the auth store
};

const navigateToProfile = () => {
  router.push("/profile");
};

const navigateToResetPassword = () => {
  router.push("/profile/reset-password");
};
</script>

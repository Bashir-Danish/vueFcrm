<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { MoreHorizontal } from "lucide-vue-next";
import AddUserDialog from "@/components/users/AddUserDialog.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { User } from "@/types/types";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: "user-updated"): void;
}>();

const userStore = useUserStore();
const { toast } = useToast();

const showUpdateDialog = ref(false);
const isOpen = ref(false);
const editingUser = ref<User | undefined>(undefined);

const handleCopyId = () => {
  navigator.clipboard.writeText(props.user._id);
  toast({
    title: t('users.notifications.idCopied.title'),
    description: t('users.notifications.idCopied.description'),
  });
  isOpen.value = false;
};

const handleDelete = async () => {
  try {
    await userStore.deleteUser(props.user._id);
    toast({
      title: t('users.notifications.deleted.title'),
      description: t('users.notifications.deleted.description'),
    });
    emit("user-updated");
  } catch (error) {
    console.error("Error deleting user:", error);
    toast({
      title: t('users.notifications.error.title'),
      description: t('users.notifications.error.description'),
      variant: "destructive",
    });
  }
  isOpen.value = false;
};

const handleUpdate = () => {
  editingUser.value = { ...props.user };
  showUpdateDialog.value = true;
  isOpen.value = false;
};

const handleUpdateComplete = () => {
  showUpdateDialog.value = false;
  editingUser.value = undefined;
  emit("user-updated");
};
</script>

<template>
  <div>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as="div" class="flex items-center justify-center h-4">
        <Button variant="ghost" size="icon">
          <MoreHorizontal :size="16" class="text-gray-500 hover:text-gray-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-40 p-0">
        <Button variant="ghost" class="w-full text-start" @click="handleCopyId">
          {{ t('users.actions.copyId') }}
        </Button>
        <Button variant="ghost" class="w-full text-start" @click="handleDelete">
          {{ t('users.actions.delete') }}
        </Button>
        <Button variant="ghost" class="w-full text-start" @click="handleUpdate">
          {{ t('users.actions.update') }}
        </Button>
      </PopoverContent>
    </Popover>
    <AddUserDialog
      v-if="showUpdateDialog"
      :is-open="showUpdateDialog"
      :user="editingUser"
      mode="update"
      @update:is-open="showUpdateDialog = $event"
      @user-updated="handleUpdateComplete"
    />
  </div>
</template>

<style scoped>
.h-8 {
  height: 2rem;
}
.w-8 {
  width: 2rem;
}
</style>
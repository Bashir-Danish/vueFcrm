<script setup lang="ts">
import { ref, computed } from "vue";
import { useMainStore } from "@/stores/main";
import { MoreHorizontal } from "lucide-vue-next";
import AddBranchDialog from "@/components/branches/AddBranchDialog.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Branch } from "@/types/types";
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  branch: Branch;
}>();

const emit = defineEmits<{
  (e: "branch-updated"): void;
}>();

const mainStore = useMainStore();
const { toast } = useToast();
const { t, locale } = useI18n();
const rtl = computed(() => locale.value === 'fa');

const showUpdateDialog = ref(false);
const isOpen = ref(false);

const handleCopyId = () => {
  navigator.clipboard.writeText(props.branch._id);
  toast({
    title: t('branches.notifications.idCopied.title'),
    description: t('branches.notifications.idCopied.description'),
  });
  isOpen.value = false;
};

const handleDelete = async () => {
  try {
    await mainStore.deleteBranch(props.branch._id);
    toast({
      title: t('branches.notifications.deleted.title'),
      description: t('branches.notifications.deleted.description'),
    });
    emit("branch-updated");
  } catch (error) {
    console.error("Error deleting branch:", error);
    toast({
      title: t('branches.notifications.error.title'),
      description: t('branches.notifications.error.description'),
      variant: "destructive",
    });
  }
  isOpen.value = false;
};

const handleUpdate = () => {
  showUpdateDialog.value = true;
  isOpen.value = false;
};

const handleUpdateComplete = () => {
  showUpdateDialog.value = false;
  emit("branch-updated");
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
      <PopoverContent class="w-40 p-0" :align="rtl ? 'start' : 'end'">
        <Button variant="ghost" class="w-full rtl:text-right ltr:text-left" @click="handleCopyId">
          {{ t('branches.actions.copyId') }}
        </Button>
        <Button variant="ghost" class="w-full rtl:text-right ltr:text-left" @click="handleDelete">
          {{ t('branches.actions.delete') }}
        </Button>
        <Button variant="ghost" class="w-full rtl:text-right ltr:text-left" @click="handleUpdate">
          {{ t('branches.actions.update') }}
        </Button>
      </PopoverContent>
    </Popover>
    <AddBranchDialog
      v-if="showUpdateDialog"
      :is-open="showUpdateDialog"
      :branch="branch"
      @update:is-open="showUpdateDialog = $event"
      @branch-updated="handleUpdateComplete"
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
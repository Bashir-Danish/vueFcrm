<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "@/stores/main";
import { MoreHorizontal, CheckCircle, Wifi } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Installation } from "@/types/types";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  installation: Installation;
}>();

const emit = defineEmits<{
  (e: "installation-updated"): void;
}>();

const mainStore = useMainStore();
const { toast } = useToast();
const router = useRouter();
const { t } = useI18n();

const isOpen = ref(false);

const handleCopyId = () => {
  navigator.clipboard.writeText(props.installation._id);
  toast({
    title: t('installations.notifications.idCopied.title'),
    description: t('installations.notifications.idCopied.description'),
  });
  isOpen.value = false;
};

const handleDelete = async () => {
  try {
    await mainStore.deleteInstallation(props.installation._id);
    toast({
      title: t('installations.notifications.deleted.title'),
      description: t('installations.notifications.deleted.description'),
    });
    emit("installation-updated");
  } catch (error) {
    console.error("Error deleting installation:", error);
    toast({
      title: t('installations.notifications.error.title'),
      description: t('installations.notifications.error.description'),
      variant: "destructive",
    });
  }
  isOpen.value = false;
};

const handleUpdate = () => {
  router.push(`/customers/manage?step=4&installationId=${props.installation._id}`);
  isOpen.value = false;
};

const handleCreatePPPoE = async () => {
  try {
    await mainStore.createPPoE(props.installation.customerId._id);
    
    toast({
      title: t('installations.notifications.pppoeCreated.title'),
      description: t('installations.notifications.pppoeCreated.description'),
    });
    
    emit("installation-updated");
  } catch (error: unknown) {
    console.error("Error creating PPPoE:", error);
    toast({
      title: t('installations.notifications.error.title'),
      description: error instanceof Error ? error.message : t('installations.notifications.error.description'),
      variant: "destructive",
    });
  }
};
</script>

<template>
  <div class="flex items-center justify-end gap-5">
    <Button
      variant="outline"
      size="sm"
      class="flex items-center space-x-1 rtl:space-x-reverse"
      @click="handleCreatePPPoE"
    >
      <Wifi class="h-4 w-4" />
      <span>{{ t('installations.actions.createPPPoE') }}</span>
    </Button>
    <Button
      variant="outline"
      size="sm"
      class="flex items-center space-x-1 rtl:space-x-reverse"
      @click="handleUpdate"
    >
      <CheckCircle class="h-4 w-4" />
      <span>{{ t('installations.actions.update') }}</span>
    </Button>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as="div" class="flex items-center justify-center h-4">
        <Button variant="ghost" size="icon">
          <MoreHorizontal :size="16" class="text-gray-500 hover:text-gray-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-40 p-0">
        <Button variant="ghost" class="w-full justify-start" @click="handleCopyId">
          {{ t('installations.actions.copyId') }}
        </Button>
        <Button variant="ghost" class="w-full justify-start" @click="handleDelete">
          {{ t('installations.actions.remove') }}
        </Button>
      </PopoverContent>
    </Popover>
  </div>
</template>

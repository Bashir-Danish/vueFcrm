<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "@/stores/main";
import { MoreHorizontal } from "lucide-vue-next";
import AddEquipmentDialog from "@/components/equipment/AddEquipmentDialog.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Equipment } from "@/types/types";
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  equipment: Equipment;
}>();

const emit = defineEmits<{
  (e: "equipment-updated", updatedEquipment: Equipment): void;
}>();

const mainStore = useMainStore();
const { toast } = useToast();

const showUpdateDialog = ref(false);
const isOpen = ref(false);
const editingEquipment = ref<Equipment | undefined>(undefined);

const { t } = useI18n();

const handleCopyId = () => {
  navigator.clipboard.writeText(props.equipment._id);
  toast({
    title: t('equipment.notifications.idCopied.title'),
    description: t('equipment.notifications.idCopied.description'),
  });
  isOpen.value = false;
};

const handleDelete = async () => {
  try {
    await mainStore.deleteEquipment(props.equipment._id);
    toast({
      title: t('equipment.notifications.deleted.title'),
      description: t('equipment.notifications.deleted.description'),
    });
    emit("equipment-updated", props.equipment);
  } catch (error) {
    console.error("Error deleting equipment:", error);
    toast({
      title: t('equipment.notifications.error.title'),
      description: t('equipment.notifications.error.description'),
      variant: "destructive",
    });
  }
  isOpen.value = false;
};

const handleUpdate = () => {
  editingEquipment.value = { ...props.equipment };
  showUpdateDialog.value = true;
  isOpen.value = false;
};

const handleUpdateComplete = (updatedEquipment: Equipment) => {
  showUpdateDialog.value = false;
  editingEquipment.value = undefined;
  emit("equipment-updated", updatedEquipment);
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
        <Button variant="ghost" class="w-full justify-start rtl:text-right" @click="handleCopyId">
          {{ t('equipment.actions.copyId') }}
        </Button>
        <Button variant="ghost" class="w-full justify-start rtl:text-right" @click="handleDelete">
          {{ t('equipment.actions.delete') }}
        </Button>
        <Button variant="ghost" class="w-full justify-start rtl:text-right" @click="handleUpdate">
          {{ t('equipment.actions.update') }}
        </Button>
      </PopoverContent>
    </Popover>
    <AddEquipmentDialog
      v-if="showUpdateDialog"
      :is-open="showUpdateDialog"
      :equipment="editingEquipment"
      mode="update"
      @update:is-open="showUpdateDialog = $event"
      @equipment-updated="handleUpdateComplete"
    />
  </div>
</template>
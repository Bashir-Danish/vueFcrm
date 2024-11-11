<script setup lang="ts">
import { ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { Equipment } from "@/types/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  isOpen: boolean;
  equipment?: Equipment;
  mode: 'add' | 'update';
}>();

const emit = defineEmits<{
  (e: "update:is-open", value: boolean): void;
  (e: "equipment-added", equipment: Equipment): void;
  (e: "equipment-updated", equipment: Equipment): void;
}>();

const mainStore = useMainStore();

const name = ref("");
const model = ref("");
const company = ref("");
const unit = ref("");
const price = ref(0);

const resetForm = () => {
  name.value = "";
  model.value = "";
  company.value = "";
  unit.value = "";
  price.value = 0;
};

watch(() => props.equipment, (newEquipment) => {
  if (newEquipment && props.mode === 'update') {
    name.value = newEquipment.name;
    model.value = newEquipment.model;
    company.value = newEquipment.company;
    unit.value = newEquipment.unit;
    price.value = newEquipment.price;
  } else {
    resetForm();
  }
}, { immediate: true });

const { t } = useI18n();

const handleSubmit = async () => {
  try {
    const equipmentData = {
      name: name.value,
      model: model.value,
      company: company.value,
      unit: unit.value,
      price: price.value,
    };

    if (props.mode === 'update' && props.equipment) {
      const updatedEquipment = await mainStore.updateEquipment({
        ...props.equipment,
        ...equipmentData,
      });
      emit("equipment-updated", updatedEquipment);
    } else if (props.mode === 'add') {
      const newEquipment = await mainStore.addEquipment(equipmentData);
      emit("equipment-added", newEquipment);
      resetForm();
    }
    emit("update:is-open", false);
  } catch (error) {
    console.error("Error adding/updating equipment:", error);
  }
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:is-open', $event)">
    <DialogContent class="sm:max-w-[500px]" :class="{ 'rtl:text-right': $i18n.locale === 'fa' }">
      <DialogHeader>
        <DialogTitle>{{ t(`equipment.dialog.${mode}.title`) }}</DialogTitle>
        <DialogDescription>
          {{ t(`equipment.dialog.${mode}.description`) }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4" :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
            <Label :for="name" :class="['text-left w-24', { 'rtl:text-right': $i18n.locale === 'fa' }]">
              {{ t('equipment.columns.name') }}
            </Label>
            <Input id="name" v-model="name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4" :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
            <Label :for="model" :class="['text-left w-24', { 'rtl:text-right': $i18n.locale === 'fa' }]">
              {{ t('equipment.columns.model') }}
            </Label>
            <Input id="model" v-model="model" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4" :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
            <Label :for="company" :class="['text-left w-24', { 'rtl:text-right': $i18n.locale === 'fa' }]">
              {{ t('equipment.columns.company') }}
            </Label>
            <Input id="company" v-model="company" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4" :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
            <Label :for="unit" :class="['text-left w-24', { 'rtl:text-right': $i18n.locale === 'fa' }]">
              {{ t('equipment.columns.unit') }}
            </Label>
            <Input id="unit" v-model="unit" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4" :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
            <Label for="price" :class="['text-left w-24', { 'rtl:text-right': $i18n.locale === 'fa' }]">
              {{ t('equipment.columns.price') }}
            </Label>
            <Input 
              id="price"
              v-model="price" 
              type="number" 
              step="0.01" 
              class="col-span-3 focus:ring focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
          </div>
        </div>
        <DialogFooter :class="{ 'rtl:flex-row-reverse': $i18n.locale === 'fa' }">
          <Button type="submit">
            {{ mode === 'update' ? t('equipment.actions.update') : t('equipment.actions.add') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
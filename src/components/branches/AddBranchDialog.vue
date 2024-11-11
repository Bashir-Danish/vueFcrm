<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-[425px] ">
      <DialogHeader>
        <DialogTitle class="px-4 rtl:text-right">
          {{ isUpdate ? t('branches.dialog.update.title') : t('branches.dialog.add.title') }}
        </DialogTitle>
        <DialogDescription class="px-4 rtl:text-right">
          {{ isUpdate ? t('branches.dialog.update.description') : t('branches.dialog.add.description') }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name">
              {{ t('branches.fields.name') }}
            </Label>
            <Input 
              id="name" 
              v-model="form.name" 
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="location">
              {{ t('branches.fields.location') }}
            </Label>
            <Input 
              id="location" 
              v-model="form.location" 
              class="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{{ t('branches.dialog.save') }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMainStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Branch } from '@/types/types'
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  isOpen: boolean
  branch?: Branch
}>()

const emit = defineEmits(['update:isOpen', 'branch-added', 'branch-updated'])

const mainStore = useMainStore()
const { t } = useI18n()

const isUpdate = computed(() => !!props.branch)

const form = ref({
  _id: '',
  name: '',
  location: ''
})

watch(() => props.branch, (newBranch) => {
  if (newBranch) {
    form.value = { ...newBranch }
  } else {
    form.value = { _id: '', name: '', location: '' }
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    if (isUpdate.value && props.branch) {
      console.log('Updating branch with data:', form.value)
      const updatedBranch = await mainStore.updateBranch(form.value as Branch)
      emit('branch-updated', updatedBranch)
    } else {
      const newBranch = await mainStore.addBranch(form.value)
      emit('branch-added', newBranch)
    }
    emit('update:isOpen', false)
    form.value = { _id: '', name: '', location: '' }
  } catch (error) {
    console.error(`Error ${isUpdate.value ? 'updating' : 'adding'} branch:`, error)
  }
}
</script>
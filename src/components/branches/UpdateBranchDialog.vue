<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        Edit
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogDescription>
          Make changes to the branch here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input id="name" v-model="form.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="location" class="text-right">Location</Label>
            <Input id="location" v-model="form.location" class="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Branch } from '@/types/types'

const props = defineProps<{
  branch: Branch
}>()

const mainStore = useMainStore()
const isOpen = ref(false)

const form = ref({
  name: '',
  location: ''
})

watch(() => props.branch, (newBranch) => {
  form.value = {
    name: newBranch.name,
    location: newBranch.location
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    await mainStore.updateBranch({
      _id: props.branch._id,
      ...form.value
    })
    isOpen.value = false
  } catch (error) {
    console.error('Error updating branch:', error)
  }
}
</script>
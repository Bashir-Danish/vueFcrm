<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';
import { Button } from "@/components/ui/button";

import { useRouter } from 'vue-router';

const props = defineProps<{
  task: any;
}>();

// const mainStore = useMainStore();
const router = useRouter();

// const copyTaskId = () => {
//   navigator.clipboard.writeText(props.task._id);
// };

// const updateTaskStatus = (newStatus: string) => {
//   // Implement the logic to update the task status
//   console.log(`Updating task ${props.task._id} status to ${newStatus}`);
// };

// const viewTaskDetails = () => {
//   router.push(`/installer-tasks/${props.task._id}`);
// };

const goToInstallationForm = () => {
  router.push(`/customers/manage?step=4&taskId=${props.task._id}`);
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      class="flex items-center space-x-1"
      @click="goToInstallationForm"
    >
      <CheckCircle class="h-4 w-4" />
      <span>Update/Approve</span>
    </Button>
    <!-- <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="h-8 w-8 p-0 px-1">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem @click="copyTaskId">
          Copy Task ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="updateTaskStatus('in-progress')">
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem @click="updateTaskStatus('completed')">
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem @click="viewTaskDetails">
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> -->
  </div>
</template>

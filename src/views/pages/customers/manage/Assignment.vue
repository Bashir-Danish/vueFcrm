<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";
import { useUserStore } from "@/stores/user";
import { useToast } from "@/components/ui/toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  LucideUser,
  X,
  GripVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  Loader2
} from "lucide-vue-next";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

const mainStore = useMainStore();
const userStore = useUserStore();
const { toast } = useToast();

const { installationsData, assignedTasksData } = storeToRefs(mainStore);
const { usersData } = storeToRefs(userStore);

const loading = ref(true);
const error = ref<string | null>(null);
const userSearch = ref("");
const installationSearch = ref("");
const draggingInstallationId = ref<string | null>(null);
const assigningUserId = ref<string | null>(null);
const unassigningTaskId = ref<string | null>(null);
const page = ref(1);
const totalPages = computed(() => installationsData.value.totalPages);

const router = useRouter();
const authStore = useAuthStore();

const fetchData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      userStore.fetchUsers(1, 10, "", ["installer"]),
      mainStore.fetchAssignedTasks({}),
      mainStore.fetchInstallations(page.value, 6, "", "pending"),
    ]);
    usersData.value.users = usersData.value.users.map((user) => ({
      ...user,
      tasks: assignedTasksData.value.assignedTasks.filter(
        (task) => task.userId && typeof task.userId !== 'string' && task.userId._id === user._id && task.status === 'assigned'
      ),
    }));
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to fetch data";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

watch(page, fetchData);

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (
    target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
    page.value < totalPages.value
  ) {
    page.value++;
  }
};

const handleUnassignTask = async (userId: string, taskId: string) => {
  try {
    unassigningTaskId.value = taskId;
    await mainStore.unassignInstallation(taskId);

    const userIndex = usersData.value.users.findIndex((u) => u._id === userId);
    if (userIndex !== -1) {
      const user = usersData.value.users[userIndex];
      if (user.tasks) {
        user.tasks = user.tasks.filter((t) => t._id !== taskId);
      }
    }

    // if (updatedInstallation) {
    //   installationsData.value.installations.push(updatedInstallation);
    // }

    toast({
      title: "Task Unassigned",
      description: "The task has been successfully unassigned.",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: `Failed to unassign task. Please try again.`,
      variant: "destructive",
    });
  } finally {
    unassigningTaskId.value = null;
  }
};

const onDragStart = (event: DragEvent, installationId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", installationId);
    draggingInstallationId.value = installationId;
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = async (event: DragEvent, userId: string) => {
  event.preventDefault();
  const installationId = event.dataTransfer?.getData("text");

  if (installationId) {
    try {
      assigningUserId.value = userId;
      const assignedTask = await mainStore.assignInstallation(
        userId,
        installationId
      );

      const userIndex = usersData.value.users.findIndex(
        (u) => u._id === userId
      );
      if (userIndex !== -1) {
        const user = usersData.value.users[userIndex];
        if (!user.tasks) {
          user.tasks = [];
        }
        user.tasks.push(assignedTask);
      }

      installationsData.value.installations =
        installationsData.value.installations.filter(
          (i) => i._id !== installationId
        );

      toast({
        title: "Task Assigned",
        description: "The task has been successfully assigned.",
      });

      // Only change step if the user is not a NOC user
      if (authStore.user?.role !== 'noc') {
        const currentStep = Number(router.currentRoute.value.query.step) || 1;
        router.push({ query: { ...router.currentRoute.value.query, step: currentStep + 1 } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      });
    } finally {
      draggingInstallationId.value = null;
      assigningUserId.value = null;
    }
  }
};

const filteredUsers = computed(() =>
  usersData.value.users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.value.toLowerCase())
  )
);

const filteredInstallations = computed(() =>
  installationsData.value.installations.filter(
    (installation) =>
      (installation.customerId?.custType === "individual"
        ? `${installation.customerId?.name} ${installation.customerId?.lastName}`
        : installation.customerId?.companyName || ""
      )
        .toLowerCase()
        .includes(installationSearch.value.toLowerCase()) ||
      installation.type
        .toLowerCase()
        .includes(installationSearch.value.toLowerCase()) ||
      installation.status
        .toLowerCase()
        .includes(installationSearch.value.toLowerCase())
  )
);

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock;
    case "in-progress":
      return Clock;
    case "done":
      return CheckCircle;
    case "failed":
      return AlertCircle;
    default:
      return null;
  }
};

const getCustomerName = (customer: any) => {
  if (customer.custType === "individual") {
    return `${customer.name} ${customer.lastName}`;
  } else {
    return customer.companyName || "N/A";
  }
};
</script>

<template>
  <div class="container mx-auto p-2">
    <!-- <h1 class="text-2xl font-bold mb-4 select-none rtl:text-right">{{ t('customers.manage.title') }}</h1> -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        class="h-[calc(100vh-13rem)] overflow-hidden border border-primary/5"
      >
        <CardHeader>
          <CardTitle class="select-none rtl:text-right">{{ t('customers.assignment.installers') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="mb-4">
            <Input
              :placeholder="t('customers.assignment.searchInstallers')"
              v-model="userSearch"
              class="w-full select-none"
            />
          </div>
          <ScrollArea class="h-[calc(100vh-19rem)]">
            <div class="flex flex-col items-center w-[96%] mx-auto">
              <template v-if="loading && page === 1">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-14 w-full mb-2 rounded-lg bg-muted animate-pulse"
                ></div>
              </template>
              <template v-else>
                <div
                  v-for="user in filteredUsers"
                  :key="user._id"
                  class="mb-2 p-4 bg-background border-l-4   border-primary rounded-lg shadow-sm transition-all duration-300 hover:shadow-md w-full relative select-none"
                  @dragover="onDragOver"
                  @drop="(e:any) => onDrop(e, user._id)"
                >
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 ">
                    <div class="flex items-center space-x-3 rtl:space-x-reverse mb-2 sm:mb-0">
                      <div class="p-2 rounded-full bg-primary/5">
                        <LucideUser class="text-primary" :size="20" />
                      </div>
                      <div>
                        <span class="font-semibold1 text-lg capitalize">{{ user.name }}</span>
                        <!-- <Badge class="rtl:mr-2 ltr:ml-2 bg-secondary text-secondary-foreground capitalize">
                          {{ t(`customers.roles.${user.role}`) }}
                        </Badge> -->
                      </div>
                    </div>
                    <div class="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full select-none">
                      {{ t('customers.assignment.tasksCount', { count: user.tasks?.length || 0 }) }}
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <div
                      v-for="(task, index) in user.tasks || []"
                      :key="`${user._id}-${task._id}`"
                      class="inline-flex items-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full  px-1 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          <div class="flex items-center cursor-pointer">
                            <div
                              class="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-1"
                            >
                              <template v-if="unassigningTaskId === task._id">
                                <Loader class="animate-spin" :size="12" />
                              </template>
                              <template v-else>
                                <span class="text-xs font-bold">{{
                                  index + 1
                                }}</span>
                              </template>
                            </div>
                            <span class="text-xs font-medium">Task</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p class="font-medium">Task Details:</p>
                          <p class="text-sm text-muted-foreground">
                            Customer: {{ task.installationId && typeof task.installationId !== 'string' && task.installationId.customerId ? `${task.installationId.customerId.name} ${task.installationId.customerId.lastName}` : 'N/A' }}<br />
                            Phone: {{ task.installationId && typeof task.installationId !== 'string' && task.installationId.customerId && task.installationId.customerId.phones ? task.installationId.customerId.phones[0] : 'N/A' }}<br />
                            Address: {{ task.installationId && typeof task.installationId !== 'string' && task.installationId.customerId ? task.installationId.customerId.address : 'N/A' }}<br />
                            Type: {{ task.installationId && typeof task.installationId !== 'string' ? task.installationId.type : 'N/A' }}
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                      <Button
                        @click="handleUnassignTask(user._id, task._id)"
                        class="ml-1 rounded-full text-destructive hover:text-destructive-foreground transition-colors duration-200"
                        :disabled="unassigningTaskId === task._id"
                        variant="ghost"
                        size="sm"
                      >
                        <X :size="15" />
                      </Button>
                    </div>
                    <div
                      v-if="assigningUserId === user._id"
                      class="inline-flex items-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full py-1 px-2 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-1"
                      >
                        <Loader class="animate-spin" :size="12" />
                      </div>
                      <span class="text-xs font-medium">Task</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card
        class="h-[calc(100vh-13rem)] overflow-hidden border border-primary/5"
      >
        <CardHeader>
          <CardTitle class="select-none rtl:text-right">{{ t('customers.assignment.unassignedInstallations') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="mb-4">
            <Input
              :placeholder="t('customers.assignment.searchInstallations')"
              v-model="installationSearch"
              class="w-full select-none"
            />
          </div>
          <div class="h-[calc(100vh-19rem)] overflow-hidden">
            <ScrollArea class="h-full" @scroll="handleScroll">
              <div class="flex flex-col items-center w-[96%] mx-auto relative">
                <div
                  v-for="installation in filteredInstallations"
                  :key="installation._id"
                  class="mb-2 p-3 bg-background border rounded-lg flex items-center w-full shadow-sm transition-all duration-300 hover:shadow-md select-none "
                  draggable="true"
                  @dragstart="(event:any) => onDragStart(event, installation._id)"
                >
                  <div class="cursor-move">
                    <GripVertical class="rtl:ml-2 ltr:mr-2 flex-shrink-0" :size="18" />
                  </div>
                  <div class="flex-grow min-w-0 rtl:text-right">
                    <div class="font-medium truncate">
                      {{ getCustomerName(installation.customerId) }}
                    </div>
                    <div class="text-sm text-muted-foreground truncate">
                      {{ installation.type }} - {{ installation.status }}
                    </div>
                  </div>
                  <div class="flex items-center flex-shrink-0 rtl:mr-2 ltr:ml-2">
                    <component
                      :is="getStatusIcon(installation.status)"
                      :size="18"
                      :class="{
                        'text-yellow-500': installation.status === 'pending',
                        'text-blue-500': installation.status === 'in-progress',
                        'text-green-500': installation.status === 'done',
                        'text-red-500': installation.status === 'failed',
                      }"
                    />
                  </div>
                </div>
                <div
                  v-if="loading && page > 1"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4"
                >
                  <Loader2 :size="24" class="text-primary animate-spin" />
                </div>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

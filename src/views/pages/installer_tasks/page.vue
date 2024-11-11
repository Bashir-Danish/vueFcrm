<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useMainStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { columns } from "@/views/pages/installer_tasks/columns";


const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const authStore = useAuthStore();
const { assignedTasksData } = storeToRefs(mainStore);

const filterFields = ref(["status"]);
const filterConfigs = ref({
  // status: [
  //   { value: "assigned", label: "Assigned" },
  //   { value: "in-progress", label: "In Progress" },
  //   { value: "completed", label: "Completed" },
  //   { value: "cancelled", label: "Cancelled" },
  // ],
});

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const loading = ref(true);
const initialLoad = ref(true);
const selectedStatus = ref<string[]>([]);

// const totalPages = computed(() =>
//   Math.ceil(assignedTasksData.value.totalCount / assignedTasksData.value.limit)
// );

const fetchData = async (
  page: number,
  limit: number,
  status: string[]
) => {
  if (loading.value && !initialLoad.value) return;
  loading.value = true;
  try {
    await mainStore.fetchAssignedTasks({
      page,
      limit,
      status: status.join(','),
      userId: authStore.user?._id
    });
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
  } finally {
    loading.value = false;
    initialLoad.value = false;
  }
};

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const debouncedFetchData = debounce(fetchData, 300);

const updateRouteAndFetch = (
  params: Record<string, string | number | string[]>
) => {
  const newQuery: Record<string, string | null> = {};

  Object.entries(route.query).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      newQuery[key] = Array.isArray(value) ? value.join(",") : value as string;
    }
  });

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      newQuery[key] = value.join(",");
    } else if (value !== '' && value !== null && value !== undefined) {
      newQuery[key] = String(value);
    }
  });

  if (newQuery.status === '') {
    delete newQuery.status;
  }

  router.push({ query: newQuery });

  const page = Number(newQuery.page) || DEFAULT_PAGE;
  const limit = Number(newQuery.limit) || DEFAULT_LIMIT;
  const status = newQuery.status ? (newQuery.status as string).split(",") : [];

  debouncedFetchData(page, limit, status);
};

onMounted(() => {
  const { page, limit, status } = route.query;
  const initialPage = page ? Number(page) : DEFAULT_PAGE;
  const initialLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const initialStatus = status && status !== '' ? (status as string).split(",").filter(Boolean) : [];

  assignedTasksData.value.page = initialPage;
  assignedTasksData.value.limit = initialLimit;
  selectedStatus.value = initialStatus;
  initialLoad.value = true;
  fetchData(initialPage, initialLimit, initialStatus);
});

const handlePageChange = (newPage: number) => {
  updateRouteAndFetch({ page: newPage });
};

const handleLimitChange = (newLimit: number) => {
  updateRouteAndFetch({ page: 1, limit: newLimit });
};

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  if (filterKey === "status") {
    selectedStatus.value = newValue;
    updateRouteAndFetch({ page: 1, status: newValue });
  }
};

// const handleTaskUpdated = async () => {
//   await fetchData(
//     assignedTasksData.value.page,
//     assignedTasksData.value.limit,
//     selectedStatus.value
//   );
// };

const filteredAssignedTasks = computed(() => {
  return assignedTasksData.value.assignedTasks.filter(task => 
    task.userId && typeof task.userId !== 'string' && task.userId._id === authStore.user?._id
  );
});
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold my-4 sm:my-6">
      My Assigned Tasks
    </h1>

    <DataTable
      :columns="columns"
      :data="filteredAssignedTasks"
      :filter-options="filterFields"
      :filter-configs="filterConfigs"
      :filter-counts="assignedTasksData.filterCounts"
      :current-filters="{ status: selectedStatus }"
      :page="assignedTasksData.page"
      :limit="assignedTasksData.limit"
      :total-count="assignedTasksData.totalCount"
      :loading="loading && filteredAssignedTasks.length === 0"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @filter-change="handleFilterChange"
      class="w-full"
    >
      <!-- You can add a toolbar here if needed -->
      <!-- <template #toolbar>
        <Button
          variant="outline"
          size="sm"
          class="ml-auto h-8 flex items-center justify-center bg-transparent hover:bg-primary hover:text-white"
          @click="router.push({ path: '/some-path' })"
        >
          <span>Some Action</span>
        </Button>
      </template> -->
      <!-- You can add cell actions here if needed -->
      <!-- <template #cell-actions="{ row }">
        <TaskActions :task="row.original" @task-updated="handleTaskUpdated" />
      </template> -->
    </DataTable>
  </div>
</template>

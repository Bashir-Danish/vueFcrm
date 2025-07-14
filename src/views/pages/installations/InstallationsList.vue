<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useMainStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { getColumns } from "@/views/pages/installations/columns";
import Button from "@/ui/button/button.vue";

// import InstallationActions from "@/views/pages/installations/InstallationActions.vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from 'vue-i18n'

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const authStore = useAuthStore();
const { installationsData } = storeToRefs(mainStore);
const { user } = storeToRefs(authStore);

const filterFields = ref(["customerId", "status"]);
const filterConfigs = ref({
  status: [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "failed", label: "Failed" },
  ],
});

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const loading = ref(true);
const initialLoad = ref(true);
const type = ref('all');
const selectedStatus = ref<string[]>([]);

// const totalPages = computed(() =>
//   Math.ceil(installationsData.value.totalCount / installationsData.value.limit)
// );

const fetchData = async (
  page: number,
  limit: number,
  type: string,
  status: string[]
) => {
  if (loading.value && !initialLoad.value) return;
  loading.value = true;
  try {
    await mainStore.fetchInstallations(
      page,
      limit,
      type === 'all' ? '' : type,
      status.join(',')
    );
  } catch (error) {
    console.error("Error fetching installations:", error);
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

  // Copy non-null and non-empty values from route.query
  Object.entries(route.query).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      newQuery[key] = Array.isArray(value) ? value.join(",") : value;
    }
  });

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      newQuery[key] = value.join(",");
    } else if (value !== '' && value !== null && value !== undefined) {
      newQuery[key] = String(value);
    }
  });

  // Remove status from query if it's empty
  if (newQuery.status === '') {
    delete newQuery.status;
  }

  router.push({ query: newQuery });

  const page = Number(newQuery.page) || DEFAULT_PAGE;
  const limit = Number(newQuery.limit) || DEFAULT_LIMIT;
  const currentType = newQuery.type as string || 'all';
  const status = newQuery.status ? (newQuery.status as string).split(",") : [];

  debouncedFetchData(page, limit, currentType, status);
};

onMounted(() => {
  const { page, limit, type: routeType, status } = route.query;
  const initialPage = page ? Number(page) : DEFAULT_PAGE;
  const initialLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const initialType = (routeType as string) || 'all';
  
  // Check if user is installer and set default status accordingly
  const isInstaller = user.value?.role === 'installer';
  const defaultStatus = isInstaller ? ['in-progress'] : ['done'];
  const initialStatus = status && status !== '' ? (status as string).split(",").filter(Boolean) : defaultStatus;

  installationsData.value.page = initialPage;
  installationsData.value.limit = initialLimit;
  type.value = initialType;
  selectedStatus.value = initialStatus;
  initialLoad.value = true;
  fetchData(initialPage, initialLimit, initialType, initialStatus);
});

const handlePageChange = (newPage: number) => {
  updateRouteAndFetch({ page: newPage });
};

const handleLimitChange = (newLimit: number) => {
  updateRouteAndFetch({ page: 1, limit: newLimit });
};

const handleTypeChange = (newType: string) => {
  type.value = newType;
  updateRouteAndFetch({ page: 1, type: newType });
};

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  if (filterKey === "status") {
    selectedStatus.value = newValue;
    updateRouteAndFetch({ page: 1, status: newValue });
  }
};

// const handleInstallationUpdated = async () => {
//   await fetchData(
//     installationsData.value.page,
//     installationsData.value.limit,
//     type.value,
//     selectedStatus.value
//   );
// };

watch([type], () => {
  updateRouteAndFetch({ type: type.value });
});

const { t } = useI18n();
const columns = computed(() => getColumns(t));
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6">
      {{ t('installations.title') }}
    </h1>

    <div class="mb-6 flex">
      <Tabs v-model="type" class="w-full mb-6 flex rtl:flex-row-reverse">
        <TabsList class="rtl:flex-row-reverse">
          <TabsTrigger 
            v-for="typeOption in ['all', 'installation', 'troubleshooting']" 
            :key="typeOption"
            :value="typeOption" 
            @click="handleTypeChange(typeOption)"
          >
            {{ t(`installations.types.${typeOption}`) }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <DataTable
      :columns="columns"
      :data="installationsData.installations"
      :filter-options="filterFields"
      :filter-configs="filterConfigs"
      :filter-counts="installationsData.filterCounts"
      :current-filters="{ status: selectedStatus }"
      :page="installationsData.page"
      :limit="installationsData.limit"
      :total-count="installationsData.totalCount"
      :loading="loading"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @filter-change="handleFilterChange"
      class="w-full"
    >
      <template #toolbar>
        <Button
          variant="outline"
          size="sm"
          :class="[
            'ml-auto rtl:ml-0 rtl:mr-auto h-8',
            'flex items-center justify-center',
            'bg-transparent hover:bg-primary hover:text-white'
          ]"
          @click="router.push({ path: '/customers/manage', query: { step: '3' } })"
        >
          <span>{{ t('installations.actions.assign') }}</span>
        </Button>
      </template>
    </DataTable>
  </div>
</template>

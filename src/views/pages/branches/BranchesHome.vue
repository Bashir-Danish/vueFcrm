<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { getColumns } from "@/views/pages/branches/columns";
import Button from "@/ui/button/button.vue";
import { Branch } from "@/types/types";
import AddBranchDialog from "@/components/branches/AddBranchDialog.vue";
import { Plus } from 'lucide-vue-next'; 
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const { branchesData } = storeToRefs(mainStore);

const filterFields = ref(["name", "location"]);
const filterConfigs = ref({}); 
const filterCounts = ref({});

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const loading = ref(true);
const searchTerm = ref("");

const { t } = useI18n();
const columns = computed(() => getColumns(t));

const fetchData = async (page: number, limit: number, search: string) => {
  try {
    await mainStore.fetchBranches({
      page,
      limit,
      search
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const { page, limit, search } = route.query;
  const initialPage = page ? Number(page) : DEFAULT_PAGE;
  const initialLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const initialSearch = (search as string) || "";

  searchTerm.value = initialSearch;
  await fetchData(initialPage, initialLimit, initialSearch);

  updateRoute({
    page: initialPage,
    limit: initialLimit,
    search: initialSearch,
  });
});

watch(
  () => route.query,
  async (newQuery) => {
    const { page, limit, search } = newQuery;
    await fetchData(
      Number(page) || DEFAULT_PAGE,
      Number(limit) || DEFAULT_LIMIT,
      (search as string) || ""
    );
  },
  { deep: true }
);

const handlePageChange = (newPage: number) => {
  updateRoute({ page: newPage });
};

const handleLimitChange = (newLimit: number) => {
  updateRoute({ page: 1, limit: newLimit });
};

const handleSearchChange = (newSearch: string) => {
  searchTerm.value = newSearch;
  updateRoute({ page: 1, search: newSearch });
};

const handleBranchAdded = async () => {
  showAddDialog.value = false;
  await fetchData(
    branchesData.value.page,
    branchesData.value.limit,
    searchTerm.value
  );
};

const handleBranchUpdated = async () => {
  showAddDialog.value = false;
  await fetchData(
    branchesData.value.page,
    branchesData.value.limit,
    searchTerm.value
  );
};

const updateRoute = (params: Record<string, string | number>) => {
  router.push({ query: { ...route.query, ...params } });
};

const showAddDialog = ref(false);
const editingBranch = ref<Branch | undefined>(undefined);

const handleAddBranch = () => {
  editingBranch.value = undefined;
  showAddDialog.value = true;
};

// const handleEditBranch = (branch: Branch) => {
//   editingBranch.value = branch;
//   showAddDialog.value = true;
// };
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right ltr:text-left">
      {{ t('branches.title') }}
    </h1>

    <DataTable
      :columns="columns"
      :data="branchesData.branches"
      :filter-options="filterFields"
      :page="branchesData.page"
      :limit="branchesData.limit"
      :total-count="branchesData.totalCount"
      :loading="loading"
      :filter-configs="filterConfigs"
      :filter-counts="filterCounts"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @filter-change="handleSearchChange"
      class="w-full"
    >
      <template #toolbar>
        <Button
          variant="outline"
          class="rtl:mr-auto ltr:ml-auto h-8 w-20 bg-transparent hover:bg-primary hover:text-white"
          @click="handleAddBranch"
        >
          <Plus class="rtl:ml-1 ltr:mr-1 h-4 w-4" />
          {{ t('branches.actions.add') }}
        </Button>
      </template>
    </DataTable>

    <AddBranchDialog
      :is-open="showAddDialog"
      :branch="editingBranch"
      @update:is-open="showAddDialog = $event"
      @branch-added="handleBranchAdded"
      @branch-updated="handleBranchUpdated"
    />
  </div>
</template>

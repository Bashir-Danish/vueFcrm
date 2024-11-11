<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useEquipmentColumns } from "@/views/pages/equipment/columns";
import Button from "@/ui/button/button.vue";
import { Equipment } from "@/types/types";
import AddEquipmentDialog from "@/components/equipment/AddEquipmentDialog.vue";
import EquipmentActions from "@/views/pages/equipment/EquipmentActions.vue";
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const { equipmentData } = storeToRefs(mainStore);

const filterFields = ref(["name", "model", "company", "unit"]);

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const loading = ref(true);
const initialLoad = ref(true);
const searchTerm = ref("");

const { t } = useI18n();
const columns = useEquipmentColumns();

const fetchData = async (
  page: number,
  limit: number,
  search: string
) => {
  if (loading.value && !initialLoad.value) return;
  loading.value = true;
  try {
    await mainStore.fetchEquipment(page, limit, search);
  } catch (error) {
    console.error("Error fetching equipment:", error);
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
    if (value !== null) {
      newQuery[key] = Array.isArray(value) ? value.join(",") : value;
    }
  });

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      newQuery[key] = value.join(",");
    } else {
      newQuery[key] = String(value);
    }
  });

  router.push({ query: newQuery });

  const page = Number(newQuery.page) || DEFAULT_PAGE;
  const limit = Number(newQuery.limit) || DEFAULT_LIMIT;
  const search = newQuery.search || "";

  debouncedFetchData(page, limit, search);
};

onMounted(() => {
  const { page, limit, search } = route.query;
  const initialPage = page ? Number(page) : DEFAULT_PAGE;
  const initialLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const initialSearch = (search as string) || "";

  searchTerm.value = initialSearch;
  initialLoad.value = true;
  fetchData(initialPage, initialLimit, initialSearch);
});

const handlePageChange = (newPage: number) => {
  updateRouteAndFetch({ page: newPage });
};

const handleLimitChange = (newLimit: number) => {
  updateRouteAndFetch({ page: 1, limit: newLimit });
};

const handleSearchChange = (newSearch: string) => {
  searchTerm.value = newSearch;
  updateRouteAndFetch({ page: 1, search: newSearch });
};

const handleEquipmentAdded = (newEquipment: Equipment) => {
  showAddDialog.value = false;
  
  // Add the new equipment to the beginning of the list
  equipmentData.value.equipment.unshift(newEquipment);
  
  // If the list exceeds the current limit, remove the last item
  if (equipmentData.value.equipment.length > equipmentData.value.limit) {
    equipmentData.value.equipment.pop();
  }
  
  // Increment the total count
  equipmentData.value.totalCount++;
};

const handleEquipmentUpdated = async (updatedEquipment: Equipment) => {
  const index = equipmentData.value.equipment.findIndex(e => e._id === updatedEquipment._id);
  if (index !== -1) {
    equipmentData.value.equipment[index] = updatedEquipment;
  }
};

const showAddDialog = ref(false);
const editingEquipment = ref<Equipment | undefined>(undefined);
const dialogMode = ref<'add' | 'update'>('add');

const handleAddEquipment = () => {
  editingEquipment.value = undefined;
  dialogMode.value = 'add';
  showAddDialog.value = true;
};

// const handleEditEquipment = (equipment: Equipment) => {
//   editingEquipment.value = equipment;
//   dialogMode.value = 'update';
//   showAddDialog.value = true;
// };
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right">
      {{ t('equipment.title') }}
    </h1>

    <DataTable
      :columns="columns"
      :data="equipmentData.equipment"
      :filter-options="filterFields"
      :filter-configs="{}"
      :filter-counts="{}"
      :page="equipmentData.page"
      :limit="equipmentData.limit"
      :total-count="equipmentData.totalCount"
      :loading="loading"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @search-change="handleSearchChange"
      class="w-full"
    >
      <template #toolbar>
        <Button
          variant="outline"
          size="sm"
          class="ml-auto rtl:ml-0 rtl:mr-auto h-8 flex items-center justify-center bg-transparent hover:bg-primary hover:text-white"
          @click="handleAddEquipment"
        >
          <span>{{ t('equipment.actions.add') }}</span>
        </Button>
      </template>
      <template #cell-actions="{ row }">
        <EquipmentActions :equipment="row.original" @equipment-updated="handleEquipmentUpdated" />
      </template>
    </DataTable>

    <AddEquipmentDialog
      :mode="dialogMode"
      :is-open="showAddDialog"
      :equipment="editingEquipment"
      @update:is-open="showAddDialog = $event"
      @equipment-added="handleEquipmentAdded"
      @equipment-updated="handleEquipmentUpdated"
    />
  </div>
</template>
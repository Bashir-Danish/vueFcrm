<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { createColumns } from "./columns";
import Button from "@/ui/button/button.vue";
import { User } from "@/types/types";
import AddUserDialog from "@/components/users/AddUserDialog.vue";
import UserActions from "./UserActions.vue";
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { usersData } = storeToRefs(userStore);

const filterFields = ref(["name", "email", "role", "cartId"]);

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const loading = ref(true);
const initialLoad = ref(true);
const searchTerm = ref("");
const selectedRoles = ref<string[]>([]);

// const totalPages = computed(() =>
//   Math.ceil(usersData.value.totalCount / usersData.value.limit)
// );

const fetchData = async (
  page: number,
  limit: number,
  search: string,
  roles: string[]
) => {
  if (loading.value && !initialLoad.value) return;
  loading.value = true;
  try {
    await userStore.fetchUsers(page, limit, search, roles);
  } catch (error) {
    console.error("Error fetching users:", error);
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

  // Copy non-null values from route.query
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
  const roles = newQuery.role ? (newQuery.role as string).split(",") : [];

  debouncedFetchData(page, limit, search, roles);
};

const { t } = useI18n();

const roleFilterConfig = computed(() => [
  { value: "admin", label: t('users.roles.admin') },
  { value: "noc", label: t('users.roles.noc') },
  { value: "installer", label: t('users.roles.installer') },
  { value: "financeAdmin", label: t('users.roles.financeAdmin') },
  { value: "cashier", label: t('users.roles.cashier') },
]);

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  if (filterKey === "role") {
    selectedRoles.value = newValue;
    updateRouteAndFetch({ page: 1, role: newValue });
  }
};

onMounted(() => {
  const { page, limit, search, role } = route.query;
  const initialPage = page ? Number(page) : DEFAULT_PAGE;
  const initialLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const initialSearch = (search as string) || "";
  const initialRoles = role ? (role as string).split(",") : [];
  console.log("test");

  searchTerm.value = initialSearch;
  selectedRoles.value = initialRoles;
  initialLoad.value = true;
  fetchData(initialPage, initialLimit, initialSearch, initialRoles);
});

const handlePageChange = (newPage: number) => {
  updateRouteAndFetch({ page: newPage });
};

const handleLimitChange = (newLimit: number) => {
  updateRouteAndFetch({ page: 1, limit: newLimit });
};

// const handleSearchChange = (newSearch: string) => {
//   searchTerm.value = newSearch;
//   updateRouteAndFetch({ page: 1, search: newSearch });
// };

const handleUserAdded = async () => {
  showAddDialog.value = false;
  await fetchData(
    usersData.value.page,
    usersData.value.limit,
    searchTerm.value,
    selectedRoles.value
  );
};

const handleUserUpdated = async () => {
  await fetchData(
    usersData.value.page,
    usersData.value.limit,
    searchTerm.value,
    selectedRoles.value
  );
};

const showAddDialog = ref(false);
const editingUser = ref<User | undefined>(undefined);
const dialogMode = ref<'add' | 'update' | 'invite'>('add');

const handleAddUser = () => {
  editingUser.value = undefined;
  dialogMode.value = 'invite';
  showAddDialog.value = true;
};

// const handleEditUser = (user: User) => {
//   editingUser.value = user;
//   dialogMode.value = 'update';
//   showAddDialog.value = true;
// };

const columns = computed(() => createColumns());
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right">
      {{ t('users.title') }}
    </h1>

    <DataTable
      :columns="columns"
      :data="usersData.users"
      :filter-options="filterFields"
      :filter-configs="{ role: roleFilterConfig }"
      :filter-counts="usersData.filterCounts"
      :page="usersData.page"
      :limit="usersData.limit"
      :total-count="usersData.totalCount"
      :loading="loading"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @filter-change="handleFilterChange"
      :current-filters="{ role: selectedRoles }"
      class="w-full"
    >
      <template #toolbar>
        <Button
          variant="outline"
          size="sm"
          class="ml-auto h-8 flex items-center justify-center bg-transparent hover:bg-primary hover:text-white"
          @click="handleAddUser"
        >
          <span>{{ t('users.actions.invite') }}</span>
        </Button>
      </template>
      <template #cell-actions="{ row }">
        <UserActions :user="row.original" @user-updated="handleUserUpdated" />
      </template>
    </DataTable>

    <AddUserDialog
      :mode="dialogMode"
      :is-open="showAddDialog"
      :user="editingUser"
      @update:is-open="showAddDialog = $event"
      @user-added="handleUserAdded"
      @user-updated="handleUserUpdated"
      @user-invited="handleUserAdded"
    />
  </div>
</template>

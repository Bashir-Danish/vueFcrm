<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import { useCustomerColumns } from './columns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const { t } = useI18n();

const page = ref(1);
const limit = ref(10);
const search = ref('');
const custType = ref('all');
const loading = ref(true);
const initialLoad = ref(true);

const filterOptions = ref<unknown[]>([]);
const filterConfigs = ref<Record<string, unknown>>({});
const currentFilters = ref<Record<string, unknown>>({});

const columns = computed(() => useCustomerColumns().value);

const fetchCustomers = async () => {
	if (loading.value && !initialLoad.value) return;
	loading.value = true;
	try {
		await mainStore.fetchCustomers(page.value, limit.value, search.value, custType.value);
	} catch (error) {
		console.error("Error fetching customers:", error);
	} finally {
		loading.value = false;
		initialLoad.value = false;
	}
};

onMounted(() => {
	page.value = Number(route.query.page) || 1;
	limit.value = Number(route.query.limit) || 10;
	search.value = route.query.search as string || '';
	custType.value = route.query.custType as string || 'all';
	initialLoad.value = true;
	fetchCustomers();
});

const debounce = (fn: Function, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const debouncedFetchCustomers = debounce(fetchCustomers, 300);

watch([page, limit, search, custType], () => {
	router.push({ query: { page: page.value, limit: limit.value, search: search.value, custType: custType.value } });
	debouncedFetchCustomers();
});

const handlePageChange = (newPage: number) => {
	page.value = newPage;
};

const handleLimitChange = (newLimit: number) => {
	limit.value = newLimit;
	page.value = 1;
};

const handleSearchChange = (newSearch: string) => {
	search.value = newSearch;
	page.value = 1;
};

const handleCustTypeChange = (newCustType: string) => {
	custType.value = newCustType;
	page.value = 1;
};

const handleFilterChange = (filterKey: string, newValue: string[]) => {
	currentFilters.value = { ...currentFilters.value, [filterKey]: newValue };
	page.value = 1;
	fetchCustomers();
};

const handleAddCustomer = () => {
	router.push({ name: 'customersManage' });
};
</script>

<template>
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right">
      {{ t('customers.title') }}
    </h1>
		<Tabs v-model="custType" class="w-full mb-6 flex rtl:flex-row-reverse">
			<TabsList class="rtl:flex-row-reverse">
				<TabsTrigger value="all" @click="handleCustTypeChange('all')">
					{{ t('customers.filter.all') }}
				</TabsTrigger>
				<TabsTrigger value="individual" @click="handleCustTypeChange('individual')">
					{{ t('customers.filter.individual') }}
				</TabsTrigger>
				<TabsTrigger value="business" @click="handleCustTypeChange('business')">
					{{ t('customers.filter.business') }}
				</TabsTrigger>
			</TabsList>
		</Tabs>
		<DataTable
			v-if="columns"
			:columns="columns"
			:data="mainStore.customersData.customers"
			:page="page"
			:limit="limit"
			:total-count="mainStore.customersData.totalCount"
			:filter-counts="mainStore.customersData.filterCounts"
			:filter-options="filterOptions"
			:filter-configs="filterConfigs"
			:current-filters="currentFilters"
			:loading="loading"
			@page-change="handlePageChange"
			@limit-change="handleLimitChange"
			@search-change="handleSearchChange"
			@filter-change="handleFilterChange"
			class="rtl:text-right"
		>
			<template #toolbar>
				<Button
					variant="outline"
					class="rtl:mr-auto rtl:ml-0 ltr:ml-auto ltr:mr-0 h-8 bg-transparent hover:bg-primary hover:text-white flex items-center gap-2"
					@click="handleAddCustomer"
				>
					<Plus class="h-4 w-4" />
					<span>{{ t('customers.actions.add') }}</span>
				</Button>
			</template>
		</DataTable>
	</div>
</template>

<style scoped>
:deep(.rtl) {
  direction: rtl;
}

:deep(.ltr) {
  direction: ltr;
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import { useInvoiceColumns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const { t } = useI18n();

const page = ref(1);
const limit = ref(30);
const search = ref("");
const loading = ref(true);
const initialLoad = ref(true);

const columns = computed(() => useInvoiceColumns());

const fetchInvoices = async () => {
  if (loading.value && !initialLoad.value) return;
  loading.value = true;
  try {
    await mainStore.fetchInvoices(search.value);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  } finally {
    loading.value = false;
    initialLoad.value = false;
  }
};

onMounted(() => {
  page.value = parseInt(route.query.page as string) || 1;
  limit.value = parseInt(route.query.limit as string) || 30;
  search.value = (route.query.search as string) || "";
  initialLoad.value = true;
  fetchInvoices();
});

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

const handleLimitChange = (newLimit: number) => {
  limit.value = parseInt(String(newLimit));
  page.value = 1;
};

const handleSearchChange = (newSearch: string) => {
  search.value = newSearch;
  page.value = 1;
};

watch([page, limit, search], () => {
  router.push({
    query: { page: page.value, limit: limit.value, search: search.value },
  });
  fetchInvoices();
});
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1
      class="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-6 rtl:text-right"
    >
      {{ t("invoices.title") }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">
            {{ t("invoices.summary.totalAmount") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ formatCurrency(mainStore.invoicesData.summary.totalAmount) }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">
            {{ t("invoices.summary.totalBalance") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ formatCurrency(mainStore.invoicesData.summary.totalBalance) }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">
            {{ t("invoices.summary.paidInvoices") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">
            {{ mainStore.invoicesData.summary.paidInvoices }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">
            {{ t("invoices.summary.unpaidInvoices") }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">
            {{ mainStore.invoicesData.summary.unpaidInvoices }}
          </div>
        </CardContent>
      </Card>
    </div>

    <DataTable
      v-if="columns"
      :columns="columns"
      :data="mainStore.invoicesData.invoices"
      :page="page"
      :limit="limit"
      :total-count="mainStore.invoicesData.totalCount"
      :loading="loading"
      :filter-counts="{}"
      :filter-options="[]"
      :filter-configs="{}"
      :current-filters="{}"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @search-change="handleSearchChange"
      @filter-change="() => {}"
      class="rtl:text-right"
    />
  </div>
</template>

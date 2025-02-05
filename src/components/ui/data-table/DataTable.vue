<template>
  <div v-if="currentColumns && table" class="space-y-4">
    <DataTableToolbar
      :table="table"
      :filter-options="filterOptions"
      :filter-configs="filterConfigs"
      :filter-counts="filterCounts"
      :current-filters="currentFilters"
      @filter-change="handleFilterChange"
      @search-change="(value) => $emit('searchChange', value)"
    >
      <template #default>
        <slot name="toolbar"></slot>
      </template>
    </DataTableToolbar>
    <div class="rounded-md border bg-background relative" :style="tableStyle">
      <Table :dir="rtl ? 'rtl' : 'ltr'">
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead 
              v-for="header in headerGroup.headers" 
              :key="header.id"
              :class="[
                rtl ? 'text-right' : 'text-left',
                'whitespace-nowrap'
              ]"
            >
              <template v-if="!header.isPlaceholder">
                <component
                  v-if="typeof header.column.columnDef.header === 'function'"
                  :is="header.column.columnDef.header"
                  v-bind="header.getContext()"
                />
                <DataTableColumnHeader
                  v-else
                  :column="header.column"
                  :title="header.column.columnDef.header as string"
                />
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell 
              v-for="cell in row.getVisibleCells()" 
              :key="cell.id"
              :class="rtl ? 'text-right' : 'text-left'"
            >
              <component
                :is="cell.column.columnDef.cell"
                v-bind="{ ...cell, cell: cell, table: table }"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div
        v-if="loading"
        class="absolute inset-0 bg-background/50 flex items-center justify-center"
      >
        <DataTableSpinner />
      </div>
    </div>
    <DataTablePagination
      :table="table"
      :page="page"
      :limit="limit"
      :total-count="totalCount"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import DataTableToolbar from "./DataTableToolbar.vue";
import DataTablePagination from "./DataTablePagination.vue";
import DataTableColumnHeader from "./DataTableColumnHeader.vue";
import DataTableSpinner from "./DataTableSpinner.vue";
import { useI18n } from 'vue-i18n'

interface Props {
  columns: ColumnDef<any>[];
  data: any[];
  filterOptions: unknown[];
  filterConfigs: Record<string, unknown>;
  page: number;
  limit: number;
  totalCount: number;
  filterCounts: Record<string, unknown>;
  loading?: boolean;
  currentFilters?: Record<string, unknown>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'limitChange', limit: number): void
  (e: 'searchChange', search: string): void
  (e: 'filterChange', filterKey: string, newValue: string[]): void
}>();

const { locale } = useI18n()
const rtl = computed(() => locale.value === 'fa')

const rowSelection = ref<RowSelectionState>({});
const columnVisibility = ref<VisibilityState>({});
const columnFilters = ref<ColumnFiltersState>([]);
const sorting = ref<SortingState>([]);
const globalFilter = ref("");
const currentColumns = ref(props.columns);

// Initialize table first
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return currentColumns.value;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
  },
  onSortingChange: (updater) =>
    (sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater),
  onColumnFiltersChange: (updater) =>
    (columnFilters.value =
      typeof updater === "function" ? updater(columnFilters.value) : updater),
  onColumnVisibilityChange: (updater) =>
    (columnVisibility.value =
      typeof updater === "function"
        ? updater(columnVisibility.value)
        : updater),
  onRowSelectionChange: (updater) =>
    (rowSelection.value =
      typeof updater === "function" ? updater(rowSelection.value) : updater),
  onGlobalFilterChange: (updater) =>
    (globalFilter.value =
      typeof updater === "function" ? updater(globalFilter.value) : updater),
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  enableFilters: false,
});

// Then set up watchers
watch(() => props.columns, (newColumns) => {
  if (newColumns) {
    currentColumns.value = newColumns;
    nextTick(() => {
      table.options.columns = newColumns;
      table.reset();
    });
  }
}, { immediate: true });

watch(locale, () => {
  if (currentColumns.value) {
    nextTick(() => {
      table.options.columns = currentColumns.value;
      table.reset();
    });
  }
});

watch(() => props.data, () => {
  table.setPageIndex(0);
});

watch([() => props.page, () => props.limit], () => {
  if (table) {
    table.setPageIndex(props.page - 1)
    table.setPageSize(props.limit)
  }
})

const handlePageChange = (newPage: number) => {
  emit("pageChange", newPage);
};

const handleLimitChange = (newLimit: number) => {
  emit('limitChange', newLimit)
};

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  emit("filterChange", filterKey, newValue);
};

const tableStyle = computed(() => ({
  minHeight: props.data.length === 0 ? "300px" : "auto",
  height: props.data.length > 0 ? "auto" : "300px",
}));

onMounted(() => {
  const updateTableHeight = () => {
    if (props.data.length > 0) {
      const tableElement = document.querySelector(
        ".rounded-md.border.bg-background"
      );
      if (tableElement) {
        (tableElement as HTMLElement).style.height = "auto";
      }
    }
  };

  watch(() => props.data, updateTableHeight, { immediate: true });
});
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <div 
      class="flex items-center gap-2 rtl:space-x-reverse"
      :class="rtl ? 'order-2' : 'order-1'"
    >
      <Input
        :value="globalFilter"
        @update:modelValue="(value) => handleSearchInput(value.toString())"
        :placeholder="t('dataTable.search')"
        class="h-8 w-[150px] lg:w-[180px] rtl:text-right ltr:text-left"
        :class="rtl ? 'order-1' : ''"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        @click="handleReset"
        class="h-8 px-2 lg:px-3"
        :class="rtl ? 'order-3' : ''"
      >
        {{ t('dataTable.reset') }}
        <X class="h-4 w-4 rtl:mr-2 ltr:ml-2" />
      </Button>

      <DataTableFacetedFilter
        v-for="(options, key) in filterConfigs"
        :key="key"
        :column="table.getColumn(key)"
        :title="key"
        :options="options.map((option: any) => ({
          ...option,
          count: filterCounts[key]?.[option.value] || 0
        }))"
        :current-filter="currentFilters[key] || []"
        @filter-change="(newValue) => handleFilterChange(key, newValue)"
        :class="rtl ? 'order-2' : ''"
      />
    </div>

    <div 
      class="flex gap-3 items-center"
      :class="rtl ? 'order-1' : 'order-2'"
    >
      <template v-if="rtl">
        <DataTableViewOptions :table="table" />
        <slot></slot>
      </template>
      <template v-else>
        <slot></slot>
        <DataTableViewOptions :table="table" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'
import { Input } from '../input'
import { Button } from '../button'
import DataTableViewOptions from './DataTableViewOptions.vue'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  filterOptions: {
    type: Array,
    default: () => [],
  },
  filterConfigs: {
    type: Object,
    default: () => ({}),
  },
  filterCounts: {
    type: Object,
    default: () => ({}),
  },
  currentFilters: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['filterChange', 'searchChange'])

const globalFilter = ref('')
const searchDebounce = ref<ReturnType<typeof setTimeout> | null>(null)

const isFiltered = computed(() => {
  return Object.values(props.currentFilters).some(filters => filters.length > 0) || globalFilter.value !== ''
})

const handleSearchInput = (value: string) => {
  console.log('1. handleSearchInput called with:', value)
  globalFilter.value = value
  props.table.setGlobalFilter(value)
  
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }

  searchDebounce.value = setTimeout(() => {
    console.log('2. Debounce timeout reached, value:', value)
    if (value.length >= 3 || value.length === 0) {
      console.log('3. Emitting searchChange with:', value)
      emit('searchChange', value)
    }
  }, 300)
}

const handleReset = () => {
  console.log('4. Reset called')
  props.table.resetColumnFilters()
  globalFilter.value = ''
  props.table.setGlobalFilter('')
  emit('searchChange', '')
  Object.keys(props.currentFilters).forEach(key => {
    emit('filterChange', key, [])
  })
}

const handleFilterChange = (filterKey: string, newValue: string[]) => {
  emit('filterChange', filterKey, newValue)
}

const { t, locale } = useI18n()
const rtl = computed(() => locale.value === 'fa')

onUnmounted(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
})
</script>

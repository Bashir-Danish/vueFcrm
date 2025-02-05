<template>
  <div class="flex items-center justify-between">
    <!-- Total rows section that switches sides based on direction -->
    <div 
      class="text-sm text-muted-foreground"
      :class="[
        rtl ? 'order-2' : 'order-1'
      ]"
    >
      <!-- RTL: Show count on right, text on left -->
      <template v-if="rtl">
        <div class="flex justify-between items-center gap-2">
          <span class="order-2 font-medium">{{ totalCount }}</span>
          <span class="order-1">{{ t('dataTable.pagination.totalRowsText') }}</span>
        </div>
      </template>
      <!-- LTR: Show text first, then count -->
      <template v-else>
        <span class="mr-1 font-medium">{{ totalCount }}</span>
        <span>{{ t('dataTable.pagination.totalRowsText') }}</span>
      </template>
    </div>

    <!-- Pagination controls that switch sides based on direction -->
    <div 
      class="flex items-center justify-between"
      :class="[
        rtl ? 'order-1' : 'order-2',
        rtl ? 'mr-auto' : 'ml-auto'
      ]"
    >
      <!-- Limit selector - Right in RTL -->
      <div 
        class="flex items-center justify-between"
        :class="[
          rtl ? 'order-3 flex-row-reverse' : 'order-1',
          'px-4'
        ]"
      >
        <p 
          class="text-sm font-medium min-w-fit"
          :class="rtl ? 'text-right ml-4' : 'text-left mr-4'"
        >
          {{ t('dataTable.pagination.rowsPerPage') }}
        </p>
        <Select
          :model-value="`${limit}`"
          @update:model-value="(value) => handleLimitChange(Number(value))"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue 
              :placeholder="`${limit}`"
              :class="rtl ? 'text-right' : 'text-left'"
            />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem 
              v-for="pageSize in pageSizes" 
              :key="pageSize" 
              :value="`${pageSize}`"
              :class="[
                rtl ? 'text-right pr-2' : 'text-left pl-2',
                'py-2'
              ]"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <!-- Page text - Center -->
      <div 
        class="flex w-[100px] items-center justify-center text-sm font-medium order-2"
      >
        {{ t('dataTable.pagination.pageOf', { current: page, total: totalPages }) }}
      </div>

      <!-- Navigation buttons - Left in RTL -->
      <div 
        class="flex items-center gap-2" 
        :class="[
          rtl ? 'order-1' : 'order-3'
        ]"
      >
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="page === 1"
          @click="handlePageIndexChange(1)"
        >
          <span class="sr-only">{{ t('dataTable.pagination.first') }}</span>
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page === 1"
          @click="handlePreviousPage"
        >
          <span class="sr-only">{{ t('dataTable.pagination.previous') }}</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page === totalPages"
          @click="handleNextPage"
        >
          <span class="sr-only">{{ t('dataTable.pagination.next') }}</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="page === totalPages"
          @click="handlePageIndexChange(totalPages)"
        >
          <span class="sr-only">{{ t('dataTable.pagination.last') }}</span>
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t, locale } = useI18n()

// RTL/LTR handling
const rtl = computed(() => locale.value === 'fa')

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['pageChange', 'limitChange'])

// Define available page sizes
const pageSizes = [5, 10, 20, 30, 50, 100]

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalCount / props.limit)))

const handleLimitChange = (newSize: number) => {
  if (pageSizes.includes(newSize)) {
    emit('limitChange', newSize)
  }
}

const handlePreviousPage = () => {
  if (props.page > 1) {
    emit('pageChange', props.page - 1)
  }
}

const handleNextPage = () => {
  if (props.page < totalPages.value) {
    emit('pageChange', props.page + 1)
  }
}

const handlePageIndexChange = (newIndex: number) => {
  if (newIndex >= 1 && newIndex <= totalPages.value) {
    emit('pageChange', newIndex)
  }
}
</script>
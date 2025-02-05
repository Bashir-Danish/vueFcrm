<template>
  <div :class="['flex items-center', className]">
    <DropdownMenu v-if="column.getCanSort()">
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 rtl:-mr-3 ltr:-ml-3 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <ArrowDownIcon
            v-if="column.getIsSorted() === 'desc'"
            class="h-4 w-4 rtl:mr-2 ltr:ml-2"
          />
          <ArrowUpIcon
            v-else-if="column.getIsSorted() === 'asc'"
            class="h-4 w-4 rtl:mr-2 ltr:ml-2"
          />
          <CaretSortIcon 
            v-else 
            class="h-4 w-4 rtl:mr-2 ltr:ml-2"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @select="column.toggleSorting(false)">
          <ArrowUpIcon class="h-3.5 w-3.5 text-muted-foreground/70 rtl:ml-2 ltr:mr-2" />
          {{ t('dataTable.sort.asc') }}
        </DropdownMenuItem>
        <DropdownMenuItem @select="column.toggleSorting(true)">
          <ArrowDownIcon class="h-3.5 w-3.5 text-muted-foreground/70 rtl:ml-2 ltr:mr-2" />
          {{ t('dataTable.sort.desc') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @select="column.toggleVisibility(false)">
          <EyeNoneIcon class="h-3.5 w-3.5 text-muted-foreground/70 rtl:ml-2 ltr:mr-2" />
          {{ t('dataTable.column.hide') }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div v-else>{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from '@radix-icons/vue'
import { Column } from '@tanstack/vue-table'
import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu'

const { t } = useI18n()


defineProps<{
  column: Column<any, any>
  title: string
  className?: string
}>()
</script>
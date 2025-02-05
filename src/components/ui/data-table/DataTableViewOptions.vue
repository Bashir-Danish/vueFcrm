<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        size="sm" 
        class="h-8 rtl:mr-auto ltr:ml-auto hidden lg:flex"
      >
        <MixerHorizontalIcon class="h-4 w-4 rtl:ml-2 ltr:mr-2" />
        {{ t('dataTable.view') }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuLabel>{{ t('dataTable.toggleColumns') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="column in table.getAllColumns().filter(
          (column:any) => column.getCanHide()
        )"
        :key="column.id"
        :checked="column.getIsVisible()"
        @select="column.toggleVisibility()"
        class="rtl:text-right ltr:text-left"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '../dropdown-menu'
import { MixerHorizontalIcon } from '@radix-icons/vue'

const { t } = useI18n()


defineProps({
  table: {
    type: Object,
    required: true,
  },
})
</script>
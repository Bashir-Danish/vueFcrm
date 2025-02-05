<template>
  <Popover>
    <PopoverTrigger 
    as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed border-gray-400">
        <PlusCircledIcon class="h-4 w-4 rtl:ml-2 ltr:mr-2" />
        <span class="rtl:text-right ltr:text-left">{{ title }}</span>
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="h-4 mx-2" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden lg:flex space-x-1 rtl:space-x-reverse">
            <template v-if="selectedValues.size > 2">
              <Badge
                variant="secondary"
                class="rounded-sm px-1 font-normal rtl:text-right ltr:text-left"
              >
                {{ selectedValues.size }} {{ t('dataTable.filter.selected') }}
              </Badge>
            </template>
            <template v-else>
              <Badge
                v-for="option in selectedOptions"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal rtl:text-right ltr:text-left"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command>
        <CommandInput :placeholder="title" class="rtl:text-right ltr:text-left" />
        <CommandList>
          <CommandEmpty class="rtl:text-right ltr:text-left">
            {{ t('dataTable.filter.noResults') }}
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="() => handleSelect(option.value)"
              class="rtl:text-right ltr:text-left"
            >
              <div
                :class="[
                  'flex h-4 w-4 items-center justify-center rounded-sm border border-primary rtl:ml-2 ltr:mr-2',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                ]"
              >
                <CheckIcon class="h-4 w-4" />
              </div>
              <component
                :is="option.icon"
                v-if="option.icon"
                class="h-4 w-4 text-muted-foreground rtl:ml-2 ltr:mr-2"
              />
              <span class="rtl:text-right ltr:text-left">{{ option.label }} ({{ option.count }})</span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem 
                @select="handleReset" 
                class="justify-center text-center rtl:text-right ltr:text-left" 
                :value="'reset'"
              >
                <Cross2Icon class="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                {{ t('dataTable.reset') }}
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckIcon, PlusCircledIcon, Cross2Icon } from '@radix-icons/vue'
import { Column } from '@tanstack/vue-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface Option {
  label: string
  value: string
  icon?: any
  count: number
}

interface Props {
  column?: Column<any, any>
  title?: string
  options: Option[]
  onFilterChange?: (newValue: string[]) => void
  currentFilter: string[]
}

const props = withDefaults(defineProps<Props>(), {
  currentFilter: () => [],
})

const selectedValuesSet = ref(new Set(props.currentFilter))

const selectedValues = computed(() => selectedValuesSet.value)

const selectedOptions = computed(() => 
  props.options.filter(option => selectedValues.value.has(option.value))
)

const handleSelect = (value: string) => {
  const updatedFilter = selectedValues.value.has(value)
    ? props.currentFilter.filter(filter => filter !== value)
    : [...props.currentFilter, value]
  
  props.onFilterChange?.(updatedFilter)
}

const handleReset = () => {
  props.onFilterChange?.([])
}

watch(() => props.currentFilter, (newFilter) => {
  selectedValuesSet.value = new Set(newFilter)
}, { immediate: true })

onMounted(() => {
  if (props.currentFilter.length > 0) {
    props.onFilterChange?.(props.currentFilter)
  }
})

const { t } = useI18n()
</script>
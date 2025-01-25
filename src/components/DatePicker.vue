<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import moment from 'moment-jalaali'
import JalaliCalendar from '@/components/ui/JalaliCalendar.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: Date,
  class?: string 
}>()

const emit = defineEmits(['update:modelValue'])
const { locale } = useI18n()

const date = ref<moment.Moment>(moment(props.modelValue))
const currentMonth = ref<moment.Moment>(moment(props.modelValue).startOf('jMonth' as moment.unitOfTime.StartOf))
let isJalali = ref(true)

const direction = computed(() => {
  return locale.value === 'fa' ? 'rtl' : 'ltr'
})

watch(() => props.modelValue, (newValue) => {
  date.value = moment(newValue)
  currentMonth.value = moment(newValue).startOf((isJalali.value ? 'jMonth' : 'month') as moment.unitOfTime.StartOf)
}, { immediate: true })

const updateDate = (newDate: moment.Moment) => {
  date.value = newDate
  currentMonth.value = newDate.clone().startOf((isJalali.value ? 'jMonth' : 'month') as moment.unitOfTime.StartOf)
  emit('update:modelValue', newDate.toDate())
}

const formatDate = computed(() => {
  return isJalali.value ? date.value.format('jYYYY/jMM/jDD') : date.value.format('YYYY/MM/DD')
})

const toggleCalendar = () => {
  isJalali.value = !isJalali.value
  if (isJalali.value) {
    // Switching to Jalali
    currentMonth.value = moment(date.value).startOf('jMonth' as moment.unitOfTime.StartOf)
  } else {
    // Switching to Gregorian
    currentMonth.value = moment(date.value).startOf('month' as moment.unitOfTime.StartOf)
  }
}

const changeMonth = (direction: 'next' | 'prev') => {
  const unit = isJalali.value ? 'jMonth' : 'month'
  currentMonth.value = direction === 'next'
    ? currentMonth.value.clone().add(1, unit as moment.unitOfTime.DurationConstructor)
    : currentMonth.value.clone().subtract(1, unit as moment.unitOfTime.DurationConstructor)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button 
        variant="outline" 
        :class="[
          'w-[240px] justify-start text-left font-normal select-none',
          props.class // Apply any custom classes passed in
        ]"
        :dir="direction"
      >
        <CalendarIcon :class="[direction === 'rtl' ? 'ml-2' : 'mr-2', 'h-4 w-4']" />
        {{ formatDate }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <JalaliCalendar
        :current-month="currentMonth"
        :selected="date"
        :is-jalali="isJalali"
        @update:model-value="updateDate"
        @change-month="changeMonth"
        class="rounded-md border"
      />
      <div class="p-3 border-t">
        <Button @click="toggleCalendar" size="sm" class="w-full">
          {{ isJalali ? 'Switch to Gregorian' : 'Switch to Jalali' }}
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

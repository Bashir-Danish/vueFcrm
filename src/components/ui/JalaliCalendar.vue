<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment, { Moment } from "moment-jalaali";

type CalendarSystem = "jalali" | "gregorian";

const props = defineProps<{
  currentMonth: Moment;
  selected?: Moment | null;
  isJalali: boolean;
  class?: string;
}>();

const emit = defineEmits(["update:model-value", "change-month"]);

const weekDays = computed(() =>
  props.isJalali
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
);
const afghanMonths = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];

const internalCurrentMonth = ref(props.currentMonth.clone());

watch(
  () => props.currentMonth,
  (newValue) => {
    internalCurrentMonth.value = newValue.clone();
  },
  { deep: true }
);

watch(
  () => props.isJalali,
  () => {
    internalCurrentMonth.value = props.isJalali
      ? moment(internalCurrentMonth.value).startOf("jMonth")
      : moment(internalCurrentMonth.value).startOf("month");
  }
);

const calendarSystem = computed<CalendarSystem>(() =>
  props.isJalali ? "jalali" : "gregorian"
);

const startOf = (date: Moment, unit: "month" | "week"): Moment => {
  if (calendarSystem.value === "jalali") {
    if (unit === "month") {
      return date.clone().startOf("jMonth");
    } else {
      const clone = date.clone();
      const dayOfWeek = clone.day();
      return clone.subtract((dayOfWeek + 1) % 7, "days").startOf("day");
    }
  } else {
    return date.clone().startOf(unit);
  }
};

const endOf = (date: Moment, unit: "month" | "week"): Moment => {
  if (calendarSystem.value === "jalali") {
    if (unit === "month") {
      return date.clone().endOf("jMonth");
    } else {
      const clone = date.clone();
      const dayOfWeek = clone.day();
      return clone.add(6 - (dayOfWeek + 1) % 7, "days").endOf("day");
    }
  } else {
    return date.clone().endOf(unit);
  }
};

const daysInMonth = computed(() => {
  const start = startOf(startOf(internalCurrentMonth.value, "month"), "week");
  const end = endOf(endOf(internalCurrentMonth.value, "month"), "week");
  const days: Moment[] = [];

  let day = start.clone();
  while (day.isBefore(end) || day.isSame(end, 'day')) {
    days.push(day.clone());
    day.add(1, "day");
  }

  return days;
});

const formatMonthYear = computed(() => {
  if (calendarSystem.value === "jalali") {
    const jMonth = internalCurrentMonth.value.jMonth();
    const jYear = internalCurrentMonth.value.jYear();
    return `${afghanMonths[jMonth]} ${jYear}`;
  } else {
    return internalCurrentMonth.value.format("MMMM YYYY");
  }
});

const handleSelect = (date: Moment) => {
  if (!date.isSame(props.selected, "day")) {
    emit("update:model-value", date.clone());
  }
};

const changeMonth = (direction: "next" | "prev") => {
  if (calendarSystem.value === "jalali") {
    internalCurrentMonth.value =
      direction === "next"
        ? internalCurrentMonth.value.clone().add(1, "jMonth")
        : internalCurrentMonth.value.clone().subtract(1, "jMonth");
  } else {
    internalCurrentMonth.value =
      direction === "next"
        ? internalCurrentMonth.value.clone().add(1, "month")
        : internalCurrentMonth.value.clone().subtract(1, "month");
  }
  emit("change-month", direction);
};

const isSameMonth = (date: Moment, baseDate: Moment): boolean => {
  return calendarSystem.value === "jalali"
    ? date.jMonth() === baseDate.jMonth() && date.jYear() === baseDate.jYear()
    : date.month() === baseDate.month() && date.year() === baseDate.year();
};

const getDate = (date: Moment): number => {
  return calendarSystem.value === "jalali" ? date.jDate() : date.date();
};
</script>

<template>
  <div :class="cn('p-3', props.class)">
    <div class="flex justify-between items-center mb-4">
      <button
        @click="changeMonth('prev')"
        :class="buttonVariants({ variant: 'outline' })"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
      <div>
        {{ formatMonthYear }}
      </div>
      <button
        @click="changeMonth('next')"
        :class="buttonVariants({ variant: 'outline' })"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
    </div>
    <div class="grid grid-cols-7 gap-1" :class="{ 'direction-rtl': props.isJalali }">
      <span
        v-for="day in weekDays"
        :key="day"
        class="text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md text-[0.8rem] font-medium"
      >
        {{ day }}
      </span>
    </div>
    <div class="grid grid-cols-7 gap-1 mt-1" :class="{ 'direction-rtl': props.isJalali }">
      <button
        v-for="day in daysInMonth"
        :key="day.format('YYYY-MM-DD')"
        @click="handleSelect(day)"
        :class="[ 
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal',
          day.isSame(props.selected, 'day') && 'bg-primary text-primary-foreground', 
          !isSameMonth(day, internalCurrentMonth) && 'text-muted-foreground opacity-50',
          day.isSame(moment(), 'day') && 'bg-muted text-current'
        ]"
      >
        {{ getDate(day) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.direction-rtl {
  direction: rtl;
}
</style>

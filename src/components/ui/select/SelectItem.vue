<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
  useForwardProps,
} from "radix-vue";
import { CheckIcon } from "@radix-icons/vue";
import { cn } from "@/lib/utils";
import { useI18n } from "vue-i18n";

const props = defineProps<
  SelectItemProps & { class?: HTMLAttributes["class"] }
>();

const { locale } = useI18n();

const direction = computed(() => {
  return locale.value === "fa" ? "rtl" : "ltr";
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const paddingClasses = computed(() => {
  return direction.value === "rtl" ? "pr-2 pl-8" : "pl-2 pr-8";
});

const indicatorClasses = computed(() => {
  return direction.value === "rtl" ? "left-2" : "right-2";
});
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :dir="direction"
    :class="
      cn(
        `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 ${paddingClasses} text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        props.class
      )
    "
  >
    <span
      :class="`absolute ${indicatorClasses} flex h-3.5 w-3.5 items-center justify-center`"
    >
      <SelectItemIndicator>
        <CheckIcon class="h-4 w-4" />
      </SelectItemIndicator>
    </span>

    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>

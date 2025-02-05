<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'radix-vue'
import { SelectRoot, useForwardPropsEmits } from 'radix-vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps<SelectRootProps>()
const emits = defineEmits<SelectRootEmits>()

const { locale } = useI18n()

const direction = computed(() => {
  return locale.value === 'fa' ? 'rtl' : 'ltr'
})

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SelectRoot v-bind="forwarded" :dir="direction" :class="direction">
    <slot />
  </SelectRoot>
</template>

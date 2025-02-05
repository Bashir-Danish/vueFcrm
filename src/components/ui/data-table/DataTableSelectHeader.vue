<template>
  <span 
    class="text-sm font-medium cursor-pointer hover:text-primary"
    @click="table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())"
  >
    {{ t('creditCheck.columns.select') }}
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  table: {
    type: Object,
    required: true
  }
})
</script> 
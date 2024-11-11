<template>
  <a v-if="external" :href="link" target="_blank" rel="noopener noreferrer">
    <slot></slot>
  </a>
  <RouterLink v-else :to="link || ''">
    <slot></slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
  external: Boolean,
  link: String,
});
</script>
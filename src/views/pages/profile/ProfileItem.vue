<template>
  <div
    :class="[
      'group relative overflow-hidden bg-gradient-to-br from-accent to-accent/50 dark:from-accent dark:to-accent/50 p-4 rounded-lg shadow-md transition-all duration-500 hover:shadow hover:scale-102',
      { 'opacity-100 translate-y-0': animate, 'opacity-0 translate-y-10': !animate }
    ]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary-foreground transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
    <div class="flex items-center">
      <div class="text-primary dark:text-primary text-xl mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
        <component :is="icon" />
      </div>
      <div>
        <p class="text-xs font-semibold text-muted-foreground mb-0.5">{{ label }}</p>
        <p class="text-sm text-foreground font-medium">{{ value }}</p>
      </div>
    </div>
    <div class="absolute bottom-0 right-0 w-8 h-8 bg-primary/10 dark:bg-primary/10 rounded-tl-full transform translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ProfileItem',
  props: {
    icon: {
      type: [Object, Function] as PropType<any>,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 0
    },
    animate: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="data-table-loader">
      <div v-for="i in 5" :key="i" class="dot"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this loader
</script>

<style scoped>
.data-table-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.dot {
  width: 12px;
  height: 12px;
  margin: 0 4px;
  border-radius: 50%;
  background-color: hsl(var(--primary));
  animation: data-table-loader 1.5s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.30s; }
.dot:nth-child(2) { animation-delay: -0.15s; }
.dot:nth-child(3) { animation-delay: 0s; }
.dot:nth-child(4) { animation-delay: 0.15s; }
.dot:nth-child(5) { animation-delay: 0.30s; }

@keyframes data-table-loader {
  0%, 100% {
    transform: scale(0.2) translateY(0);
  }
  50% {
    transform: scale(1) translateY(-10px);
  }
}
</style>
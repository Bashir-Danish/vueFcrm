<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  steps: { title: string, accessible: boolean }[]
  currentStep: number
}>()

const emit = defineEmits(['step-click'])


const handleStepClick = (index: number) => {
  if (props.steps[index].accessible) {
    emit('step-click', index)
  }
}

const lineWidth = computed(() => {
  return `${100 / (props.steps.length - 1)}%`
})
</script>

<template>
  <div class="flex justify-center border-b border-primary/5 py-4 shadow-md">
    <ol class="flex items-center select-none w-[40%] max-w-4xl">
      <li v-for="(step, index) in steps" :key="index" class="flex flex-col items-center flex-1 relative">
        <div class="flex items-center w-full">
          <div 
            class="w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-sm cursor-pointer z-10"
            :class="[
              index === currentStep ? 'border border-primary ' : '',
              index < currentStep ? 'bg-green-500 text-white' : 'border border-muted',
              !step.accessible ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            @click="handleStepClick(index)"
          >
            <svg v-if="index < currentStep" class="w-3 h-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div v-if="index < steps.length - 1" class="h-0.5 flex-1" :style="{ width: lineWidth }">
            <div class="h-full bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-500 transition-all duration-300"
                :style="{ width: index < currentStep ? '100%' : '0%' }"
              ></div>
            </div>
          </div>
        </div>
        <span 
          class="mt-1 text-xs font-medium whitespace-nowrap absolute"
          :class="{ 
            'text-primary font-semibold': index === currentStep,
            'text-green-500': index < currentStep,
            'text-gray-500': index > currentStep,
            'opacity-50': !step.accessible,
            'rtl:right-[-10%] ltr:left-[-10%]': true
          }"
          :style="{ top: '80%' }"
        >
          {{ step.title }}
        </span>
      </li>
    </ol>
  </div>
</template>

<template>
  <main class="relative lg:flex">
    <section class="flex min-h-screen flex-1 pb-6 pt-5 max-md:pb-5 sm:px-5 items-center justify-center">
      <div class="min-w-[350px]">
        <slot></slot>
      </div>
    </section>
    <section class="h-screen flex-1 flex-col max-md:pb-0 hidden lg:block relative">
      <img
        src="https://source.unsplash.com/random/1920x1080/?nature,water"
        alt="Auth Background"
        class="object-cover dark:brightness-[0.2] dark:grayscale border absolute inset-0 w-full h-full"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
</script>
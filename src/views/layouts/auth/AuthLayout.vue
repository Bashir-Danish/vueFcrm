<template>
  <main class="relative lg:flex">
    <section class="flex min-h-screen flex-1 pb-6 pt-5 max-md:pb-5 sm:px-5 items-center justify-center">
      <div class="min-w-[350px]">
        <router-view></router-view>
      </div>
    </section>
    <section class="h-screen flex-1 flex-col max-md:pb-0 hidden lg:block relative">
      <img
        src="https://th.bing.com/th/id/R.283b84813494b3454eb68e310e168bc8?rik=u4adfaS%2bls5lcQ&riu=http%3a%2f%2fstuckmicavcast.com%2fwp-content%2fuploads%2f2020%2f01%2fIMG_3349-e1580489884979.jpeg&ehk=i%2fldrvKEeQ7173R5VDu4mZ%2fQ%2f0k%2bd1eJ0VyJ5QPqpdg%3d&risl=&pid=ImgRaw&r=0"
        alt="Auth background"
        class="object-cover dark:brightness-[0.2] dark:grayscale border w-full h-full"
      />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout'
})
</script>
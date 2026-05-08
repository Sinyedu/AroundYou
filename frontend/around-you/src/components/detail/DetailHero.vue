<template>
  <div>
    <div
      class="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[62vh] md:min-h-[480px]"
    >
      <img :src="heroImage" :alt="title" class="h-full w-full object-cover object-center" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#094b7b]/20 via-[#094b7b]/10 to-[#094b7b]/20"
      ></div>
    </div>

    <div class="relative -mt-12 px-4 pb-8 md:-mt-20">
      <div
        class="mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-[#C1D2DE]/70 bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(9,75,123,0.12)] md:px-10 md:py-11"
      >
        <p
          v-if="loading"
          class="rounded-full bg-[#C1D2DE]/35 px-4 py-1 text-sm font-semibold text-[#094b7b]"
        >
          {{ loadingText }}
        </p>

        <p
          v-else-if="error"
          class="rounded-full bg-[#de5826]/10 px-4 py-1 text-sm font-semibold text-[#de5826]"
        >
          {{ error }}
        </p>

        <h1 class="text-5xl font-black tracking-tight text-[#094b7b] md:text-7xl">
          {{ title }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
  heroImage: string
  loading: boolean
  loadingText: string
  title: string
}>()
</script>

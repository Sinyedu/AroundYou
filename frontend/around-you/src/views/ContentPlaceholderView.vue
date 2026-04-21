<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section class="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]">
      <div class="border-b border-[#094b7b]/10 bg-[#C1D2DE] px-8 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#de5826]">Around You</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-[#094b7b]">{{ title }}</h1>
      </div>

      <div class="px-8 py-10">
        <p class="max-w-3xl text-lg leading-8 text-slate-600">{{ description }}</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
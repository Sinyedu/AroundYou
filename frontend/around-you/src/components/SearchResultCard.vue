<template>
  <article
    class="rounded-3xl bg-slate-50 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div
      class="h-40 rounded-2xl bg-cover bg-center"
      :style="{ backgroundImage: `url(${result.image})` }"
    />
    <div class="mt-4 space-y-2">
      <div
        class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        <span>{{ result.type }}</span>
        <span>{{ result.location }}</span>
      </div>
      <h3 class="text-base font-semibold text-slate-900">
        {{ result.title }}
      </h3>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SearchResult } from '@/types/search-result'

defineProps<{
  result: SearchResult
}>()
</script>

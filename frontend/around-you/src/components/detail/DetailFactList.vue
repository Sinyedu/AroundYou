<template>
  <dl class="space-y-4">
    <div v-for="fact in facts" :key="fact.label">
      <dt class="text-sm font-bold text-[#094b7b]">{{ fact.label }}</dt>
      <dd class="mt-0.5 text-sm text-slate-600">
        <a
          v-if="fact.href"
          :href="fact.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[#094b7b] underline underline-offset-2"
        >
          {{ fact.value }}
        </a>
        <template v-else>{{ fact.value }}</template>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { DetailFact } from '@/composables/detail/detailView.helpers'

defineProps<{
  facts: DetailFact[]
}>()
</script>

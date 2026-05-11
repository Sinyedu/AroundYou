<template>
  <component
    :is="href ? RouterLink : 'article'"
    :to="href"
    class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="h-40 shrink-0 bg-[#C1D2DE]/35">
      <img
        v-if="result.image && !imageFailed"
        :src="result.image"
        :alt="result.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="imageFailed = true"
      />
      <div v-else class="flex h-full items-center justify-center px-4 text-center">
        <span class="text-sm font-semibold text-[#094b7b]/70">{{ result.title }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-3">
      <p class="text-sm font-semibold text-[#094b7b]">{{ result.title }}</p>
      <p class="mt-1 line-clamp-3 text-xs leading-relaxed text-gray-500">
        {{ result.description }}
      </p>

      <div class="mt-1 flex flex-wrap items-center gap-1">
        <span class="text-xs font-bold text-gray-800">{{ result.rating.toFixed(1) }}</span>
        <span class="text-xs text-[#de5826]" aria-hidden="true">☆☆☆☆☆</span>
        <span class="text-xs text-gray-400">{{ result.date || result.location }}</span>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="tag in visibleTags"
          :key="tag"
          class="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { SearchResult } from '@/types/search'

const props = defineProps<{
  result: SearchResult
}>()

const imageFailed = ref(false)

const href = computed(() => {
  if (props.result.type === 'city') return `/city/${props.result.id}`
  if (props.result.type === 'event') return `/event/${props.result.id}`
  return `/attraction/${props.result.id}`
})

const visibleTags = computed(() =>
  [props.result.type, props.result.location, ...props.result.categories].filter(Boolean),
)
</script>

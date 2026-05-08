<template>
  <div class="flex items-center gap-3 border-t border-[#C1D2DE]/60 pt-6">
    <span class="text-2xl font-black text-[#094b7b]">
      {{ rating !== null ? rating.toFixed(1) : '-' }}
    </span>
    <div class="flex text-[#de5826]">
      <span v-for="star in stars" :key="star.index" class="text-lg">
        {{ star.symbol }}
      </span>
    </div>
    <span class="text-xs uppercase tracking-wide text-slate-400">Bedømmelse</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rating: number | null
}>()

const stars = computed(() =>
  Array.from({ length: 5 }, (_, index) => {
    const starIndex = index + 1

    return {
      index: starIndex,
      symbol:
        props.rating !== null
          ? starIndex <= Math.floor(props.rating) || starIndex - props.rating < 1
            ? '★'
            : '☆'
          : '☆',
    }
  }),
)
</script>

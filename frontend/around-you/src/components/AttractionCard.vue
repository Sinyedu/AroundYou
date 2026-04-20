<template>
  <div
    class="group rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
  >
    <img
      :src="card.image"
      :alt="card.name"
      class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div class="p-3">
      <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
      <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
      <div class="flex items-center gap-1 mt-1">
        <span class="text-xs font-bold text-gray-800">{{ card.rating }}</span>
        <div class="flex text-[#de5826]">
          <span v-for="n in 5" :key="n" class="text-xs">
            {{ n <= Math.floor(card.rating) ? '★' : n - card.rating < 1 ? '★' : '☆' }}
          </span>
        </div>
        <span v-if="card.metaText" class="text-xs text-gray-400">{{ card.metaText }}</span>
        <span v-else class="text-xs text-gray-400">({{ card.reviews.toLocaleString() }})</span>
      </div>
      <div class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in card.tags"
          :key="tag"
          class="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  card: {
    id: number | string
    name: string
    description: string
    image: string
    rating: number
    reviews: number
    tags: string[]
    metaText?: string
  }
}>()
</script>
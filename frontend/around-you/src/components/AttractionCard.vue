<template>
  <component
    :is="card.href ? RouterLink : 'div'"
    :to="card.href"
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
        <span class="text-xs font-bold text-gray-800">{{ displayRating.toFixed(1) }}</span>
        <div class="flex text-[#de5826]">
          <span v-for="starIndex in 5" :key="starIndex" class="text-xs">
            {{
              starIndex <= Math.floor(displayRating)
                ? '★'
                : starIndex - displayRating < 1
                  ? '★'
                  : '☆'
            }}
          </span>
        </div>
        <span v-if="card.metaText" class="text-xs text-gray-400">{{ card.metaText }}</span>
        <span v-else class="text-xs text-gray-400"
          >({{ displayReviewsCount.toLocaleString() }})</span
        >
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
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getReviewsByTarget } from '@/api/reviews.api'
import type { ExperienceCard } from '@/types/experience-card'

const props = defineProps<{
  card: ExperienceCard
}>()

const reviewAverage = ref<number | null>(null)
const reviewCount = ref<number | null>(null)

const displayRating = computed(() => reviewAverage.value ?? props.card.rating)
const displayReviewsCount = computed(() => reviewCount.value ?? props.card.reviews)

watch(
  () => props.card.id,
  async (targetId) => {
    try {
      const reviews = await getReviewsByTarget(targetId)
      reviewCount.value = reviews.length
      reviewAverage.value =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : null
    } catch {
      reviewCount.value = null
      reviewAverage.value = null
    }
  },
  { immediate: true },
)
</script>

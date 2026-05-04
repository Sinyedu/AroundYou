<template>
  <section aria-label="Anmeldelser">
    <h2 class="mb-6 text-lg font-bold text-[#de5826]">Anmeldelser</h2>

    <div v-if="loading" class="text-sm text-slate-500">Henter anmeldelser...</div>
    <p v-else-if="error" class="text-sm text-[#de5826]">{{ error }}</p>
    <p v-else-if="reviews.length === 0" class="text-sm text-slate-500">Ingen anmeldelser endnu.</p>

    <ul v-else class="space-y-4">
      <li v-for="review in reviews" :key="review._id" class="rounded-xl border border-[#C1D2DE]/70 bg-white p-4">
        <div class="mb-2 flex items-center justify-between gap-3">
          <p class="text-sm font-semibold text-[#de5826]">{{ review.author }}</p>
          <div class="flex text-[#de5826]">
            <span v-for="star in 5" :key="star" class="text-xs">{{ star <= review.rating ? '★' : '☆' }}</span>
          </div>
        </div>
        <h3 class="mb-1 text-sm font-semibold text-[#094b7b]">{{ review.title }}</h3>
        <p class="text-sm text-slate-600">{{ review.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ReviewTargetType = 'city' | 'event' | 'attraction'

type ReviewItem = {
  _id: string
  targetId: string
  targetType: ReviewTargetType
  author: string
  title: string
  description: string
  rating: number
}

const API_BASE_URL = 'http://localhost:4000/api'

async function getReviewsByTarget(targetId: string): Promise<ReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/reviews/target/${encodeURIComponent(targetId)}`)
  if (!response.ok) {
    throw new Error('Kunne ikke hente anmeldelser')
  }

  return response.json() as Promise<ReviewItem[]>
}

const props = defineProps<{
  targetId: string
  targetType: ReviewTargetType
}>()

const emit = defineEmits<{
  (e: 'average-rating', value: number | null): void
}>()

const reviews = ref<ReviewItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const averageRating = computed(() => {
  if (reviews.value.length === 0) return null
  const sum = reviews.value.reduce((acc: number, review: ReviewItem) => acc + review.rating, 0)
  return sum / reviews.value.length
})

watch(averageRating, (value) => {
  emit('average-rating', value)
}, { immediate: true })

watch(
  () => props.targetId,
  async (targetId) => {
    if (!targetId) {
      reviews.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      reviews.value = await getReviewsByTarget(targetId)
    } catch {
      error.value = 'Kunne ikke hente anmeldelser.'
      reviews.value = []
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

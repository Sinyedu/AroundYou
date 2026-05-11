<template>
  <section class="px-4 py-8 sm:px-8 sm:py-12">
    <h2 :class="titleClassName">{{ title }}</h2>
    <p :class="descriptionClassName">{{ description }}</p>

    <p v-if="loading" class="text-sm text-gray-500 text-center mb-8">
      {{ loadingText }}
    </p>

    <p v-else-if="error" class="text-sm text-red-600 text-center mb-8">
      {{ error }}
    </p>

    <p v-else-if="!cards.length" class="text-sm text-gray-500 text-center mb-8">
      {{ emptyText }}
    </p>

    <div v-if="showCards" class="grid grid-cols-4 gap-4">
      <CardComponent v-for="card in cards" :key="card.id" :card="card" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import type { ExperienceCard as ExperienceCardData } from '@/types/experience-card'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    loadingText: string
    emptyText: string
    cards: ExperienceCardData[]
    loading: boolean
    error: string | null
    titleClass?: string
    descriptionClass?: string
  }>(),
  {
    titleClass: 'text-xl sm:text-3xl font-extrabold text-[#094b7b] text-center mb-2',
    descriptionClass: 'text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8',
  },
)

const showCards = computed(() => !props.loading && !props.error && props.cards.length > 0)
const titleClassName = computed(() => props.titleClass)
const descriptionClassName = computed(() => props.descriptionClass)
</script>

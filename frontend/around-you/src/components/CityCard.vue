<template>
    <component
        :is="card.href ? RouterLink : 'div'"
        :to="card.href"
        :class="cardClass">
        <img :src="card.image" :alt="card.name"
            class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div class="p-3">
            <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
            <p class="text-xs text-gray-700 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
            <div class="flex items-center gap-1 mt-1">
                <span class="text-xs font-bold text-gray-800">{{ displayRating.toFixed(1) }}</span>
                <div class="flex text-[#de5826]">
                    <span v-for="starIndex in 5" :key="starIndex" class="text-xs">
                        {{ starIndex <= Math.floor(displayRating) ? '★' : starIndex - displayRating < 1 ? '★' : '☆' }}
                            </span>
                </div>
                <span v-if="card.metaText" class="text-xs text-gray-700">{{ card.metaText }}</span>
                <span v-else class="text-xs text-gray-700">({{ displayReviewsCount.toLocaleString() }})</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="tag in card.tags" :key="tag"
                    class="text-[10px] text-gray-700 border border-gray-200 rounded-full px-2 py-0.5">
                    {{ tag }}
                </span>
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { ExperienceCard } from '@/types/attractions'

const props = defineProps<{
    card: ExperienceCard
    variant?: 'default' | 'search'
}>()

const cardClass = computed(() =>
    [
        'group cursor-pointer overflow-hidden shadow-sm transition-shadow hover:shadow-md',
        props.variant === 'search'
            ? 'h-full rounded-2xl border-2 border-[#C1D2DE] bg-white'
            : 'rounded-xl border border-gray-100 bg-[#C1D2DE]',
    ].join(' '),
)

const displayRating = computed(() => props.card.rating)
const displayReviewsCount = computed(() => props.card.reviews)
</script>

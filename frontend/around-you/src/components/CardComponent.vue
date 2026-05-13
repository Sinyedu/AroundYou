<template>
  <component :is="card.href ? RouterLink : 'div'" :to="card.href" :class="cardClass">
    <div class="h-40 w-full shrink-0 bg-[#C1D2DE]/35">
      <img
        v-if="resolvedImage && !imageFailed"
        :src="resolvedImage"
        :alt="card.name"
        :class="imageClass"
        @error="imageFailed = true"
      />
      <div v-else :class="fallbackClass">
        <span class="text-sm font-semibold text-[#094b7b]/70">{{ card.name }}</span>
      </div>
    </div>

    <div class="p-3">
      <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
      <p :class="descriptionClass">{{ card.description }}</p>

      <div class="mt-1 flex items-center gap-1">
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
        <span v-if="card.metaText" :class="metaClass">{{ card.metaText }}</span>
        <span v-else :class="metaClass">({{ displayReviewsCount.toLocaleString() }})</span>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
        <span v-for="tag in card.tags" :key="tag" :class="tagClass">
          {{ tag }}
        </span>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getCardComponentClass,
  getCardComponentDescriptionClass,
  getCardComponentFallbackClass,
  getCardComponentImageClass,
  getCardComponentMetaClass,
  getCardComponentTagClass,
  type CardComponentItem,
  type CardComponentSurface,
  type CardComponentVariant,
} from '@/components/cardComponent.helpers'
import { resolveApiAssetUrl } from '@/constants/config'

const props = withDefaults(
  defineProps<{
    card: CardComponentItem
    variant?: CardComponentVariant
    surface?: CardComponentSurface
  }>(),
  {
    variant: 'default',
    surface: 'white',
  },
)

const imageFailed = ref(false)

const cardClass = computed(() => getCardComponentClass(props.variant, props.surface))
const imageClass = computed(() => getCardComponentImageClass())
const fallbackClass = computed(() => getCardComponentFallbackClass())
const displayRating = computed(() => props.card.rating)
const displayReviewsCount = computed(() => props.card.reviews)
const descriptionClass = computed(() => getCardComponentDescriptionClass(props.surface))
const metaClass = computed(() => getCardComponentMetaClass(props.surface))
const tagClass = computed(() => getCardComponentTagClass(props.surface))
const resolvedImage = computed(() => resolveApiAssetUrl(props.card.image))

watch(
  () => props.card.image,
  () => {
    imageFailed.value = false
  },
)
</script>

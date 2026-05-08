<template>
  <main class="min-h-screen bg-[#f5f7f9]">
    <DetailHero
      :hero-image="heroImage"
      :title="displayAttractionName"
      :loading="attractionLoading"
      :error="attractionError"
      loading-text="Henter attraktion..."
    />

    <div
      v-if="attraction && !attractionLoading"
      class="mx-auto mt-10 max-w-5xl space-y-10 px-4 pb-20 md:px-8"
    >
      <div class="grid grid-cols-1 gap-20 md:grid-cols-[2fr_1fr]">
        <section>
          <h2 class="mb-3 text-lg font-bold text-[#de5826]">Om attraktionen</h2>
          <p class="text-sm leading-loose text-slate-600">{{ attraction.description }}</p>
        </section>

        <section>
          <h2 class="mb-4 text-lg font-bold text-[#de5826]">Fakta</h2>
          <DetailFactList :facts="attractionFacts" />
        </section>
      </div>

      <ImageCarousel
        v-if="attraction.imageArray?.length"
        :images="attraction.imageArray"
        :alt="displayAttractionName"
      />

      <DetailReviewRating :rating="reviewRating" />

      <div class="border-t border-[#C1D2DE]/60 pt-8">
        <ReviewSection
          :target-id="attraction._id"
          target-type="attraction"
          @average-rating="handleAverageRating"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import DetailFactList from '@/components/detail/DetailFactList.vue'
import DetailHero from '@/components/detail/DetailHero.vue'
import DetailReviewRating from '@/components/detail/DetailReviewRating.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
import ReviewSection from '@/components/reviews/ReviewSection.vue'
import { useSingleAttractionView } from '@/composables/detail/useSingleAttractionView'

const {
  attraction,
  attractionError,
  attractionFacts,
  attractionLoading,
  displayAttractionName,
  handleAverageRating,
  heroImage,
  reviewRating,
} = useSingleAttractionView()
</script>

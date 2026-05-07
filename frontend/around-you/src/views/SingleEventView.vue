<template>
  <main class="min-h-screen bg-[#f5f7f9]">
    <DetailHero
      :hero-image="heroImage"
      :title="displayEventName"
      :loading="eventLoading"
      :error="eventError"
      loading-text="Henter eventdata..."
    />

    <div
      v-if="eventItem && !eventLoading"
      class="mx-auto mt-10 max-w-5xl space-y-10 px-4 pb-20 md:px-8"
    >
      <div class="grid grid-cols-1 gap-20 md:grid-cols-[2fr_1fr]">
        <section>
          <h2 class="mb-3 text-lg font-bold text-[#de5826]">Om begivenheden</h2>
          <p class="text-sm leading-loose text-slate-600">{{ eventItem.description }}</p>
        </section>

        <section>
          <h2 class="mb-4 text-lg font-bold text-[#de5826]">Fakta</h2>
          <DetailFactList :facts="eventFacts" />
        </section>
      </div>

      <ImageCarousel
        v-if="eventItem.imageArray?.length"
        :images="eventItem.imageArray"
        :alt="displayEventName"
      />

      <DetailReviewRating :rating="reviewRating" />

      <div class="border-t border-[#C1D2DE]/60 pt-8">
        <ReviewSection
          :target-id="eventItem._id"
          target-type="event"
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
import { useSingleEventView } from '@/composables/detail/useSingleEventView'

const {
  displayEventName,
  eventError,
  eventFacts,
  eventItem,
  eventLoading,
  handleAverageRating,
  heroImage,
  reviewRating,
} = useSingleEventView()
</script>
